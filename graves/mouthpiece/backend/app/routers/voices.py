import json
from typing import List

from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, status
from sqlalchemy.orm import Session

from .. import schemas
from ..db import get_session, new_session
from ..models import Voice
from ..services.voice_clone import clone_voice_from_url
from ..storage import StorageClient


router = APIRouter(prefix="/voices", tags=["voices"])

storage_client = StorageClient()


def _db(session: Session = Depends(get_session)):
    return session


def _clone_task(voice_id: int) -> None:
    session = new_session()
    try:
        voice = session.get(Voice, voice_id)
        if not voice:
            return
        if not voice.reference_url:
            voice.status = "failed"
            voice.error = "Missing reference_url"
            session.add(voice)
            session.commit()
            return

        clone_params: dict = {}
        try:
            clone_params = json.loads(voice.clone_params_json or "{}") or {}
        except Exception:  # noqa: BLE001
            clone_params = {}
        try:
            voice.status = "processing"
            session.add(voice)
            session.commit()

            cache_path, creation_ms = clone_voice_from_url(
                voice=voice,
                reference_url=voice.reference_url,
                clone_params=clone_params,
                storage=storage_client,
            )
            voice.cache_object_path = cache_path
            voice.creation_ms = creation_ms
            voice.status = "ready"
            session.add(voice)
            session.commit()
        except Exception as exc:  # noqa: BLE001
            voice.status = "failed"
            voice.error = str(exc)
            session.add(voice)
            session.commit()
    finally:
        session.close()


@router.post("", response_model=schemas.VoiceOut, status_code=status.HTTP_201_CREATED)
async def create_voice(
    payload: schemas.VoiceCreate,
    background_tasks: BackgroundTasks,
    session: Session = Depends(_db),
):
    clone_params_json = "{}"
    if payload.xtts:
        clone_params_json = payload.xtts.model_dump_json(exclude_none=True)

    voice = Voice(
        name=payload.name,
        provider=payload.provider,
        language=payload.language,
        reference_url=payload.reference_url,
        avatar=payload.avatar,
        clone_params_json=clone_params_json,
        status="queued",
    )
    session.add(voice)
    session.commit()
    session.refresh(voice)

    background_tasks.add_task(_clone_task, voice.id)
    return voice


@router.get("", response_model=List[schemas.VoiceOut])
def list_voices(session: Session = Depends(_db)):
    voices = session.query(Voice).filter(Voice.status != "deleted").all()
    return voices


@router.get("/{voice_id}", response_model=schemas.VoiceOut)
def get_voice(voice_id: int, session: Session = Depends(_db)):
    voice = session.get(Voice, voice_id)
    if not voice or voice.status == "deleted":
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Voice not found"
        )
    return voice


@router.delete("/{voice_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_voice(voice_id: int, session: Session = Depends(_db)):
    voice = session.get(Voice, voice_id)
    if not voice:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Voice not found"
        )
    voice.status = "deleted"
    session.add(voice)
    session.commit()
    return None
