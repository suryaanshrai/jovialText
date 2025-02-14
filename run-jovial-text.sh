#!/bin/bash
echo "Not Implemented Yet"

# Likely flow after final images are deployed
# 1. Download the docker-compose.yaml file and do a docker compose up api -d
# 2. Migrate the database
# 3. Optionally create a default superuser. Must repeat if execution failed.
# 4. Optionally feed the database with default posts by running the post-feed.sh script
# 5. Do a docker compose down and a docker compose up