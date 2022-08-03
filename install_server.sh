#!/bin/bash

# install & config transmission torrent client + vlc 
apt-get update && apt-get install -y \
  transmission-cli \
  transmission-common \
  transmission-daemon \
  vlc 

service transmission-daemon stop 
sudo cp transmission-settings.json /root/.config/transmission-daemon/settings.json
service transmission-daemon start 

# install & build source code
npm install
npm run build
