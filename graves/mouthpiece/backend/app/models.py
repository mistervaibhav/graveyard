from typing import Optional

from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column

from .db import Base


class Voice(Base):
    __tablename__ = "voices"

    name: Mapped[Optional[str]]
    provider: Mapped[str] = mapped_column(default="coqui")
    language: Mapped[str] = mapped_column(default="en")
    status: Mapped[str] = mapped_column(default="queued")  # queued|ready|failed|deleted
    reference_url: Mapped[Optional[str]] = mapped_column(default=None)
    cache_object_path: Mapped[Optional[str]] = mapped_column(default=None)
    avatar: Mapped[Optional[str]] = mapped_column(default=None)
    creation_ms: Mapped[Optional[int]] = mapped_column(default=None)  # ms to generate cache
    clone_params_json: Mapped[str] = mapped_column(default="{}")
    error: Mapped[Optional[str]] = mapped_column(default=None)


class Synthesis(Base):
    __tablename__ = "syntheses"

    provider: Mapped[str] = mapped_column(default="coqui")  # coqui|kokoro
    voice_id: Mapped[Optional[int]] = mapped_column(
        ForeignKey("voices.id"), nullable=True
    )
    text: Mapped[str]
    status: Mapped[str] = mapped_column(
        default="queued"
    )  # queued|processing|ready|failed
    params_json: Mapped[str] = mapped_column(
        default="{}"
    )  # JSON string for tuning knobs
    output_object_path: Mapped[Optional[str]] = mapped_column(default=None)
    error: Mapped[Optional[str]] = mapped_column(default=None)
