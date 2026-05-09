from typing import Iterable

from sentence_transformers import SentenceTransformer


class SentenceTransformerEmbeddings:
    def __init__(self, model_name: str) -> None:
        self._model = SentenceTransformer(model_name)

    def embed_documents(self, texts: Iterable[str]) -> list[list[float]]:
        return self._model.encode(list(texts), normalize_embeddings=True).tolist()

    def embed_query(self, text: str) -> list[float]:
        return self._model.encode([text], normalize_embeddings=True)[0].tolist()

    @property
    def dimension(self) -> int:
        return self._model.get_sentence_embedding_dimension()
