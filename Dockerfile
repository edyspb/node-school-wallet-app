FROM node:8.9-alpine

RUN apk update && apk add git

ADD ./ /app
WORKDIR /app

RUN npm install
RUN npm run build

CMD npm start
