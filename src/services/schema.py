import os
import json

schema = {}
for (_, _, files) in os.walk('schema'):
    for (filename, file) in [(file, open('schema/' + file)) for file in files]:
        schema[filename.split('.')[0]] = json.load(file)
