from django.shortcuts import render
from django.http import HttpResponse
from django.template import loader
from django.views import generic
from django.urls import reverse_lazy
from django.contrib.auth.decorators import login_required


# Create your views here.

@login_required(login_url='login')
def indexView(request):
    return render(request, 'kracher/index.html')
