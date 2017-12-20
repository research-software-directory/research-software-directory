#!/usr/bin/env bash

set -o errexit
set -o pipefail

cmd="$@"

exec $cmd