#!/bin/bash

npm run build -- --release
node build/server.js
