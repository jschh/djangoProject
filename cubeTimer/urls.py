from django.urls import path
from . import views




app_name = "cubeTimer"
urlpatterns = [
    path("", views.indexView, name="index"),
    path("timer/", views.timerView, name="timer"),
]
