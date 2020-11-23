# Running an instance of the Research Software Directory in production

## Temporarily disabling the admin interface

You can stop users from making changes to the database by disabling the authentication to the admin interface, as follows:

```shell
docker-compose stop auth
```

This can be useful when upgrading the data or software to a newer version.

Note that even with a stopped `auth` service, determined users can still access `backend` directly, and users who were
logged in before you disable `auth` will still be able to use the admin interface to make changes.

It it recommended that you post a message that users see when they try to use the admin interface. The easiest way to do
this is as follows:

```shell
# check volume names
# Login to admin service
docker-compose run -w /build admin sh

# rename index.html
mv index.html index.html.disabled

# put a message in index.html
echo "<html>" \
"<head></head>" \
"<body>Sorry, we're doing maintenance right now. " \
"Hopefully be back soon.</body></html>" > index.html

You can check if it works by using your browser to navigate to the admin interface. Instead of the normal interface, you
should now see your message.

To enable admin interface again do the previous instructions in reverse

```shell
# inside admin container
mv /build/index.html /build/index.html.disabled

# Enable logins again
docker-compose start auth


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
    cd $(mktemp -d)
    scp -i ~/.ssh/rsd-instance-for-nlesc-on-aws.pem \
       ubuntu@35.156.38.208:/home/ubuntu/rsd/rsd-secrets.env .
    scp -i ~/.ssh/rsd-instance-for-nlesc-on-aws.pem \
       ./rsd-secrets.env \
       ubuntu@3.122.233.225:/home/ubuntu/rsd/rsd-secrets.env
    ```
1. On the remote, create the symlink `.env` and let it point to `rsd-secrets.env`:

    ```shell
    cd ~/rsd
    ln -s rsd-secrets.env .env
    ```

1. Stop new additions to the database in the old research software
   directory instance by stopping the ``rsd-admin`` service.

    ```shell
    ssh -i ~/.ssh/rsd-instance-for-nlesc-on-aws.pem ubuntu@35.156.38.208
    cd /home/ubuntu/rsd
    docker-compose stop rsd-admin
    ```

1. Create the backup files in the old Research Software Directory instance:

    ```shell
    # start an interactive shell in the backup container
    docker-compose exec backup /bin/sh

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

    ```shell
    scp -r -i ~/.ssh/rsd-instance-for-nlesc-on-aws.pem \
       ubuntu@35.156.38.208:/home/ubuntu/rsd/dump .

    scp -r -i ~/.ssh/rsd-instance-for-nlesc-on-aws.pem \
       ./dump/* ubuntu@3.122.233.225:/home/ubuntu/rsd/database/db-init/

    ```

1. Start the new Research Software Directory instance.

    ```shell
    ssh -i ~/.ssh/rsd-instance-for-nlesc-on-aws.pem ubuntu@3.122.233.225
    cd /home/ubuntu/rsd

    docker-compose build
    docker-compose up -d
    ```

1. Check [/CHANGELOG.md](/CHANGELOG.md) to see if you need to run any command to
   migrate data, e.g. when a collection has changed its schema.

1. Next, harvest all the data from external sources using:

    ```shell
    docker-compose exec harvesting python app.py harvest all
    docker-compose exec harvesting python app.py resolve all
    ```

1. In case the old instance had problems with harvesting of the mentions, you
   may need to retrieve all mentions, as follows:

    ```shell
    docker-compose exec harvesting python app.py harvest mentions --since-version 0
    ```

1. Check if the instance works correctly using a browser to navigate to
   the new instance's IP address.
1. If everything looks good, stop the Research Software Directory in the old instance

    ```shell
    docker-compose stop
    ```

1. Disassociate the ElasticIP address from the old instance.
1. Associate the ElasticIP address with the new instance.

As a final step, use the Amazon EC2 management console to ``Stop`` (not
``Terminate``) the old instance. This way, the old instance can still be
reactivated in case you need to get back to the old version.
