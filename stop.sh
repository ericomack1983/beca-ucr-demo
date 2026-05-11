#!/bin/bash
if [ -f .dev.pid ]; then
  kill "$(cat .dev.pid)" 2>/dev/null && echo "Stopped" || echo "Process not found"
  rm -f .dev.pid
else
  lsof -ti:3000,3001 | xargs kill -9 2>/dev/null && echo "Stopped" || echo "Nothing running"
fi
