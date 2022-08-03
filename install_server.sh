#!/bin/bash

# install & config transmission torrent client + vlc 
echo -n 'Installing torrent client & VLC...'
sudo apt update 
sudo apt install -y transmission-cli transmission-common transmission-daemon 
sudo apt install vlc
echo ' Done'

echo -n 'Configuring torrent client...'
sudo service transmission-daemon stop 
sudo cp transmission-settings.json /root/.config/transmission-daemon/settings.json
sudo service transmission-daemon start 
echo ' Done'

# install & build source code

echo -n 'Configuring torrent client...'
npm install
npm run build
echo ' Done'

echo '\nYou can now run the server!'