# research-software-directory-backend
Backend for the eScience Research Software Directory

```
mkvirtualenv rsd
pip install -r requirements.txt
export FLASK_APP=`pwd`/entry.py
export FLASK_DEBUG=1
flask run
