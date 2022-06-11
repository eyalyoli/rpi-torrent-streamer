FROM node:lts
RUN apt-get update && apt-get install -y \
  transmission-cli \
  transmission-common \
  transmission-daemon \
  vlc \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json .
RUN npm install

RUN service transmission-daemon stop 
COPY transmission-settings.json /root/.config/transmission-daemon/settings.json
RUN service transmission-daemon start 

COPY build public
COPY src/commons commons
COPY src/server server

ENV PUBLIC_PATH=/app/public
ENTRYPOINT [ "node", "/app/server/server.js" ]