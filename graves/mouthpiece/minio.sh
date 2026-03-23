
#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT_DIR"

if [ -f "$ROOT_DIR/.env" ]; then
  set -a
  # shellcheck disable=SC1090
  source "$ROOT_DIR/.env"
  set +a
fi

# Ensure root user/pass set for MinIO, falling back to access key vars.
export MINIO_ROOT_USER="${MINIO_ROOT_USER:-${MINIO_ACCESS_KEY:-minioadmin}}"
export MINIO_ROOT_PASSWORD="${MINIO_ROOT_PASSWORD:-${MINIO_SECRET_KEY:-minioadmin}}"

DATA_DIR="${MINIO_DATA_DIR:-$ROOT_DIR/.minio}"
mkdir -p "$DATA_DIR"

echo "Starting MinIO at ${MINIO_ENDPOINT:-localhost:9000} (console :9001), data: $DATA_DIR"
minio server "$DATA_DIR" --console-address ":9001" &
MINIO_PID=$!

cleanup() {
  echo "Stopping MinIO (pid $MINIO_PID)..."
  kill "$MINIO_PID" >/dev/null 2>&1 || true
  wait "$MINIO_PID" 2>/dev/null || true
  exit 0
}

trap cleanup INT TERM
wait "$MINIO_PID"
