import uuid
from typing import Optional

from fastapi import APIRouter, HTTPException, Query

from ..storage import StorageClient

router = APIRouter(prefix="/files", tags=["files"])

storage_client = StorageClient()


@router.post("/presign")
def presign_upload(
    filename: str,
    content_type: Optional[str] = Query(None),
    folder: str = Query("uploads"),
):
    ext = filename.split(".")[-1] if "." in filename else "bin"
    object_name = f"{folder}/{uuid.uuid4()}.{ext}"
    upload_url = storage_client.presigned_put(object_name, content_type=content_type)
    download_url = storage_client.presigned_get(object_name, expiry_seconds=24 * 3600)
    return {
        "object_name": object_name,
        "upload_url": upload_url,
        "download_url": download_url,
    }


@router.get("/url")
def presign_download(object_name: str, expiry_seconds: int = Query(3600)):
    if not object_name:
        raise HTTPException(status_code=400, detail="object_name is required")
    url = storage_client.presigned_get(object_name, expiry_seconds=expiry_seconds)
    return {"object_name": object_name, "download_url": url}
