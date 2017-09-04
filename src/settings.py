import os
import json

settings = {}

required_settings = [
    "GITHUB_ACCESS_TOKEN",
    "LIBRARIES_IO_API_KEY",
    "GITHUB_CLIENT_ID",
    "GITHUB_CLIENT_SECRET",
    "DATABASE_HOST",
    "DATABASE_PORT"
    "DATABASE_NAME"
]

for setting in required_settings:
    settings[setting] = None

try:
    with open('settings.json') as settings_file:
        data = json.load(settings_file)
        for key in settings:
            settings[key] = data[key] if key in data else None
except FileNotFoundError:
    pass

for key in settings:
    if key in os.environ:
        settings[key] = os.environ[key]
    if settings[key] is None:
        raise EnvironmentError("%s not set (add to environment or settings.json)" % key)


print(settings)