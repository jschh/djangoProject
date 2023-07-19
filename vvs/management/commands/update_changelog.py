# import requests
#
# def get_releases(project_key):
#     url = "https://jshdev.atlassian.net/rest/api/latest/project/{}/versions".format(project_key)
#     response = requests.get(url)
#     if response.status_code!= 200:
#         raise Exception("Error fetching releases")
#     return response.json()
#
# def main():
#     project_key = "VVSDEV"
#     releases = get_releases(project_key)
#     print("<h1>Jira Changelog</h1>")
#     print("<ul>")
#     for release in releases:
#         print("<li>")
#         print("<a href='{}'>{}</a>".format(release["self"], release["name"]))
#         print("<br>")
#         print("{}<br>".format(release["releaseDate"]))
#         print("{}<br>".format(release["description"]))
#         print("</li>")
#     print("</ul>")
#
# if __name__ == "__main__":
#     main()