#!/bin/bash

# This script does the following:
# 1. Download the docker-compose.yaml file and do a docker compose up api -d
# 2. Migrate the database
# 3. Optionally create a default superuser. Must repeat if execution failed.
# 4. Optionally feed the database with default posts by running the post-feed.sh script
# 5. Do a docker compose down and a docker compose up



# 1. Download the docker-compose.yaml file and start the api service
curl -s -o docker-compose.yaml https://raw.githubusercontent.com/suryaanshrai/jovialText/refs/heads/v2/docker-compose.yml
docker compose up api -d


# 2. Migrate the database
docker compose exec api python manage.py migrate


# 3. Optionally create a superuser
while true; do
    read -p "Do you want to create a superuser? [y/n]" CREATE_SUPERUSER
    CREATE_SUPERUSER=$(echo "$CREATE_SUPERUSER" | tr '[:upper:]' '[:lower:]')
    if [[ "$CREATE_SUPERUSER" == "y" || "$CREATE_SUPERUSER" == "n" ]]; then
        break
    else
        echo "Invalid input. Please enter 'y' or 'n'."
    fi
done

if [[ "$CREATE_SUPERUSER" == "y" ]]; then
    curl -o create-superuser.sh -s https://raw.githubusercontent.com/suryaanshrai/jovialText/refs/heads/v2/api/scripts/create-superuser.sh && bash create-superuser.sh
    rm create-superuser.sh
fi


# 4. Optionally create default posts
while true; do
    read -p "Do you want to create default posts? [y/n]" CREATE_POSTS
    CREATE_POSTS=$(echo "$CREATE_POSTS" | tr '[:upper:]' '[:lower:]')
    if [[ "$CREATE_POSTS" == "y" || "$CREATE_POSTS" == "n" ]]; then
        break
    else
        echo "Invalid input. Please enter 'y' or 'n'."
    fi
done

if [[ "$CREATE_POSTS" == "y" ]]; then
    curl -o post-feed.sh -s https://raw.githubusercontent.com/suryaanshrai/jovialText/refs/heads/v2/api/scripts/post-feed.sh && bash post-feed.sh 
    rm post-feed.sh
fi


# 5. Finally, run the application
docker compose down && docker compose up