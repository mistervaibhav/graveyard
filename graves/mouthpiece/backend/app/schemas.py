from datetime import datetime
from typing import Literal, Optional

from pydantic import BaseModel, Field


VoiceProvider = Literal["coqui"]
SynthesisProvider = Literal["coqui", "kokoro"]
Status = Literal["queued", "processing", "ready", "failed", "deleted"]

class XttsCloneParams(BaseModel):
    """
    Low-level XTTS cloning knobs (optional).

    Stored on the Voice and applied when generating the cached voice embedding.
    """

    max_ref_length: Optional[int] = Field(None, ge=1, le=120)
    gpt_cond_len: Optional[int] = Field(None, ge=1, le=120)
    gpt_cond_chunk_len: Optional[int] = Field(None, ge=1, le=120)
    sound_norm_refs: Optional[bool] = None
    librosa_trim_db: Optional[int] = Field(None, ge=0, le=80)
    load_sr: Optional[int] = Field(None, ge=8000, le=48000)


class VoiceCreate(BaseModel):
    name: Optional[str] = None
    language: str = "en"
    provider: VoiceProvider = "coqui"
    reference_url: str
    avatar: Optional[str] = None
    xtts: Optional[XttsCloneParams] = None


class VoiceOut(BaseModel):
    id: int
    name: Optional[str]
    provider: VoiceProvider
    language: str
    status: Status
    reference_url: Optional[str]
    cache_object_path: Optional[str]
    avatar: Optional[str]
    creation_ms: Optional[int]
    clone_params_json: Optional[str]
    error: Optional[str]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class SynthesisCreate(BaseModel):
    text: str = Field(..., min_length=1, max_length=4000)
    provider: SynthesisProvider = "coqui"
    voice_id: Optional[int] = None
    language: Optional[str] = None
    speed: Optional[float] = Field(None, gt=0.5, lt=2.0)
    temperature: Optional[float] = Field(None, ge=0.1, le=1.5)
    top_p: Optional[float] = Field(None, ge=0.1, le=1.0)
    top_k: Optional[int] = Field(None, ge=1, le=100)
    length_penalty: Optional[float] = Field(None, ge=0.5, le=1.5)
    format: Optional[str] = Field("wav", pattern="^(wav|mp3)$")


class SynthesisOut(BaseModel):
    id: int
    provider: SynthesisProvider
    voice_id: Optional[int]
    text: str
    status: Status
    params_json: str
    output_object_path: Optional[str]
    error: Optional[str]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
