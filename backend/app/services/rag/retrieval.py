from dataclasses import dataclass
from pathlib import Path

from app.core.config import settings
from app.services.rag.embeddings import SentenceTransformerEmbeddings
from app.services.rag.vector_store import FaissVectorStore


@dataclass
class RetrievalResult:
    text: str
    source: str
    score: float


class RetrievalService:
    def __init__(self, index_dir: Path | None = None) -> None:
        self._index_dir = index_dir or Path(settings.rag_index_dir)
        self._embeddings = SentenceTransformerEmbeddings(settings.rag_embedding_model)
        self._store = FaissVectorStore(
            index_path=self._index_dir / "faiss.index",
            metadata_path=self._index_dir / "metadata.json",
            dimension=self._embeddings.dimension,
        )

    def retrieve(self, query: str, top_k: int | None = None) -> list[RetrievalResult]:
        vector = self._embeddings.embed_query(query)
        hits = self._store.search(vector, top_k or settings.rag_top_k)
        results = []
        for hit in hits:
            results.append(
                RetrievalResult(
                    text=hit.get("text", ""),
                    source=hit.get("source", ""),
                    score=hit.get("score", 0.0),
                )
            )
        return results
