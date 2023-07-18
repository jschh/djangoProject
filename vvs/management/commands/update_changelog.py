from django.core.management.base import BaseCommand
from vvs.models import ChangeLog
import requests
from requests.auth import HTTPBasicAuth
import json


class Command(BaseCommand):
    help = "Updates the changelog"

    def handle(self, *args, **options):
        auth = HTTPBasicAuth('josch.11121@gmail.com',
                             'ATATT3xFfGF0WbUwKVGuwcdyAM1RvwRN4x0qWCS3NL_3d0x7DhRGrc5rZ1cDkdMnAZ08Z4feN5UEgTmiQsUkBKd4Xjn6LNuqzC1qEvAHVF06S2Q4bHMpv9qzx3rl_B6eTPVk1gVgSMQ7tXcR4YFLtXv8C1hTTpvVeAQcSqmz58bUVLUrdfGk600=C2D16871')

        url = "https://jshdev.atlassian.net/rest/api/3/project/VVSDEV/versions"

        headers = {
            "Accept": "application/json"
        }

        response = requests.request(
            "GET",
            url,
            headers=headers,
            auth=auth
        )

        versions = json.loads(response.text)

        for version in versions:
            if "releaseDate" in version:
                ChangeLog.objects.update_or_create(
                    version=version["name"],
                    defaults={
                        'release_date': version["releaseDate"],
                        'description': version["description"],
                    }
                )

        self.stdout.write(self.style.SUCCESS("Successfully updated changelog"))
