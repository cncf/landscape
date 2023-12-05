FROM node:16 AS landscape

WORKDIR /usr/src/app

COPY . .

EXPOSE 8001

CMD [ "node", "server.js" ]
