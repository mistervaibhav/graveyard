#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT_DIR"

if [ -f "$ROOT_DIR/.env" ]; then
  set -a
  # shellcheck disable=SC1090
  source "$ROOT_DIR/.env"
  set +a
else
  echo ".env not found; using defaults from backend/app/config.py"
fi

if ! command -v uv >/dev/null 2>&1; then
  echo "uv is required (https://github.com/astral-sh/uv). Please install it first." >&2
  exit 1
fi

if [ ! -d "$ROOT_DIR/.venv" ]; then
  echo "Creating virtual env with uv..."
  uv venv "$ROOT_DIR/.venv"
fi

echo "Activating venv and installing dependencies..."
# shellcheck disable=SC1091
source "$ROOT_DIR/.venv/bin/activate"
uv pip install -r "$ROOT_DIR/requirements.txt"

echo "Starting FastAPI on http://0.0.0.0:8000 ..."
exec uvicorn backend.app.main:app --app-dir "$ROOT_DIR" --host 0.0.0.0 --port 8000 --reload
