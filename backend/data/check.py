import requests
import json
import sys

if not len(sys.argv) == 2:
    print("use as 'python check.py [JSON_WEB_TOKEN]'")
    exit(1)

jwt = sys.argv[1]

software_list = requests.get('http://localhost:5001/software').json()
for sw in software_list:
    resp = requests.patch(
        'http://localhost:5001/software/' + sw['primaryKey']['id'] + '?test=1',
        json.dumps(sw),
        headers={
            'Authorization': 'Bearer ' + jwt
        }
    ).json()
    if 'error' in resp:
        print(sw['primaryKey']['id'] + ': (' + ' -> '.join(map(lambda x: str(x), resp['path'])) + ') ' + resp['error'])
    else:
        print(sw['primaryKey']['id'] + ': OK')
