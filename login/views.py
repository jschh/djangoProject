from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.forms import inlineformset_factory
from .models import *
from django.contrib.auth.forms import UserCreationForm
from djangoProject.forms import CreateUserForm

def landingView(request):
    return render(request, "login/landing.html")

def registerPage(request):
    form = CreateUserForm()

    if request.method == "POST":
        form = CreateUserForm(request.POST)
        if form.is_valid():
            form.save()

            return redirect("login")

    context = {'form': form}
    return render(request, "login/register.html", context)

def loginPage(request):
    context = {}
    return render(request, "login/login.html", context)
