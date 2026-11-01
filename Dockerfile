FROM node:26-alpine AS buildtime
WORKDIR /app

FROM gcr.io/distroless/nodejs26-debian13:nonroot AS runtime
WORKDIR /app

FROM buildtime AS all-deps

COPY package*.json ./
RUN --mount=type=cache,target=/root/.npm npm ci

FROM all-deps AS prod-deps

RUN --mount=type=cache,target=/root/.npm npm prune --omit=dev

FROM buildtime AS build

COPY --from=all-deps /app/node_modules /app/node_modules
COPY . .
RUN npm run build

FROM runtime

ENV TINI_VERSION=v0.19.0
ADD --chmod=+x https://github.com/krallin/tini/releases/download/${TINI_VERSION}/tini /tini
ENTRYPOINT ["/tini", "--"]

COPY --from=prod-deps /app/node_modules /app/node_modules
COPY --from=build /app/dist /app/dist
COPY --from=build /app/server.js /app/server.js
# server.js is ESM; Node uses this package.json to determine the module type.
COPY --from=build /app/package.json /app/package.json

ENV NODE_ENV=production
ENV SERVER_PORT=3000
EXPOSE 3000
CMD ["/nodejs/bin/node", "/app/server.js"]
