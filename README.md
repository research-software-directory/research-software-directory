# auth-github
[![Docker badge](https://dockerbuildbadges.quelltext.eu/status.svg?organization=rsdnlesc&repository=auth-github)](https://hub.docker.com/r/rsdnlesc/auth-github/)

Github authentication service for the Research Software Directory. It should be configured as the callback endpoint of a GitHub OAuth app.

This verifies the user is part of Github organization `AUTH_GITHUB_ORGANIZATION`,
then forwards the user to `[AUTH_CALLBACK_URL]?jwt=[GENERATED_JWT]` (or an
error message is shown).

The JWT is generated using secret `JWT_SECRET`.

Claims in the generated token:
```
{
  "sub": [github_username],
  "subType": "GITHUB",
  "permissions": ["read", "write"],
  "iat": [current timestamp (in seconds)],
  "user": {
    "name": [github_username],
    "image": [github_users_avatar_image_url],
  }
}
```

## Install

```
mkvirtualenv data-api -p `which python3` # create virtual python environment
pip install -r requirements.txt          # install python dependencies
```

## Run
Copy `.env.example` to `.env` and check the values.
```
export $(cat .env | xargs)       # load settings as env vars
python app.py                    # run debug server on default port (5002)
```
or use docker (you can skip the `install` instructions):
```
docker build . -t auth-github && docker run --env-file ./.env -p 5002:8000 -it --name auth-github auth-github
```

## Configuration

Configuration is done through environmental variables
```
# The secret used to generate jwt token that is used by the api backend to authenticate/authorize users from the admin site
JWT_SECRET=
# The id and secret of a GitHub OAuth app, for authorization callback URL in the GitHub application use `<url of server>/get_jwt`
AUTH_GITHUB_CLIENT_ID=
AUTH_GITHUB_CLIENT_SECRET=
# The GitHub organization that users must be a member of to be authorized
AUTH_GITHUB_ORGANIZATION=nlesc
# The url to redirect the user to when the authentication has been completed
AUTH_CALLBACK_URL=http://localhost:3000
```

# Docker

The Docker image can be build using
```bash
docker build -t rsd/auth .
``
