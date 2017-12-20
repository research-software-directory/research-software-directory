#!/usr/bin/env bash

set -o errexit
set -o pipefail
set -o nounset


#celery -A seedorf.taskapp worker -l INFO
celery worker -l INFO
