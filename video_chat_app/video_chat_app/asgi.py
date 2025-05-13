import os
from channels.routing import ProtocolTypeRouter, URLRouter
from django.core.asgi import get_asgi_application
from channels.auth import AuthMiddlewareStack
import videochat.routing

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'video_chat_app.settings')

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": AuthMiddlewareStack(
        URLRouter(
            videochat.routing.websocket_urlpatterns
        )
    ),
})
