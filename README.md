# research-software-directory-backend
Backend for the eScience Research Software Directory
- *Setup:*
```
mkvirtualenv rsd
pip install -r requirements.txt
export FLASK_APP=`pwd`/entry.py
export FLASK_DEBUG=1
```
- *Run unit tests:*
```
PYTHONPATH=`pwd` pytest
```
- *Run API server:*
```
flask run
```
- *export MongoDB data:*
```
flask export file.tar.gz
```
- *import MongoDB data exported with `flask export`:*
```
flask import file.tar.gz
```