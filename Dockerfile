# syntax=docker/dockerfile:1
# check=skip=InvalidDefaultArgInFrom

# ---
ARG NODE_VERSION

FROM node:${NODE_VERSION}-alpine as build

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev

COPY . .

USER node

ENTRYPOINT ["npm", "run", "start"]

EXPOSE 4000

LABEL org.opencontainers.image.authors="ami@ccrsxx.com" \
    org.opencontainers.image.source="https://github.com/ccrsxx/api" \
    org.opencontainers.image.description="My personal API for my projects" \
    org.opencontainers.image.licenses="GPL-3.0"
