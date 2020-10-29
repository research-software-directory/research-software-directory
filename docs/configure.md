# Configuring the Research Software Directory

The research software directory is configured using a file with environment
variables called `.env`. An example config file
(`rsd-secrets.env.example`) is available, use it as a starting point.

```bash
cd research-software-directory
cp rsd-secrets.env.example .env
```

The config file has some placeholder values (`changeme`); they must be set by
editing the `rsd-secrets.env` file. Below are instructions on how to get the
different tokens and keys.

## ``COMPOSE_PROJECT_NAME``

This is a prefix that docker-compose uses in naming its images, containers, and
volumes in order to avoid name clashes. Its default value is ``rsd``.

## ``AUTH_GITHUB_CLIENT_ID`` and ``AUTH_GITHUB_CLIENT_SECRET``

These environment variables are used for authenticating a user, such that they
can be granted access to the admin interface to create, read, update, and delete
items in the Research Software Directory.

These are the steps to assign values:

1. Go to https://github.com/settings/developers
1. Click the ``New OAuth App`` button
1. Under ``Application name``, write something like _The Research Software
Directory's admin interface on localhost_
1. Under ``Homepage URL`` fill in some URL, for example, let it point to this
readme on GitHub. Despite the fact that it is a required field, its value is
not used as far as I can tell.
1. Optionally add a description. This is especially useful if you have multiple OAuth apps
1. The most important setting is the value for ``Authorization callback url``.
Set it to http://localhost/auth/get_jwt for now. We will revisit
``AUTH_GITHUB_CLIENT_ID`` and ``AUTH_GITHUB_CLIENT_SECRET`` in the section about
deployment
[below](#make-your-instance-available-to-others-by-hosting-it-online-deployment)
1. Click ``Register application``
1. Assign the ``Client ID`` as value for ``AUTH_GITHUB_CLIENT_ID`` and assign
the ``Client Secret`` as value for ``AUTH_GITHUB_CLIENT_SECRET``

## ``AUTH_GITHUB_ORGANIZATION``

Data is entered into the Research Software Directory via the admin interface.
Set ``AUTH_GITHUB_ORGANIZATION`` to the name of the GitHub organization whose
members should be allowed access to the admin interface. Most likely, it is the
name of the organization where you forked this repository to.

Note: members should make their membership of the GitHub organization public. Go
to
[https://github.com/orgs/&lt;your-github-organization&gt;/people](https://github.com/orgs/your-github-organization/people)
to see which users are a member of &lt;your-github-organization&gt;, and whether
their membership is public or not.

## ``GITHUB_ACCESS_TOKEN``

To query GitHub's API programmatically, we need an access token. Here's how you can get one:

1. Go to https://github.com/settings/tokens
1. Click ``Generate new token``
1. Under ``Token description``, fill in something like _Key to programmatically retrieve information from GitHub's API_
1. Verify that all scopes are unchecked
1. Use token as value for ``GITHUB_ACCESS_TOKEN``

## ``ZENODO_ACCESS_TOKEN``

To query Zenodo's API programmatically, we need an access token. Here's how you can get one:

1. Go to https://zenodo.org/account/settings/applications/tokens/new/
1. For name, fill in something like _Key to retrieve data from Zenodo_
1. Make sure all scopes are unselected
1. Click Create
1. Fill in the long string you get as value for ``ZENODO_ACCESS_TOKEN``

## ``ZOTERO_LIBRARY``

When getting the references data from Zotero, this environment variable
determines which library on Zotero is going to be harvested. Go to
https://www.zotero.org/groups/ to see which Zotero groups you are a member of.
If you click on the ``Group library`` link there, the URL will change to
something like
https://www.zotero.org/groups/1689348/netherlands_escience_center/items, where
``1689348`` is the value you need to assign to ``ZOTERO_LIBRARY``.


## ``ZOTERO_API_KEY``

To query Zotero's API programmatically, we need an API key. Here's how
you can get one:

1. https://www.zotero.org/settings/keys
1. Click ``Create new private key``
1. Type a description of the key, e.g. _API key to access library X on Zotero_
1. Under ``Personal library``, make sure only ``Allow library access`` is checked.
1. Under ``Default group permissions``, choose ``None``
1. Under ``Specific groups``, check ``Per group permissions``
1. Set ``Read only`` for the group that you want to harvest your references data from; verify that any other groups are set to ``None``
1. Click the ``Save Key`` button at the bottom of the page.
1. On the ``Key Created`` page, you will see a string of random character,
something like ``bhCJSBCcjzptBvd3fvliYOoE``. This is the key; assign it to
``ZOTERO_API_KEY``

## ``BACKUP_CMD``

This environment variable is used for making a daily backup of the database with
software, people, projects, etc. As it is typically only used during deployment,
leave its value like it is for now; we will revisit it in the page about
[deployment](hosting.md).


## ``JWT_SECRET``

<!-- This environment variable is used for ... TODO -->

The ``JWT_SECRET`` is simply a string of random characters. You can generate one
yourself using the ``openssl`` command line tool, as follows:

```bash
openssl rand -base64 32
```

Assign the result to ``JWT_SECRET``.

## ``DOMAIN`` and ``SSL_DOMAINS``

These environment variables are not relevant when you're running your instance
locally. Leave their values like they are in ``rsd-secrets.env.example`` for the
time being. We will revisit them in the page about [deployment](hosting.md).
