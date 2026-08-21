FROM node:22-alpine

RUN apk add --no-cache openssl libc6-compat

WORKDIR /job

COPY package.json package-lock.json ./


RUN npm install 


COPY . .

RUN npx prisma generate

EXPOSE 3000

CMD [ "node", "src/server.js" ]
