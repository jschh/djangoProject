from django.urls import path
from . import views



app_name = "typeracer"
urlpatterns = [
    path("", views.indexView, name="index"),
]
