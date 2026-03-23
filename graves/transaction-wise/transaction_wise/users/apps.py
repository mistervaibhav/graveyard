import contextlib

from django.apps import AppConfig
from django.utils.translation import gettext_lazy as _


class UsersConfig(AppConfig):
    name = "transaction_wise.users"
    verbose_name = _("Users")

    def ready(self):
        with contextlib.suppress(ImportError):
            import transaction_wise.users.signals  # noqa: F401
