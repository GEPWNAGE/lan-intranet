FROM node:20-alpine
WORKDIR /usr/share/app

COPY server server
COPY client client

RUN cd server && yarn
RUN cd client && yarn && yarn build:production

WORKDIR /usr/share/app/server

CMD ["yarn", "start:production"]
