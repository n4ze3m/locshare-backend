FROM node:14-alpine

WORKDIR /app

COPY package*.json .

# Install dependencies
RUN npm install

COPY . .

EXPOSE 8172

CMD ["npm", "start"]