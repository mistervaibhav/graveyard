import tempfile
import time
from pathlib import Path
from typing import Any, Mapping, Optional

import requests
from TTS.api import TTS

from ..models import Voice
from ..storage import StorageClient

MODEL_NAME = "tts_models/multilingual/multi-dataset/xtts_v2"
ALLOWED_XTTS_CLONE_KWARGS = {
    "max_ref_length",
    "gpt_cond_len",
    "gpt_cond_chunk_len",
    "sound_norm_refs",
    "librosa_trim_db",
    "load_sr",
}


def _pick_gpu(force_cpu: bool = False) -> bool:
    try:
        import torch

        return torch.cuda.is_available() and not force_cpu
    except Exception:
        return False


def clone_voice_from_url(
    voice: Voice,
    reference_url: str,
    clone_params: Optional[Mapping[str, Any]],
    storage: StorageClient,
    force_cpu: bool = False,
) -> tuple[str, int]:
    """
    Download reference audio, run XTTS cloning, upload cache to storage.

    Returns:
        (cache_object_path, creation_ms)
    """
    import os

    os.environ.setdefault("TORCHAUDIO_USE_SOUNDFILE", "1")
    os.environ["COQUI_TOS_AGREED"] = "1"

    with tempfile.TemporaryDirectory() as tmpdir:
        ref_path = Path(tmpdir) / "reference.wav"
        _download_file(reference_url, ref_path)

        use_gpu = _pick_gpu(force_cpu)
        tts = TTS(model_name=MODEL_NAME, gpu=use_gpu, progress_bar=False)

        voice_key = f"voice-{voice.id}"
        voice_dir = Path(tmpdir) / "cache"
        voice_dir.mkdir(parents=True, exist_ok=True)

        xtts_kwargs = _filter_xtts_clone_kwargs(clone_params)

        start = time.perf_counter()
        tts.synthesizer.tts_model.clone_voice(
            speaker_wav=[str(ref_path)],
            speaker_id=voice_key,
            voice_dir=str(voice_dir),
            **xtts_kwargs,
        )
        elapsed_ms = int((time.perf_counter() - start) * 1000)

        cache_file = next(voice_dir.glob("*.pth"))
        cache_bytes = cache_file.read_bytes()
        object_path = f"voices/cache/{voice.id}/voice.pth"
        storage.upload_bytes_sync(
            cache_bytes, object_path, content_type="application/octet-stream"
        )
        return object_path, elapsed_ms


def _download_file(url: str, dest: Path) -> None:
    resp = requests.get(url, timeout=60)
    resp.raise_for_status()
    dest.write_bytes(resp.content)


def _filter_xtts_clone_kwargs(
    clone_params: Optional[Mapping[str, Any]],
) -> dict[str, Any]:
    if not clone_params:
        return {}
    return {
        key: value
        for key, value in clone_params.items()
        if key in ALLOWED_XTTS_CLONE_KWARGS and value is not None
    }
