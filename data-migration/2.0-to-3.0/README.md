# Updating data from 2.0.2 to 3.0.x

The following code snippet emulates the situation where the code is in version 3.0.x while the data is in version 2.0.2.

```shell
# update the references
git fetch --tags

# give me the code state for 3.0.0 ...
git checkout 3.0.0
```

If you don't have a database filled with 2.x version data, it can be filled with sample data from version 2.0.2 using

```shell
git checkout 2.0.2 -- database/db-init
```

but for the 2.0.2 sample data to get used, you'll need to remove the current database files from `docker-volumes/db` as
well, see instructions [here](/docs/dev.md#removing-local-state). Note this has the potential for **THE LOSS OF
DATA**.

It should now be possible to upgrade the sample data as follows:

```shell
docker-compose build
docker-compose up -d
docker-compose log --follow
```

If you opted to fill the database with 2.0.2 sample data by doing the `git checkout 2.0.2 -- database/db-init` above,
you can roll back those changes once the Research Software Directory is up (and has had time to restore the database
files from `db-init`) using:

```shell
git reset HEAD database/db-init
git checkout -- database/db-init
```

Verify that the API is serving v2.0.2 data by visiting [http://localhost/api/project/764](http://localhost/api/project/764).

Then, in a new terminal,

```shell
# copy the migrate script to inside the running database service
docker cp data-migration/2.0-to-3.0/migrate.js $(docker-compose ps -q database):/tmp

# run the migrate script
docker-compose exec database mongo rsd /tmp/migrate.js

# update the cache
docker-compose exec harvesting python app.py resolve all
```

The data you get from the API should now be according to the 3.0.x schema, e.g.
[http://localhost/api/project/764](http://localhost/api/project/764), and all aspects of the site should now work. You
should verify if everything works by doing the checks mentioned in section [Verifying the local
installation](https://github.com/research-software-directory/research-software-directory/blob/3.0.0/docs/dev.md#verifying-the-local-installation).

## Optional: get project data

Optionally update the project data from [esciencecenter.nl corporate website](https://esciencecenter.nl) by doing following (continue in the
terminal from the previous section):

```shell
python3 -m virtualenv -p python3 venv3
source venv3/bin/activate
pip install -r ./data-migration/2.0-to-3.0/requirements.txt
source .env
export PYTHONWARNINGS="ignore:Unverified HTTPS request"
export PYTHONPATH=$PYTHONPATH:`pwd`/harvesting
python3 data-migration/2.0-to-3.0/harvest_project_info_nlesc.py

# again, update the cache
docker-compose exec harvesting python app.py resolve all
```

The data you get from the API should now include richer data for the projects, e.g.
[http://localhost/api/project/764](http://localhost/api/project/764), which means that the corresponding project pages
are also richer, e.g. [http://localhost/projects/764](http://localhost/projects/764). All aspects of the site should
now work. You should verify if everything works by doing the checks mentioned in section [Verifying the local
installation](https://github.com/research-software-directory/research-software-directory/blob/3.0.0/docs/dev.md#verifying-the-local-installation).

## Optional: add project start and end dates

```shell
# copy the script to inside the running database service
docker cp data-migration/2.0-to-3.0/add-project-dates.js $(docker-compose ps -q database):/tmp

# run the migrate script
docker-compose exec database mongo rsd /tmp/add-project-dates.js

# update the cache
docker-compose exec harvesting python app.py resolve all
```
