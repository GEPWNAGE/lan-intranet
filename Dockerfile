FROM node:13

WORKDIR /usr/share/app

COPY intranet-server intranet-server
COPY intranet-client intranet-client

RUN cd intranet-server && yarn
RUN cd intranet-client && yarn && yarn build:production

WORKDIR /usr/share/app/intranet-server

CMD ["yarn", "start:production"]
