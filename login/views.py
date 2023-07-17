from django.http import Http404
from django.shortcuts import get_object_or_404, render
from django.http import HttpResponseRedirect, HttpResponse
from .models import Choice, Question
from django.urls import reverse
from django.views import generic


# Create your views here.


class IndexView(generic.ListView):
    template_name = "login/index.html"
    context_object_name = "latest_question_list"

    def get_queryset(self):
        """Return the last five published questions."""
        return Question.objects.order_by("-pub_date")[:5]


class DetailView(generic.DetailView):
    model = Question
    template_name = "login/detail.html"


class ResultsView(generic.DetailView):
    model = Question
    template_name = "login/results.html"


def vote(request, question_id):
    question = get_object_or_404(Question, pk=question_id)
    try:
        selected_choice = question.choice_set.get(pk=request.POST["choice"])
    except (KeyError, Choice.DoesNotExist):
        # Redisplay the question voting form
        return render(
            request,
            "login/detail.html",
            {
                "question": question,
                "error_message": "You didn't select a choice."
            },
        )
    else:
        selected_choice.votes += 1
        selected_choice.save()

        return HttpResponseRedirect(reverse("login:results", args=(question.id,)))


def landingView(request):
    return render(request, "login/landing.html")
