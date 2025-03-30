FROM node:18
WORKDIR /
COPY package.json ./
COPY server.js ./
RUN npm install
CMD ["node", "server.js"]