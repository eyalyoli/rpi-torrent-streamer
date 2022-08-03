#!/bin/bash

# install & config transmission torrent client + vlc 
echo 'Installing torrent client & VLC...'
sudo apt update 
sudo apt install -y transmission-cli transmission-common transmission-daemon 
sudo apt install vlc
echo 'Done'

echo 'Configuring torrent client...'
sudo service transmission-daemon stop 
sudo cp transmission-settings.json /root/.config/transmission-daemon/settings.json
sudo service transmission-daemon start 
echo 'Done'

# install & build source code

echo 'Installing nvm + npm + node...'
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.0/install.sh | bash
export NVM_DIR="/home/pi/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm install node
echo 'Done'

echo 'Configuring torrent client...'
npm install
npm run build
echo 'Done'

echo '\nYou can now run the server!'