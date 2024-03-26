#!/bin/bash

bash install.sh
if [ $? != 0 ]; then
    echo "Le script d'installation a échoué" >&2
    exit 1
fi

npm start > /dev/null & 
PID=$!

sleep 5

curl -f http://localhost:3000 > /dev/null 2>&1
if [ $? != 0 ]; then
    echo "Le lancement de l'application a échoué" >&2
    exit 1
fi

pkill -TERM -P $PID

echo "L'application est fonctionnelle"

zip -r project_group_XX_FRISTNAME_LASTNAME.zip . -x "*.git*" -x "*.zip" -x "*node_modules*" -x "data/project.db" > /dev/null
