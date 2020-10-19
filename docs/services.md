# Services of the Research Software Directory

The Research Software Directory is made of the following services

- [frontend](/frontend): Python web application which renders HTML pages for normal visitors
- [backend](/backend): Python web service for programmatic access to the directory data (software, projects, persons, organizations). Used by other services to fetch and set data.
- [reverse-proxy](/reverse-proxy): Web server responsible for combining all web based services behind a single domain and port. Also hosts the static files of other services for best performance and caching.
- [admin](/admin/): React application for editing the data in the directory. Hosted by `reverse-proxy` service.
- [auth-github](/auth-github): Protects the `admin` service by forcing authentication with a GitHub account and authorization using GitHub organization membership.
- [https](/https): Responsible for encrypting (HTTPS) traffic from `reverse-proxy` service.- [backup](/backup): For backup, copies database to an S3 bucket every day. Only runs when configured.
- [database](/database): A Mongo database. Used by `backend` service to store data. Initializes with sample data when database is empty.
- [graphs](/graphs): Web page which shows metrics of directory. Hosted by `reverse-proxy` service.
- [harvesting](/harvesting): Scheduled jobs which periodicaly fetch external data. For example commits from GitHub and mentions from Zotero.

All these services are started in the [Docker compose file](/docker-compose.yml). All services have their own directory in the repository.
