import uuid
from dataclasses import dataclass
from pathlib import Path

from app.core.config import settings
from app.services.rag.embeddings import SentenceTransformerEmbeddings
from app.services.rag.parser import extract_text_from_pdf
from app.services.rag.text_splitter import build_text_splitter
from app.services.rag.vector_store import FaissVectorStore


@dataclass
class IngestionResult:
    document_id: str
    chunks: int
    stored: bool


class RagPipeline:
    def __init__(self, upload_dir: Path | None = None, index_dir: Path | None = None) -> None:
        self._upload_dir = upload_dir or Path(settings.rag_upload_dir)
        self._index_dir = index_dir or Path(settings.rag_index_dir)
        self._embeddings = SentenceTransformerEmbeddings(settings.rag_embedding_model)
        self._store = FaissVectorStore(
            index_path=self._index_dir / "faiss.index",
            metadata_path=self._index_dir / "metadata.json",
            dimension=self._embeddings.dimension,
        )
        self._splitter = build_text_splitter(settings.rag_chunk_size, settings.rag_chunk_overlap)

    def ingest_pdf(self, file_path: Path, source_name: str | None = None) -> IngestionResult:
        text = extract_text_from_pdf(file_path)
        if not text:
            return IngestionResult(document_id="", chunks=0, stored=False)
        chunks = self._splitter.split_text(text)
        vectors = self._embeddings.embed_documents(chunks)
        doc_id = str(uuid.uuid4())
        payloads = [
            {"text": chunk, "source": source_name or file_path.name, "document_id": doc_id}
            for chunk in chunks
        ]
        self._store.add(vectors, payloads)
        return IngestionResult(document_id=doc_id, chunks=len(chunks), stored=True)
