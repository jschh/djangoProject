from django.urls import path
from . import views
from .views import changelogView

app_name = "vvs"
urlpatterns = [
    path("", views.indexView, name="index"),
    path('changelog/', changelogView, name='changelog'),
]
