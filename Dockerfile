
FROM node:16-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install -g nodemon

RUN npm install --include=dev

COPY . .

EXPOSE 3000

CMD ["nodemon", "src/server.js"]