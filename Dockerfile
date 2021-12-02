FROM node:14.17-alpine

WORKDIR /usr/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm rebuild bcrypt

RUN npm rebuild kafkajs@1.10.0

EXPOSE 3333

CMD ["node", "ace", "serve", "--watch"]
