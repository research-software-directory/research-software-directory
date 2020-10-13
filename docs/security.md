
## Notes on security

The Research Software Directory is set up as a collection of services such as ``backend``, ``frontend``, ``harvesting``, etc. To avoid one service interfering with another, each service is dockerized. In a sense, docker is a bit like object oriented programming: you have your data and methods together, and other methods don't have access to data unless you specifically said that is OK.

Let's say that an attacker succeeds in somehow escaping the containment of the docker environment. If you set up your instance on Amazon EC2/S3 as described in above, that may mean that they then have access to:

1. the Research Software Directory software
1. the collections in the Mongo database
1. the plaintext keys that are stored in ``rsd-secrets.env``

Note that it does not mean they will have access to any of the rest of your institute's web site, since that content is hosted on physically different machines, in a physically different location, with different networks, different credentials, and probably a login procedure that is more challenging than just username/password.

With regard to (1), that information is public anyway. Just ``git clone`` would be a much easier way to get that information. I guess the worst they could do here is make a change to the code and break the site. Or possibly, keep the website like it is but use the Amazon machine to start mining bitcoins in the background. If that would happen though, the usage graphs that Amazon provides would clearly show a change in behavior (from a spikey pattern directly related to the crontab file to a uniform pattern).

With regard to (2), that information is (by default) harvested from public sources, so not much to be gained there. A possible risk would be if the attacker aims to change the information displayed on the website, for example, pointing links to the wrong place, or changing the description of a software package. Other risks might be that they empty the database, or change data in such a way that the site no longer works.

With regard to (3), having access to some keys matters more than having access to others. Keys that don't matter so much are ``DOMAIN``, ``SSL_ADMIN_EMAIL``, ``SSL_DOMAINS``, ``ZOTERO_LIBRARY``. Those are not really secret anyway, they are more of a configuration value.

``AUTH_GITHUB_CLIENT_ID`` and ``AUTH_GITHUB_CLIENT_SECRET`` are only useful if the attacker is a member of ``AUTH_GITHUB_ORGANIZATION``. If they in fact are a member, having access to the id and secret does not give them much extra, because they already have direct access to the database service at that point (item 2 from the list above).

``GITHUB_ACCESS_TOKEN`` provides readonly access to GitHub's publicly available data, it's just used to increase the rate limit of GitHub's API.

``ZOTERO_API_KEY`` provides readonly access to your Zotero library, which is probably public information anyway. Again its main purpose is to increase the rate limit of allowed API usage.

If an attacker had access to ``BACKUP_CMD``, that could potentially lead to the loss of your backups. They could use the username and password to throw away any backups you have in that particular S3 bucket. (Note that you could make copies to another bucket if you wanted to, or set up a different backup mechanism altogether; it _might_ be possible to configure your S3 bucket such that you can write a backup file with the credentials from ``BACKUP_CMD``, but not delete them).

``JWT_SECRET`` is only used to have services talk to each other, but doesn't give an attacker any abilities that they would not already have, given that we assumed they have access to every service already.

A couple more remarks:

- Mongo has been in the news for mongo instances running on the internet without authentication (the default installation) leaking information. The Research Software Directory runs the Mongo instance in a private network wrapped by the token-protected backend service.

- Whoever is in charge of the Amazon machine needs to do the security updates of the host machine, in particular those updates that relate to the docker/docker-compose installation. Furthermore it's a good idea to also rebuild the docker images for each service, because then they get their respective updates.

- Also be aware that a service can have dependencies which may not be completely up to date, for example if the ``requirements.txt`` is outdated. This can have security implications.

- Regarding DDOS attacks, this is possible of course but not very likely in our opinion. However in such a case you would be charged more because there is more outbound traffic. You can mitigate it by setting a "budget exceeded" alarm on your usage.

