# Customize your instance of the Research Software Directory


Let's say you followed the steps above, and have a running instance of the
Research Software Directory. Now it is time to start customizing your Research
Software Directory. We have prepared some FAQs for customizations that are
common. For example, you can read up on the following topics:

1. [How do I change the colors?](/docs/faq/how-do-i-change-the-colors.md)
1. [How do I change the font?](/docs/faq/how-do-i-change-the-font.md)
1. [How do I change the logo?](/docs/faq/how-do-i-change-the-logo.md)
1. [How do I change when data collection scripts run?](/docs/faq/how-do-i-change-when-data-collection-scripts-run.md)
1. [How do I empty the database?](/docs/faq/how-do-i-empty-the-database.md)
1. [How do I make changes to the admin interface?](/docs/faq/how-do-i-make-changes-to-the-admin-interface.md)
1. [How do I add properties to the data schema?](/docs/faq/how-do-i-add-properties-to-the-data-schema.md)

It is suggested that you first do one or more of:

1. [How do I change the colors?](/docs/faq/how-do-i-change-the-colors.md)
1. [How do I change the font?](/docs/faq/how-do-i-change-the-font.md)
1. [How do I change the logo?](/docs/faq/how-do-i-change-the-logo.md)

Then, learn how to add properties to the schema:

1. [How do I add properties to the data schema?](/docs/faq/how-do-i-add-properties-to-the-data-schema.md)

Finally, learn how to empty the database, such that you can replace the sample
data with your own:

1. [How do I empty the database?](/docs/faq/how-do-i-empty-the-database.md)


## General workflow when making changes

After making your changes, here's how you get to see them:

1. Go to the terminal where you started ``docker-compose``
1. Use Ctrl+C to stop the running instance of Research Software Directory
1. Check which docker containers you have with:

    ```
    docker-compose ps
    ```

    For example, mine says:

    ```
    docker-compose ps
           Name                     Command                State     Ports
    ----------------------------------------------------------------------
    rsd-admin            sh -c rm -rf /build/* && c ...   Exit 0
    rsd-authentication   /bin/sh -c gunicorn --prel ...   Exit 0
    rsd-backend          /bin/sh -c gunicorn --prel ...   Exit 0
    rsd-database         /mongo.sh --bind_ip 0.0.0.0      Exit 137
    rsd-frontend         /bin/sh -c sh -c "mkdir -p ...   Exit 0
    rsd-nginx-ssl        /bin/sh -c /start.sh             Exit 137
    rsd-reverse-proxy    /bin/sh -c nginx -g 'daemo ...   Exit 137
    rsd-harvesting       /bin/sh -c crond -d7 -f          Exit 137
    ```

    Use ``docker-compose rm`` to delete container by their **service name**, e.g. the ``rsd-frontend`` container:

    ```
    docker-compose rm frontend
    ```

    List all docker images on your system:
    ```
    docker images
    ```

    Note that image names consist of the environment variable ``COMPOSE_PROJECT_NAME``, followed by ``/``,
    followed by the service name. Remove as follows:

    ```
    docker rmi rsd/frontend
    ```
1. Make changes to the source code of the service whose container and image you just removed
1. Rebuild containers as necessary, using:

    ```
    docker-compose build frontend
    docker-compose up -d frontend
    ```
