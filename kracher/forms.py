from django import forms
from .models import Witz

class WitzForm(forms.ModelForm):
    class Meta:
        model = Witz
        fields = ['text']  # oder welche Felder auch immer Ihr Witz-Modell hat
