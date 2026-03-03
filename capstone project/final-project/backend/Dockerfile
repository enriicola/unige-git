FROM node:25-alpine AS builder

RUN npm install -g npm@11
RUN apk add --no-cache git

ARG BRANCH

WORKDIR /usr/app

COPY ./package*.json ./

RUN npm ci

COPY . .

FROM node:25-alpine

RUN apk add --no-cache docker-cli su-exec

WORKDIR /usr/app

ENV NODE_ENV=production

# Copy entrypoint script and make it executable
COPY --chown=root:root docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

COPY --from=builder /usr/app /usr/app

# Set entrypoint (runs as root to fix permissions, then switches to user)
ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]

# Default to root user - entrypoint will switch to appropriate user
# Production can override with user directive in docker-compose if needed
CMD ["sh", "-c", "npm start"]
