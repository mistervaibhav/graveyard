import tempfile
from pathlib import Path
from typing import Optional

import requests
from TTS.api import TTS

from ..models import Synthesis, Voice
from ..storage import StorageClient

MODEL_NAME = "tts_models/multilingual/multi-dataset/xtts_v2"


def _pick_gpu(force_cpu: bool = False) -> bool:
    try:
        import torch

        return torch.cuda.is_available() and not force_cpu
    except Exception:
        return False


def synthesize_coqui(
    synthesis: Synthesis,
    voice: Voice,
    storage: StorageClient,
    language: Optional[str] = None,
    force_cpu: bool = False,
) -> str:
    """
    Run XTTS synthesis using a cached voice. Returns object path for the output audio.
    """
    import os

    os.environ.setdefault("TORCHAUDIO_USE_SOUNDFILE", "1")
    os.environ["COQUI_TOS_AGREED"] = "1"

    if not voice.cache_object_path:
        raise RuntimeError("Voice cache not ready")

    with tempfile.TemporaryDirectory() as tmpdir:
        voice_dir = Path(tmpdir) / "voice"
        voice_dir.mkdir(parents=True, exist_ok=True)

        voice_key = f"voice-{voice.id}"
        cache_url = storage.presigned_get(voice.cache_object_path, expiry_seconds=3600)
        cache_bytes = _download_bytes(cache_url)
        cache_path = voice_dir / f"{voice_key}.pth"
        cache_path.write_bytes(cache_bytes)

        use_gpu = _pick_gpu(force_cpu)
        tts = TTS(model_name=MODEL_NAME, gpu=use_gpu, progress_bar=False)

        out_path = Path(tmpdir) / "output.wav"
        tts.tts_to_file(
            text=synthesis.text,
            speaker=voice_key,
            voice_dir=str(voice_dir),
            language=language or voice.language,
            file_path=str(out_path),
        )

        audio_bytes = out_path.read_bytes()
        object_path = f"outputs/{synthesis.id}.wav"
        storage.upload_bytes_sync(audio_bytes, object_path, content_type="audio/wav")
        return object_path


def _download_bytes(url: str) -> bytes:
    resp = requests.get(url, timeout=120)
    resp.raise_for_status()
    return resp.content
