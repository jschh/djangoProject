from django.urls import path
from . import views

app_name = "vvs"
urlpatterns = [
    path("", views.indexView.as_view(), name="changelog")
]