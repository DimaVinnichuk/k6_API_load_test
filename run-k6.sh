#!/bin/bash

# Check if the environment configuration file exists.
if [ ! -f k6.env ]; then
    echo "Error: k6.env file not found. Please create it (you can copy from k6.env.example)."
    exit 1
fi

echo "--- Starting k6 load test ---"

# Run k6 test using Docker. 
# --env-file passes all variables from k6.env directly to k6.
docker run --rm \
  --env-file k6.env \
  -v "$(pwd)":/scripts \
  -w /scripts \
  -p 5665:5665 \
  grafana/k6 run K6_API_load_test.js