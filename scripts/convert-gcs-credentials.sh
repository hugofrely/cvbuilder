#!/bin/bash

# Script to convert GCS credentials JSON file to a single-line string
# Usage: ./scripts/convert-gcs-credentials.sh /path/to/credentials.json

if [ -z "$1" ]; then
    echo "Usage: $0 /path/to/credentials.json"
    echo ""
    echo "This script converts your GCS credentials JSON file into a single-line"
    echo "string that can be used in Docker Swarm environment variables."
    exit 1
fi

CREDS_FILE="$1"

if [ ! -f "$CREDS_FILE" ]; then
    echo "Error: File not found: $CREDS_FILE"
    exit 1
fi

echo "Converting GCS credentials to single-line JSON..."
echo ""

# Try jq first (most reliable)
if command -v jq &> /dev/null; then
    JSON_OUTPUT=$(cat "$CREDS_FILE" | jq -c)
# Fallback to python if available
elif command -v python3 &> /dev/null; then
    JSON_OUTPUT=$(python3 -c "import json,sys; print(json.dumps(json.load(sys.stdin), separators=(',',':')))" < "$CREDS_FILE")
elif command -v python &> /dev/null; then
    JSON_OUTPUT=$(python -c "import json,sys; print(json.dumps(json.load(sys.stdin), separators=(',',':')))" < "$CREDS_FILE")
# Last resort: remove newlines and spaces (not perfect but works)
else
    echo "Warning: Neither jq nor python found. Using basic text processing."
    echo "The output might not be perfectly formatted."
    echo ""
    JSON_OUTPUT=$(cat "$CREDS_FILE" | tr -d '\n' | tr -s ' ')
fi

echo "Add this to your .env.swarm file:"
echo ""
echo "GCS_CREDENTIALS_JSON=$JSON_OUTPUT"
echo ""
echo "Done!"
