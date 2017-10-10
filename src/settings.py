import os
import json

settings = {}

required_settings = [
    "GITHUB_ACCESS_TOKEN",
    "LIBRARIES_IO_API_KEY",
    "ZOTERO_API_KEY",
    "GITHUB_CLIENT_ID",
    "GITHUB_CLIENT_SECRET",
    "DATABASE_HOST",
    "DATABASE_PORT",
    "DATABASE_NAME",
    "DATA_FOLDER"
]

for setting in required_settings:
    settings[setting] = None

try:
    import os
    this_dir = os.path.dirname(os.path.abspath(__file__))
    settings_file_name = os.path.join(this_dir, '..', 'settings.json')
    with open(settings_file_name) as settings_file:
        data = json.load(settings_file)
        for key in settings:
            settings[key] = data[key] if key in data else None
except FileNotFoundError:
    pass

for key in settings:
    if key in os.environ:
        settings[key] = os.environ[key]
    # if settings[key] is None:
    #     raise EnvironmentError("%s not set (add to environment or settings.remote.json)" % key)

if 'DATA_FOLDER' in settings and settings['DATA_FOLDER'] is not None:
    if not os.path.exists(settings['DATA_FOLDER']):
        os.makedirs(settings['DATA_FOLDER'])

    if not os.path.exists(settings['DATA_FOLDER']+'/images'):
        os.makedirs(settings['DATA_FOLDER']+'/images')
