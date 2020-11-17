# Updating data from 2.x to 3.x

mongodb run migrate.js

## Optional: get project data

Optionally get project data from esciencecenter.nl corporate website:

```
sudo rm -r docker-volumes/db/*
docker-compose build
docker-compose up -d
docker-compose logs

# (new terminal)
python3 -m virtualenv -p python3 venv3
source venv3/bin/activate
pip install -r ./harvesting/requirements.txt
source .env
export PYTHONWARNINGS="ignore:Unverified HTTPS request"
export PYTHONPATH=$PYTHONPATH:`pwd`/harvesting
python3 data-migration/2.x-to-3.x/harvest_project_info_nlesc.py

# then, update the cache
docker-compose exec harvesting python app.py resolve all
```
