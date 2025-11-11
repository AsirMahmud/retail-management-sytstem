from django.apps import AppConfig


class OnlinePreorderConfig(AppConfig):
    name = 'apps.online_preorder'
    verbose_name = 'Online Preorder'

    def ready(self):
        # Import signals
        from . import signals  # noqa: F401





