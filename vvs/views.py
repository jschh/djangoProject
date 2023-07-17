from django.http import Http404
from django.shortcuts import get_object_or_404, render
from django.http import HttpResponseRedirect, HttpResponse
from django.urls import reverse
from django.views import generic
from vvs.models import ChangeLog
from django.views.generic import ListView

# Create your views here.

# class IndexView(generic.ListView):
#     template_name = "vvs/index.html"
#     context_object_name = "latest_question_list"


def indexView(request):
    return render(request, "vvs/index.html")

def changelogView(request):
    return render(request, "vvs/changelog.html")

class ChangeLogView(ListView):
    model = ChangeLog
    template_name = "vvs/changelog.html"






