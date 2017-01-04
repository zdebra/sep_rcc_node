FROM node:7.3.0-alpine

MAINTAINER zdebra <zd.brabec@gmail.com>

RUN mkdir -p /var/www/rcc

WORKDIR /var/www/rcc

RUN apk add --update \
    python \
    python-dev \
    py-pip \
    build-base \
  && pip install virtualenv \
  && rm -rf /var/cache/apk/*

COPY package.json ./package.json
RUN npm install

COPY views ./views
COPY app ./app
COPY index.js ./index.js

EXPOSE 3000

CMD sh -c "node --harmony index.js"