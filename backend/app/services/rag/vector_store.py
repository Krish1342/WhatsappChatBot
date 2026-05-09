import json
from pathlib import Path
from typing import Any

import faiss
import numpy as np


class FaissVectorStore:
    def __init__(self, index_path: Path, metadata_path: Path, dimension: int) -> None:
        self._index_path = index_path
        self._metadata_path = metadata_path
        self._dimension = dimension
        self._index = self._load_index()
        self._metadata = self._load_metadata()

    def add(self, vectors: list[list[float]], metadata: list[dict[str, Any]]) -> None:
        if not vectors:
            return
        self._index.add(self._to_array(vectors))  # type: ignore[call-arg]
        self._metadata.extend(metadata)
        self._persist()

    def search(self, query_vector: list[float], top_k: int) -> list[dict[str, Any]]:
        if self._index.ntotal == 0:
            return []
        distances, indices = self._index.search(
            self._to_array([query_vector]), top_k
        )  # type: ignore[call-arg]
        hits = []
        for score, idx in zip(distances[0], indices[0], strict=False):
            if idx < 0 or idx >= len(self._metadata):
                continue
            payload = dict(self._metadata[idx])
            payload["score"] = float(score)
            hits.append(payload)
        return hits

    def _persist(self) -> None:
        self._index_path.parent.mkdir(parents=True, exist_ok=True)
        faiss.write_index(self._index, str(self._index_path))
        with self._metadata_path.open("w", encoding="utf-8") as handle:
            json.dump(self._metadata, handle, ensure_ascii=False)

    def _load_index(self) -> faiss.Index:
        if self._index_path.exists():
            return faiss.read_index(str(self._index_path))
        return faiss.IndexFlatIP(self._dimension)

    def _load_metadata(self) -> list[dict[str, Any]]:
        if not self._metadata_path.exists():
            return []
        with self._metadata_path.open("r", encoding="utf-8") as handle:
            return json.load(handle)

    @staticmethod
    def _to_array(vectors: list[list[float]]):
        return np.array(vectors, dtype="float32")
