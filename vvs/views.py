from django.http import Http404
from django.shortcuts import get_object_or_404, render
from django.http import HttpResponseRedirect, HttpResponse
from django.urls import reverse
from django.views import generic
from vvs.models import ChangeLog
from django.views.generic import ListView
from django.contrib.auth.decorators import login_required


# Create your views here
@login_required(login_url='login')
def indexView(request):
    return render(request, "vvs/index.html")
@login_required(login_url='login')
def changelogView(request):
    return render(request, "vvs/changelog.html")






