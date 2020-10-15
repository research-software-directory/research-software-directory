This directory is a placeholder for any data volumes that Docker creates upon
running the software.

After running the complete stack, this directory should look like this:

```
docker-volumes/
├── db
├── oaipmh-cache
└── README.md
```

Note that in addition to these bind mounts, other data are stored in static
volumes. Refer to [docker-compose.yml](/docker-compose.yml) to see which volumes
exist.
