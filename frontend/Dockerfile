FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# lightweight static server for built assets
RUN npm install -g serve

EXPOSE 5173
CMD ["serve", "-s", "dist", "-l", "5173"]
