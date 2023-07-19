from django.urls import path
from . import views



app_name = "kracher"
urlpatterns = [
    path("", views.indexView, name="index"),
]
