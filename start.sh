#!/bin/bash

# Echo the port being used
echo "Starting Daphne on 0.0.0.0:$PORT..."

# Run Daphne with proper binding
exec daphne -b 0.0.0.0 -p "$PORT" video_chat_app.asgi:application
