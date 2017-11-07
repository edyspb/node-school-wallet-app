FROM node:8.9

RUN apt-get update && apt-get install -y git

ADD ./ /app
WORKDIR /app

RUN npm install
RUN npm run build

CMD npm start
