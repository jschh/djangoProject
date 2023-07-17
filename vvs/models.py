from django.db import models


# Create your models here.
class ChangeLog(models.Model):
    version = models.CharField(max_length=200)
    date = models.DateField()
    changes = models.TextField()

    def __str__(self):
        return self.version
