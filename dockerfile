FROM node:lts-buster-slim

ENV SRC=/usr/src

# Create app directory
WORKDIR $SRC/app

COPY package.json $SRC/app/package.json

RUN npm i

RUN npm i concurrently -g

COPY . $SRC/app

EXPOSE 3000 9092 29094 29092

CMD [ "npm", "run", "start" ]