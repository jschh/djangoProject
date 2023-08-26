from django.urls import path
from . import views
from django.contrib import admin




app_name = "kracher"
urlpatterns = [
    path('admin/', admin.site.urls),
    path("", views.indexView, name="index"),
    path('all/', views.alle_witze, name='alle_witze'),
    path('edit/<int:witz_id>/', views.edit_witz, name='edit_witz'),
    path('add/', views.add_witz, name='add_witz'),

]
