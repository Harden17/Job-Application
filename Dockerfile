FROM node:22-alpine

WORKDIR /job

COPY package.json package-lock.json ./


RUN npm install 


COPY . .

RUN npx prisma generate

EXPOSE 3000

CMD [ "node", "src/server.js" ]
