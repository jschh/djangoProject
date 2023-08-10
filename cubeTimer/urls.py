
from django.urls import path
from . import views


app_name = "cubeTimer"
urlpatterns = [
    path("", views.indexView, name="index"),
    path('add_time/', views.add_time, name='add_time'),
    path('get_times/', views.get_times, name='get_times'),
    path('delete_last_time/', views.delete_last_time, name='delete_last_time'),
    path('delete_all_times/', views.delete_all_times, name='delete_all_times'),
]


