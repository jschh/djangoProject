from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.forms import inlineformset_factory
from .models import *
from django.contrib.auth.forms import UserCreationForm
from djangoProject.forms import CreateUserForm
from django.contrib import messages
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required


def landingView(request):
    return render(request, "login/landing.html")

def registerPage(request):
    form = CreateUserForm()

    if request.method == "POST":
        form = CreateUserForm(request.POST)
        if form.is_valid():
            form.save()
            messages.success(request, "Account was created successfully!")

            return redirect("login")

    context = {'form': form}
    return render(request, "login/register.html", context)

def loginPage(request):
    if request.method == "POST":
        username = request.POST.get("username")
        password = request.POST.get("password")

        user = authenticate(request, username = username, password = password)

        if user is not None:
            login(request, user)
            return redirect("landing")
        else:
            messages.info(request, "Username or password is incorrect")

    context = {}
    return render(request, "login/login.html", context)

def logoutUser(request):
    logout(request)
    return redirect("login")