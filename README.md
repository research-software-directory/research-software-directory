# research-software-directory-frontend

### Requirements
* [docker & docker-compose](https://docs.docker.com/compose/install/)

### How to run
* `docker-compose build`
* `docker-compose up`

A server should be running at [http://localhost:5000](http://localhost:5000)

### Documentation
The `docker-compose.yml` uses two Docker containers:
* `node-sass`
* `flask`

`node-sass` watches for `.scss` files in `/style` and writes `.css` files to `static/style`.
Flask will autoreload on changes to the Python files, changes to the templates should also
be immediately reflected on a browser reload.
