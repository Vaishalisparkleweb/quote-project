FROM node:18
WORKDIR /usr/app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 4001
CMD ["node", "index.js"]