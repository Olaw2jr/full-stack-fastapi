import sentry_sdk

from app.core.celery_app import celery_app
from app.core.config import settings

sentry_sdk.init(
    settings.SENTRY_DSN,
    # Enable performance monitoring
    enable_tracing=True,
)


@celery_app.task(acks_late=True)
def test_celery(word: str) -> str:
    return f"test task return {word}"
