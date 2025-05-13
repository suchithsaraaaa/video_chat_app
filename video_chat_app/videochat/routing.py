from django.urls import path
from . import consumers

websocket_urlpatterns = [
    path('ws/video/<room_name>/', consumers.VideoChatConsumer.as_asgi()),
]
