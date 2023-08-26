from django.http import HttpResponse
from django.template import loader
from django.views import generic
from django.urls import reverse_lazy
from django.contrib.auth.decorators import login_required
from django.contrib.admin.views.decorators import staff_member_required
from .models import Witz
from django.shortcuts import render, redirect
from django.http import JsonResponse


# Create your views here.

@login_required(login_url='login')
def indexView(request):
    return render(request, 'kracher/kracher.html')


@staff_member_required(login_url='login')
def alle_witze(request):
    witze = Witz.objects.all()
    return render(request, 'kracher/alle_witze.html', {'witze': witze})



def edit_witz(request, witz_id):
    if request.method == 'POST':
        try:
            witz = Witz.objects.get(pk=witz_id)
            data = json.loads(request.body)
            witz.content = data['content']  # Nehmen wir an, "content" ist das Feld in Ihrem Modell
            witz.save()
            return JsonResponse({"message": "Witz erfolgreich bearbeitet!"})
        except Witz.DoesNotExist:
            return JsonResponse({"error": "Witz nicht gefunden."}, status=404)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    return JsonResponse({"error": "Nur POST-Anfragen erlaubt."}, status=405)

def add_witz(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        Witz.objects.create(text=data['text'])
        return JsonResponse({"message": "Neuer Witz hinzugefügt"})
