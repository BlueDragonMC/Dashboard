FROM node:18.7.0-alpine

WORKDIR /app
# Install dependencies
COPY package*.json ./
RUN npm install
# Build minified bundles
COPY . .
RUN npm run build

EXPOSE 8080
CMD [ "node", "server.js" ]