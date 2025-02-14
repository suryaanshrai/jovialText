#!/bin/bash

while true; do
    # Prompt the user to enter a username
    echo "Username: "
    read USERNAME

    # Register the user and capture the response
    RESPONSE=$(curl -s -w "\n%{http_code}" -X 'POST' \
       'http://localhost:8000/auth/register/' \
        -H 'accept: application/json' \
        -H 'Content-Type: application/json' \
        -d "{
        \"username\": \"$USERNAME\",
        \"password1\": \"string123\",
        \"password2\": \"string123\"
    }")

    # Extract the HTTP status code and response body
    HTTP_STATUS=$(echo "$RESPONSE" | tail -n 1)
    RESPONSE_BODY=$(echo "$RESPONSE" | sed '$d')

    # Check if the user is successfully created
    if [[ "$HTTP_STATUS" -eq 201 ]]; then
        echo "User registered successfully."
        echo "Adding a profile pic and bio"

        # Extract AUTH_TOKEN and USER_ID from the response body
        AUTH_TOKEN=$(echo "$RESPONSE_BODY" | jq -r '.access')
        USER_ID=$(echo "$RESPONSE_BODY" | jq -r '.user.pk')

        PIC_SOURCE="https://picsum.photos/400"
        PIC_URL=$(curl -s -L -o /dev/null -w "%{url_effective}" "$PIC_SOURCE")
        RESPONSE_JSON=$(curl -s 'https://fakerapi.it/api/v1/texts?_quantity=1&_characters=1000')
        TITLE=$(echo "$RESPONSE_JSON" | jq -r '.data[0].title' | sed 's/"/\\"/g')

        curl -s -o /dev/null -X 'PATCH' \
          "http://localhost:8000/user/$USER_ID/" \
          -H 'accept: application/json' \
          -H 'Content-Type: application/json' \
          -H "Authorization: Bearer $AUTH_TOKEN" \
          -d "{
          \"bio\": \"$TITLE\",
          \"pic\": \"$PIC_URL\"
        }"
        break
    else
        echo "Failed to create user. Response:"
        echo "$RESPONSE_BODY"
    fi
done


while true; do
  read -p "Do you want to add pictures in your posts? This will increase the execution time [y/n]: " ADD_PIC
  ADD_PIC=$(echo "$ADD_PIC" | tr '[:upper:]' '[:lower:]')
  if [[ "$ADD_PIC" == "y" || "$ADD_PIC" == "n" ]]; then
    break 
  else
    echo "Invalid input. Please enter 'y' or 'n'."
  fi
done


echo "Creating fifty posts. This will take a little while."

for i in {1..50}; do
    # Fetch post data from API
    RESPONSE_JSON=$(curl -s 'https://fakerapi.it/api/v1/texts?_quantity=1&_characters=1000')

    # Extract title and content from JSON response
    TITLE=$(echo "$RESPONSE_JSON" | jq -r '.data[0].title' | sed 's/"/\\"/g')
    CONTENT=$(echo "$RESPONSE_JSON" | jq -r '.data[0].content' | sed 's/"/\\"/g')

    if [[ "$ADD_PIC" == "y" ]]; then
        # Get the final URL for the image
        PIC_SOURCE="https://picsum.photos/800/600"
        PIC_URL=$(curl -s -L -o /dev/null -w "%{url_effective}" "$PIC_SOURCE")
    else
        PIC_URL=""
    fi

    # Make a POST request to create a new post and capture the response
    RESPONSE=$(curl -s -w "\n%{http_code}" -X 'POST' \
    'http://localhost:8000/post/' \
    -H 'accept: application/json' \
    -H 'Content-Type: application/json' \
    -H "Authorization: Bearer $AUTH_TOKEN" \
    -d "{
        \"username\": \"http://localhost:8000/user/$USER_ID/\",
        \"title\": \"$TITLE\",
        \"content\": \"$CONTENT\",
        \"pic\": \"$PIC_URL\"
    }")

    # Extract the HTTP status code and response body
    HTTP_STATUS=$(echo "$RESPONSE" | tail -n 1)
    RESPONSE_BODY=$(echo "$RESPONSE" | sed '$d')

    # Check if the post was created successfully
    if [[ "$HTTP_STATUS" -eq 201 ]]; then
        echo "Successfully created Post $i"
    else
        echo "Failed to create Post $i: $RESPONSE_BODY"
    fi
done



# Indicate that the script has finished executing
echo "Script executed"