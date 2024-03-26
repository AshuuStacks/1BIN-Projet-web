#!/bin/bash

sqlite3 data/project.db < install.sql > /dev/null
if [ $? != 0 ]; then
    echo "La création de la base de données a échoué" >&2
    exit 1
fi

npm install > /dev/null
if [ $? != 0 ]; then
    echo "L'installation des dépendances a échoué" >&2
    exit 1
fi