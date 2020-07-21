#!/bin/bash
# This script will pull the latest code for the GUI and build it

# Change working directory to one level up
dir=$(cd -P -- "$(dirname -- "$0")" && pwd -P)
cd $dir/../

# Update to the latest code
git pull origin master

# Install the required node packages for building
sudo npm install npm@latest

# Build the application
npm run build
