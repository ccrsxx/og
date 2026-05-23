# syntax=docker/dockerfile:1
# check=skip=InvalidDefaultArgInFrom

# ---

ARG NODE_VERSION
ARG NODE_DISTROLESS_VERSION

# ---

FROM node:${NODE_VERSION}-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev

COPY . .

# ---

FROM gcr.io/distroless/nodejs${NODE_DISTROLESS_VERSION}-debian13:nonroot AS final

WORKDIR /app

COPY --from=build /app /app

ENTRYPOINT ["/nodejs/bin/node", "./src/index.ts"]

EXPOSE 4000

LABEL org.opencontainers.image.authors="ami@ccrsxx.com" \
    org.opencontainers.image.source="https://github.com/ccrsxx/og" \
    org.opencontainers.image.description="Open Graph for my projects" \
    org.opencontainers.image.licenses="GPL-3.0"
