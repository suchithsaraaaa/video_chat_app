from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),               # root/homepage
    path('<str:room_name>/', views.room, name='room'), # existing chat room route
]
