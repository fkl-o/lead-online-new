#!/bin/bash

# Install dependencies
npm install

# Run admin seeding if needed
node scripts/seedAdmin.js

# Start the server
npm start
