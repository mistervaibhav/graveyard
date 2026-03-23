import json
from typing import List

from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, status
from sqlalchemy.orm import Session

from .. import schemas
from ..db import get_session, new_session
from ..models import Synthesis, Voice
from ..services.synthesis import synthesize_coqui
from ..storage import StorageClient


router = APIRouter(prefix="/syntheses", tags=["syntheses"])

storage_client = StorageClient()


def _db(session: Session = Depends(get_session)):
    return session


def _synth_task(synth_id: int) -> None:
    session = new_session()
    try:
        synth = session.get(Synthesis, synth_id)
        if not synth:
            return
        try:
            synth.status = "processing"
            session.add(synth)
            session.commit()

            if synth.provider == "coqui":
                if not synth.voice_id:
                    raise RuntimeError("voice_id required for provider 'coqui'")
                voice = session.get(Voice, synth.voice_id)
                if not voice:
                    raise RuntimeError("Voice not found")
                output_path = synthesize_coqui(
                    synthesis=synth,
                    voice=voice,
                    storage=storage_client,
                    language=(
                        json.loads(synth.params_json).get("language")
                        if synth.params_json
                        else None
                    ),
                )
                synth.output_object_path = output_path
                synth.status = "ready"
            else:
                synth.status = "failed"
                synth.error = "Kokoro provider not implemented"

            session.add(synth)
            session.commit()
        except Exception as exc:  # noqa: BLE001
            synth.status = "failed"
            synth.error = str(exc)
            session.add(synth)
            session.commit()
    finally:
        session.close()


@router.post(
    "", response_model=schemas.SynthesisOut, status_code=status.HTTP_201_CREATED
)
def create_synthesis(
    payload: schemas.SynthesisCreate,
    background_tasks: BackgroundTasks,
    session: Session = Depends(_db),
):
    if payload.provider == "coqui" and payload.voice_id is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="voice_id is required for provider='coqui'",
        )

    synth = Synthesis(
        provider=payload.provider,
        voice_id=payload.voice_id,
        text=payload.text,
        status="queued",
        params_json=json.dumps(payload.model_dump()),
    )
    session.add(synth)
    session.commit()
    session.refresh(synth)

    background_tasks.add_task(_synth_task, synth.id)
    return synth


@router.get("", response_model=List[schemas.SynthesisOut])
def list_syntheses(session: Session = Depends(_db)):
    items = session.query(Synthesis).all()
    return items


@router.get("/{synthesis_id}", response_model=schemas.SynthesisOut)
def get_synthesis(synthesis_id: int, session: Session = Depends(_db)):
    synth = session.get(Synthesis, synthesis_id)
    if not synth:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Synthesis not found"
        )
    return synth
