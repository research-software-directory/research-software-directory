#!/bin/sh
cd /src
export FLASK_APP=`pwd`/entry.py
flask zotero_sync_publications