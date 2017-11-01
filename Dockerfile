FROM node:8.8

RUN apt-get update && apt-get install -y mongodb-clients

ADD ./ /app
WORKDIR /app

RUN npm install
RUN npm run build

CMD npm start
