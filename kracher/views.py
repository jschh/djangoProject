from django.shortcuts import render
from django.http import HttpResponse
from django.template import loader
from django.views import generic
from django.urls import reverse_lazy


# Create your views here.

def indexView(request):
    return render(request, 'kracher/index.html')

