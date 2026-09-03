import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.security.websocket import AllowedHostsOriginValidator

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "source.settings")

django_asgi_app = get_asgi_application()

from apps.conversations.routing import websocket_urlpatterns as conv_ws
from apps.notifications.routing import websocket_urlpatterns as notif_ws
from apps.conversations.middleware import JwtAuthMiddleware

application = ProtocolTypeRouter({
    "http": django_asgi_app,
    "websocket": AllowedHostsOriginValidator(
        JwtAuthMiddleware(
            URLRouter(conv_ws + notif_ws)
        )
    ),
})