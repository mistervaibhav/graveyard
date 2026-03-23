"""
Minimal MinIO usage via boto3 (S3-compatible).

Run from repo root after setting up .env or adjusting constants below.
"""

import boto3
from botocore.client import Config

ENDPOINT = "http://127.0.0.1:9000"
ACCESS_KEY = "minio"
SECRET_KEY = "minio123"
BUCKET = "test-bucket"


def main() -> None:
    s3 = boto3.client(
        "s3",
        region_name="us-east-1",
        endpoint_url=ENDPOINT,
        aws_access_key_id=ACCESS_KEY,
        aws_secret_access_key=SECRET_KEY,
        config=Config(s3={"addressing_style": "path"}),  # forcePathStyle: True
    )

    # Create bucket if it doesn't exist.
    try:
        s3.create_bucket(Bucket=BUCKET)
    except s3.exceptions.BucketAlreadyOwnedByYou:
        pass
    except s3.exceptions.BucketAlreadyExists:
        pass

    s3.put_object(Bucket=BUCKET, Key="hello.txt", Body=b"hello world")
    print("Uploaded hello.txt to", BUCKET)


if __name__ == "__main__":
    main()
