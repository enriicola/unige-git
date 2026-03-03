FROM node:25-alpine AS builder

RUN npm install -g npm@11
RUN apk add --no-cache git

ARG BRANCH

WORKDIR /usr/app

COPY ./package*.json ./

RUN npm ci

COPY . .

RUN npm run build

FROM node:25-alpine

WORKDIR /usr/app

ENV NODE_ENV=production

COPY --from=builder /usr/app/.next/standalone ./
COPY --from=builder /usr/app/public ./public
COPY --from=builder /usr/app/.next/static ./.next/static

CMD ["node", "server.js"]
