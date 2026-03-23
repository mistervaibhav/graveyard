import os
from pathlib import Path
from typing import Optional

from TTS.api import TTS
from TTS.utils.generic_utils import slugify


os.environ.setdefault("TORCHAUDIO_USE_SOUNDFILE", "1")
os.environ["COQUI_TOS_AGREED"] = "1"


MODEL_NAME = "tts_models/multilingual/multi-dataset/xtts_v2"
EMOTIONS = [
    "Neutral",
    "Happy",
    "Sad",
    "Angry",
    "Terrified",
    "Whispering",
    "Shouting",
]


def synthesize_speech(
    text: str,
    reference_wav: Optional[Path] = None,
    output_path: Path = Path("outputs/clone.wav"),
    language: str = "en",
    force_cpu: bool = False,
    voice_id: Optional[str] = None,
    voice_dir: Path = Path("voice_cache"),
    emotion: Optional[str] = None,
) -> Path:
    """
    Generate speech from text using an optional reference clip for voice cloning.

    Args:
        text: The sentence or paragraph to synthesize.
        reference_wav: Path to a short audio sample of the target voice.
        output_path: Where to write the generated waveform.
        language: ISO 639-1/2 language code for the text (e.g., "en", "es").
        force_cpu: Set True to avoid attempting GPU acceleration.
        voice_id: Optional name to cache and reuse a cloned voice.
        voice_dir: Directory where cloned voices are stored (as .pth).
        emotion: Optional emotion name (Coqui Studio-only; XTTS ignores this).
    """
    try:
        import torch

        use_gpu = torch.cuda.is_available() and not force_cpu
    except Exception:
        use_gpu = False

    output_path.parent.mkdir(parents=True, exist_ok=True)
    tts = TTS(model_name=MODEL_NAME, progress_bar=True, gpu=use_gpu)

    speaker_arg: Optional[str] = None
    speaker_wav_arg: Optional[str] = str(reference_wav) if reference_wav else None
    voice_dir_arg: Optional[str] = None

    if voice_id:
        voice_key = slugify(voice_id)
        voice_dir = Path(voice_dir)
        voice_dir.mkdir(parents=True, exist_ok=True)
        voice_cache_path = voice_dir / f"{voice_key}.pth"
        voice_dir_arg = str(voice_dir)

        if voice_cache_path.exists():
            print(f"Using cached voice '{voice_id}' from {voice_cache_path}")
            speaker_arg = voice_id
            speaker_wav_arg = None  # load from cache
        else:
            if not reference_wav:
                raise ValueError(
                    f"Voice '{voice_id}' is not cached and no reference_wav was provided to create it."
                )
            print(f"Caching new voice '{voice_id}' to {voice_cache_path}")
            speaker_arg = voice_id

    emotion_arg: Optional[str] = None
    if emotion:
        if emotion not in EMOTIONS:
            raise ValueError(f"Emotion '{emotion}' is not in supported set {EMOTIONS}.")
        # Coqui TTS only honors emotion for Studio models. XTTS will ignore/raise,
        # so we only forward when using a Studio model.
        if "studio" in MODEL_NAME:
            emotion_arg = emotion
        else:
            print(
                f"Ignoring emotion='{emotion}' because model '{MODEL_NAME}' does not support it."
            )

    tts.tts_to_file(
        text=text,
        file_path=str(output_path),
        speaker=speaker_arg,
        speaker_wav=speaker_wav_arg,
        voice_dir=voice_dir_arg,
        language=language,
        emotion=emotion_arg,
    )

    return output_path.resolve()


def main():
    # --- Quick edit section: change these values and rerun `python -m src.main`.
    text_to_say = """ I am happy to join with you today in what will go down in history as the greatest demonstration for freedom in the history of our nation.
    Five score years ago a great American in whose symbolic shadow we stand today signed the Emancipation Proclamation. This momentous decree is a great beacon light of hope to millions of Negro slaves who had been seared in the flames of withering injustice. It came as a joyous daybreak to end the long night of their captivity. But 100 years later the Negro still is not free. One hundred years later the life of the Negro is still badly crippled by the manacles of segregation and the chains of discrimination. One hundred years later the Negro lives on a lonely island of poverty in the midst of a vast ocean of material prosperity. One hundred years later the Negro is still languished in the corners of American society and finds himself in exile in his own land. So we've come here today to dramatize a shameful condition """
    reference_audio = Path("samples/PeterGriffin.wav")
    language_code = "en"
    output_file = Path("outputs/clone.wav")
    force_cpu = False  # set True to avoid using GPU even if available
    cached_voice_name = "peter"  # set to None to skip caching/reuse
    voice_cache_dir = Path("voice_cache")
    emotion = None  # Options (Studio-only): Neutral, Happy, Sad, Angry, Terrified, Whispering, Shouting

    if reference_audio and not reference_audio.exists():
        cache_file = (
            voice_cache_dir / f"{slugify(cached_voice_name)}.pth"
            if cached_voice_name
            else None
        )
        if cache_file and cache_file.exists():
            print(
                f"Reference audio not found at {reference_audio!s}; using cached voice at {cache_file} if available."
            )
        else:
            print(
                f"Reference audio not found at {reference_audio!s}; falling back to default voice."
            )
        reference_audio = None

    audio_path = synthesize_speech(
        text=text_to_say,
        reference_wav=reference_audio,
        output_path=output_file,
        language=language_code,
        force_cpu=force_cpu,
        voice_id=cached_voice_name,
        voice_dir=voice_cache_dir,
        emotion=emotion,
    )
    print(f"Synthesized audio saved to {audio_path}")


if __name__ == "__main__":
    main()
