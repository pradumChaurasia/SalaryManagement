FROM node:18

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install --production

COPY . .

# Generate Prisma client if possible
RUN npx prisma generate || true

EXPOSE 3000

CMD ["node", "src/index.js"]
