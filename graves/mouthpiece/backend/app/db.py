from datetime import datetime

from sqlalchemy import create_engine, event, text
from sqlalchemy.orm import DeclarativeBase, Mapped, Session, mapped_column

from .config import settings


class Base(DeclarativeBase):
    """Base class for SQLAlchemy models."""

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    created_at: Mapped[datetime] = mapped_column(default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(
        default=datetime.utcnow, onupdate=datetime.utcnow
    )


# Use SQLite file; check_same_thread disabled for multi-threaded access from FastAPI.
engine = create_engine(
    f"sqlite:///{settings.sqlite_path}", echo=False, connect_args={"check_same_thread": False}
)


@event.listens_for(Session, "before_flush")
def update_timestamps(session, flush_context, instances):
    now = datetime.utcnow()
    for obj in session.dirty:
        if isinstance(obj, Base):
            obj.updated_at = now


def get_session() -> Session:
    session = Session(engine)
    try:
        yield session
    finally:
        session.close()


def new_session() -> Session:
    """Utility for manual session management outside FastAPI dependencies."""
    return Session(engine)


def init_db() -> None:
    from . import models  # noqa: F401

    settings.sqlite_path.parent.mkdir(parents=True, exist_ok=True)
    Base.metadata.create_all(engine)
    _migrate_sqlite()


def _migrate_sqlite() -> None:
    """Lightweight SQLite migrations for local dev."""

    def ensure_column(table: str, column: str, ddl_type: str) -> None:
        with engine.begin() as conn:
            rows = conn.execute(text(f"PRAGMA table_info({table})")).fetchall()
            existing = {row[1] for row in rows}  # row[1] = name
            if column in existing:
                return
            conn.execute(text(f"ALTER TABLE {table} ADD COLUMN {column} {ddl_type}"))

    # voices table schema drift (added fields over time)
    ensure_column("voices", "reference_url", "TEXT")
    ensure_column("voices", "avatar", "TEXT")
    ensure_column("voices", "creation_ms", "INTEGER")
    ensure_column("voices", "clone_params_json", "TEXT")
