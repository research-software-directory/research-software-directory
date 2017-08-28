# research-software-directory-backend
Backend for the eScience Research Software Directory.
### Requirements:
- Python 3
- Pip
- mkvirtualenv (`pip install virtualenvwrapper`)
- Mongodb server

### Configuration:
- Copy `src/settings.dist.py` to `src/settings.py`

### Setup
```
mkvirtualenv rsd -p `which python3`
pip install -r requirements.txt
export FLASK_APP=`pwd`/entry.py
export FLASK_DEBUG=1

```
### Run unit tests
```
PYTHONPATH=`pwd` pytest
```

### Run API server
```
flask run
```

### export MongoDB data
```
flask export file.tar.gz
```

### import MongoDB data exported with `flask export`
```
flask import file.tar.gz
```