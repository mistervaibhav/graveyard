import io
from typing import BinaryIO, Optional

import boto3
from botocore.client import Config
from botocore.exceptions import ClientError
from starlette.concurrency import run_in_threadpool

from .config import settings


class StorageClient:
    def __init__(self) -> None:
        self.client = boto3.client(
            "s3",
            endpoint_url=f"http{'s' if settings.minio_use_ssl else ''}://{settings.minio_endpoint}",
            region_name="us-east-1",
            aws_access_key_id=settings.minio_access_key,
            aws_secret_access_key=settings.minio_secret_key,
            config=Config(s3={"addressing_style": "path"}),
        )
        self._ensure_bucket()

    def _ensure_bucket(self) -> None:
        try:
            self.client.head_bucket(Bucket=settings.minio_bucket)
        except ClientError as exc:
            code = int(exc.response.get("Error", {}).get("Code", 0))
            if code == 404:
                self.client.create_bucket(Bucket=settings.minio_bucket)
            else:
                raise

    async def upload_fileobj(
        self, fileobj: BinaryIO, object_name: str, length: int
    ) -> str:
        """Upload a file-like object to storage asynchronously."""
        fileobj.seek(0)
        data = fileobj.read()

        await run_in_threadpool(
            lambda: self.client.put_object(
                Bucket=settings.minio_bucket,
                Key=object_name,
                Body=data,
                ContentLength=length,
                ContentType="application/octet-stream",
            )
        )
        return object_name

    async def upload_bytes(
        self, data: bytes, object_name: str, content_type: Optional[str] = None
    ) -> str:
        await run_in_threadpool(
            lambda: self.client.put_object(
                Bucket=settings.minio_bucket,
                Key=object_name,
                Body=io.BytesIO(data),
                ContentLength=len(data),
                ContentType=content_type or "application/octet-stream",
            )
        )
        return object_name

    def presigned_get(self, object_name: str, expiry_seconds: int = 3600) -> str:
        return self.client.generate_presigned_url(
            "get_object",
            Params={"Bucket": settings.minio_bucket, "Key": object_name},
            ExpiresIn=expiry_seconds,
        )

    def upload_bytes_sync(self, data: bytes, object_name: str, content_type: Optional[str] = None) -> str:
        self.client.put_object(
            Bucket=settings.minio_bucket,
            Key=object_name,
            Body=io.BytesIO(data),
            ContentLength=len(data),
            ContentType=content_type or "application/octet-stream",
        )
        return object_name

    def presigned_put(self, object_name: str, expiry_seconds: int = 3600, content_type: Optional[str] = None) -> str:
        params = {"Bucket": settings.minio_bucket, "Key": object_name}
        if content_type:
            params["ContentType"] = content_type
        return self.client.generate_presigned_url(
            "put_object",
            Params=params,
            ExpiresIn=expiry_seconds,
        )
