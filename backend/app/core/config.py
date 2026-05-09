from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict

BASE_DIR = Path(__file__).resolve().parents[3]


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=(BASE_DIR / ".env"),
        env_file_encoding="utf-8",
    )

    environment: str = "development"
    project_name: str = "SupportPilot AI"
    api_prefix: str = "/api"
    database_url: str = "sqlite+aiosqlite:///./supportpilot.db"
    frontend_origin: str = "http://localhost:5173"
    log_level: str = "INFO"
    db_pool_size: int = 5
    db_max_overflow: int = 10
    rag_upload_dir: str = "storage/uploads"
    rag_index_dir: str = "storage/index"
    rag_embedding_model: str = "sentence-transformers/all-MiniLM-L6-v2"
    rag_chunk_size: int = 800
    rag_chunk_overlap: int = 120
    rag_top_k: int = 5
    groq_api_key: str = ""
    groq_model: str = "llama3-70b-8192"
    groq_temperature: float = 0.2
    groq_max_tokens: int = 512
    groq_fallback_models: str = "llama3-8b-8192"
    escalation_confidence_threshold: float = 0.55
    escalation_negative_threshold: float = -0.4
    confidence_floor: float = 0.6
    auto_resolve_classes: str = "account,technical,general"
    twilio_account_sid: str = ""
    twilio_auth_token: str = ""
    twilio_whatsapp_number: str = ""
    twilio_whatsapp_sandbox_join_code: str = ""
    twilio_validate_webhook: bool = True


settings = Settings()
