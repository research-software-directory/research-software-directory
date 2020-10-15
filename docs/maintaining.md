# Documentation for maintainers

## Checking if there's any documentation with invalid links

The repository comes with documentation spread out over multiple MarkDown files.
[This workflow file](/.github/workflows/markdown-link-checker.yml) is set up to check whether there are broken links in
any of them. If you want to check this locally, you can do so with:

```shell
# from the repository root directory
npm install
npm run mlc
```

## Visualizing ``docker-compose.yml``

It is sometimes helpful to visualize the structure in the ``docker-compose.yml`` file.
Use https://github.com/pmsipilot/docker-compose-viz to generate a png image.

```
docker run --rm -it --name dcv -v $(pwd):/input pmsipilot/docker-compose-viz render -m image --output-file=docs/images/docker-compose.png docker-compose.yml
```

For example,

![/docs/images/docker-compose.png](/docs/images/docker-compose.png)

## Making a release

1. Write the release notes
1. Update CITATION.cff
1. Generate the metadata file for Zenodo using [cffconvert](https://pypi.org/project/cffconvert/).

    ```bash
    pip install --user cffconvert
    cffconvert --outputformat zenodo --ignore-suspect-keys --outfile .zenodo.json
    ```
    ```bash
    # git add, commit, and push everything
    ```

1. Make sure that everything is pushed

    ```bash
    cd $(mktemp -d)
    git clone https://github.com/research-software-directory/research-software-directory.git
    cd research-software-directory
    ```

1. Follow the notes from the ['For developers'](#documentation-for-developers) section above, and verify that it all works as it should.
1. Use GitHub's ``Draft a new release`` button [here](https://github.com/research-software-directory/research-software-directory/releases) to make a release.

## Pulling in changes from upstream using a three-way merge

Set ``UPSTREAM`` and ``DOWNSTREAM`` to the different sources you want to
three-way merge between, e.g.

```bash
UPSTREAM=https://github.com/research-software-directory/research-software-directory.git
DOWNSTREAM=https://github.com/process-project/research-software-directory.git
```

Then:

```bash
cd $(mktemp -d)
mkdir left middle right
cd left && git clone $UPSTREAM . && cd -
cd middle && git clone $DOWNSTREAM . && git branch develop && git checkout develop && cd -
cd right && git clone $DOWNSTREAM . && cd -
meld left middle right &
```

You should only make changes to the ``middle`` one. When you're done making your changes,

```bash
git add <the files>
git commit
git push origin develop
```

## Updating a production instance

Every now and then, the production instance needs to be updated, so the server
can get the latest security patches, and the Research Software Directory
software itself can be updated to include the latest features.

The steps below differentiate between the old and the new instance of the Research
Software Directory; the old instance has IP ``35.156.38.208``, the new one has
IP ``3.122.233.225``. Your IP addresses will likely be different.

1. Make a new Amazon instance by following the notes above. Some things to think about:
    - Reuse the existing security group.
    - Reuse the existing key pair.
    - Verify that you're allowed to ssh into the new instance.
1. Transfer the ``rsd-secrets.env`` file from the old instance to the new instance.

    ```shell
    $ cd $(mktemp -d)
    $ scp -i ~/.ssh/rsd-instance-for-nlesc-on-aws.pem \
      ubuntu@35.156.38.208:/home/ubuntu/rsd/rsd-secrets.env .
    $ scp -i ~/.ssh/rsd-instance-for-nlesc-on-aws.pem \
      ./rsd-secrets.env \
      ubuntu@3.122.233.225:/home/ubuntu/rsd/rsd-secrets.env
    ```
1. On the remote, create the symlink `.env` and let it point to `rsd-secrets.env`:

    ```shell
    cd ~/rsd
    ln -s rsd-secrets.env .env
    ```

1. Transfer files related to SSL certificates from the old instance to the new instance.

    ```shell
    # (on the new machine, remove the cert directory from
    # /home/ubuntu/rsd/docker-volumes/ if it exists)

    $ scp -r -i ~/.ssh/rsd-instance-for-nlesc-on-aws.pem \
      ubuntu@35.156.38.208:/home/ubuntu/rsd/docker-volumes/cert .

    $ scp -r -i ~/.ssh/rsd-instance-for-nlesc-on-aws.pem \
      ./cert \
      ubuntu@3.122.233.225:/home/ubuntu/rsd/docker-volumes/cert

    # on the new machine, change the owner of cert/ to 'root'
    $ ssh -i ~/.ssh/rsd-instance-for-nlesc-on-aws.pem ubuntu@3.122.233.225
    $ cd /home/ubuntu/rsd/docker-volumes
      sudo chown -R root:root cert
    ```

1. Stop new additions to the database in the old research software
   directory instance by stopping the ``rsd-admin`` service.

    ```
    $ ssh -i ~/.ssh/rsd-instance-for-nlesc-on-aws.pem ubuntu@35.156.38.208
    $ cd /home/ubuntu/rsd
    $ docker-compose stop rsd-admin
    ```

1. Create the backup files in the old Research Software Directory instance:

    ```
    # start an interactive shell in the backup container
    $ docker-compose exec backup /bin/sh

    # create the backup files in the container's /dump directory
    /app # mongodump \
      --host ${DATABASE_HOST} \
      --port ${DATABASE_PORT} \
      --db ${DATABASE_NAME} \
      --out /dump

    # leave the backup container
    exit

    # Copy the dump directory out of the docker container
    docker cp $(docker-compose ps -q backup):/dump/rsd /home/ubuntu/rsd/dump
    ```

1. Transfer the dumped json and bson files from the old to the new instance

    ```
    scp -r -i ~/.ssh/rsd-instance-for-nlesc-on-aws.pem \
    ubuntu@35.156.38.208:/home/ubuntu/rsd/dump .

    scp -r -i ~/.ssh/rsd-instance-for-nlesc-on-aws.pem \
    ./dump/* ubuntu@3.122.233.225:/home/ubuntu/rsd/database/db-init/

    ```

1. Start the new Research Software Directory instance.

    ```
    $ ssh -i ~/.ssh/rsd-instance-for-nlesc-on-aws.pem ubuntu@3.122.233.225
    $ cd /home/ubuntu/rsd

    $ docker-compose build
    $ docker-compose up -d
    ```

1. Check [/CHANGELOG.md](/CHANGELOG.md) to see if you need to run any command to
   migrate data, e.g. when a collection has changed its schema.

1. Next, harvest all the data from external sources using:

    ```
    $ docker-compose exec harvesting python app.py harvest all
    $ docker-compose exec harvesting python app.py resolve all
    ```

1. In case the old instance had problems with harvesting of the mentions, you
   may need to retrieve all mentions, as follows:

    ```
    $ docker-compose exec harvesting python app.py harvest mentions --since-version 0
    ```

1. Check if the instance works correctly using a browser to navigate to
   the new instance's IP address.
1. If everything looks good, stop the Research Software Directory in the old instance

    ```
    $ docker-compose stop
    ```

1. Disassociate the ElasticIP address from the old instance.
1. Associate the ElasticIP address with the new instance.

As a final step, use the Amazon EC2 management console to ``Stop`` (not
``Terminate``) the old instance. This way, the old instance can still be
reactivated in case you need to get back to the old version.