FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .
RUN npx prisma generate

ENV NODE_ENV=production

EXPOSE 3000

CMD ["sh", "-c", "npx prisma migrate deploy && node src/index.js"]
