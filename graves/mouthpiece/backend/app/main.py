from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .config import settings
from .db import init_db
from .routers import files, syntheses, voices


def create_app() -> FastAPI:
    init_db()

    app = FastAPI(title=settings.app_name)

    app.add_middleware(
        CORSMiddleware,  # type: ignore[arg-type]
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    api_prefix = settings.api_prefix
    app.include_router(voices.router, prefix=api_prefix)
    app.include_router(syntheses.router, prefix=api_prefix)
    app.include_router(files.router, prefix=api_prefix)

    @app.get("/health", tags=["health"])
    def health():
        return {"status": "ok"}

    return app


app = create_app()
