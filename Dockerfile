FROM node:24.19.0-alpine@sha256:d32cdf619f63fe0471182d08996dd516c6275bb5fd31ae06e55a570bd9e1ad43

WORKDIR /app
# Install dependencies
COPY package*.json ./
RUN --mount=type=cache,target=/root/.npm npm ci
# Build minified bundles
COPY . .
RUN npm run build

EXPOSE 8080
CMD [ "node", "server.js" ]