#!/bin/bash
cd "$(dirname "$0")"
npm run dev &
echo $! > .dev.pid
echo "Started (PID $!)"
