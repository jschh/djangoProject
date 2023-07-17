from django.shortcuts import render
from django.http import HttpResponseRedirect

# Create your views here.


def indexView(request):
    return render(request, "vvs/index.html")

