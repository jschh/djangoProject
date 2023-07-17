from django.urls import path
from . import views
from .views import ChangeLogView

app_name = "vvs"
urlpatterns = [
    path("", views.indexView, name="index"),
    path('changelog/', ChangeLogView.as_view(), name='changelog'),
]
