from django.shortcuts import render


# Create your views here.
def indexView(request):
    return render(request, "cubeTimer/index.html")


def timerView(request):
    return render(request, "cubeTimer/timer.html")