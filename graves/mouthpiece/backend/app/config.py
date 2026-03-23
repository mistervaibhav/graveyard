from pathlib import Path

from pydantic import AliasChoices, Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    app_name: str = "mouthpiece-backend"
    api_prefix: str = "/api"

    # SQLite database file lives in backend/app/app.db by default.
    sqlite_path: Path = Path(__file__).resolve().parent / "app.db"

    # MinIO / S3-compatible storage.
    minio_endpoint: str = "localhost:9000"
    minio_access_key: str = Field(
        default="minioadmin",
        validation_alias=AliasChoices("MINIO_ACCESS_KEY", "MINIO_ROOT_USER", "minio_access_key"),
    )
    minio_secret_key: str = Field(
        default="minioadmin",
        validation_alias=AliasChoices(
            "MINIO_SECRET_KEY", "MINIO_ROOT_PASSWORD", "minio_secret_key"
        ),
    )
    minio_use_ssl: bool = False
    minio_bucket: str = "mouthpiece"


settings = Settings()
