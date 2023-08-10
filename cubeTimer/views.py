# views.py
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse, HttpResponse
from django.shortcuts import render
from .models import Time
from django.views.decorators.csrf import csrf_exempt
import json
from django.http import JsonResponse


@csrf_exempt
def add_time(request):
    if request.method == 'POST':
        # Parse the JSON data
        data = json.loads(request.body)
        time_value = data['time']

        # Create a new Time object with the current user and the provided time value
        time_entry = Time(user=request.user, value=time_value)
        time_entry.save()

        return JsonResponse({"status": "success"})
    return JsonResponse({"status": "error"})


@login_required
def get_times(request):
    if request.method == 'GET':
        # Filter times based on the authenticated user
        times = Time.objects.filter(user=request.user).order_by('-created_at')

        # Convert the times to a list to return as JSON
        times_list = [time.value for time in times]

        return JsonResponse(times_list, safe=False)


# Create your views here
@login_required(login_url='login')
def indexView(request):
    return render(request, "cubeTimer/cubeTimer.html")


@login_required
@csrf_exempt
def delete_last_time(request):
    if request.method == 'POST':
        # Filter the times based on the authenticated user before deleting
        last_time = Time.objects.filter(user=request.user).latest('id')
        last_time.delete()
        return JsonResponse({'message': 'Last time deleted successfully.'})


@login_required
@csrf_exempt
def delete_all_times(request):
    if request.method == 'POST':
        # Delete only times associated with the authenticated user
        Time.objects.filter(user=request.user).delete()
        return JsonResponse({'message': 'All times deleted successfully.'})

