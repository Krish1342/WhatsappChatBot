from pathlib import Path

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.db.session import get_db
from app.models.uploaded_document import DocumentStatus, UploadedDocument
from app.schemas.documents import DocumentUploadResponse
from app.services.rag.pipeline import RagPipeline

router = APIRouter()


@router.post("/documents/upload", response_model=DocumentUploadResponse)
async def upload_document(
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
) -> DocumentUploadResponse:
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Only PDF files are supported")

    upload_dir = Path(settings.rag_upload_dir)
    upload_dir.mkdir(parents=True, exist_ok=True)
    file_path = upload_dir / file.filename

    contents = await file.read()
    file_path.write_bytes(contents)

    pipeline = RagPipeline(upload_dir=upload_dir)
    result = pipeline.ingest_pdf(file_path, source_name=file.filename)
    if not result.stored:
        await db.rollback()
        raise HTTPException(status_code=400, detail="Failed to ingest document")

    document = UploadedDocument(
        filename=file.filename,
        content_type=file.content_type,
        storage_path=str(file_path),
        size_bytes=len(contents),
        status=DocumentStatus.processed,
    )
    db.add(document)
    await db.commit()

    return DocumentUploadResponse(
        document_id=result.document_id,
        filename=file.filename,
        chunks=result.chunks,
        stored=result.stored,
    )
