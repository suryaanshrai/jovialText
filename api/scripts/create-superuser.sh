#!/bin/bash

# Create a superuser

# Loop until a superuser is successfully created
while true; do
    # Prompt the user for the username, email, and password
    read -p "Enter the username: " username
    read -p "Enter the email: " email
    read -s -p "Enter the password: " password
    echo
    
    # Execute the Django management command to create a superuser inside the Docker container
    docker compose exec api bash -c "export DJANGO_SUPERUSER_USERNAME=$username DJANGO_SUPERUSER_EMAIL=$email DJANGO_SUPERUSER_PASSWORD=$password; python manage.py createsuperuser --no-input"

    
    # Check the result of the superuser creation command
    if [ $? -eq 0 ]; then
        break
    else
        echo "Superuser creation failed"
    fi
done