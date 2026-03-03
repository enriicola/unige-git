FROM node:25-alpine

ARG USERID=1000
ARG GROUPID=1000

RUN set -eux; \
    npm install -g npm@11; \
    apk add --no-cache git docker-cli su-exec; \
    git config --global --add safe.directory /usr/app

RUN set -eux; \
    if getent group "${GROUPID}" >/dev/null; then \
      GROUP_NAME="$(getent group "${GROUPID}" | cut -d: -f1)";\
    else \
      GROUP_NAME=hostgroup; \
      addgroup -g "${GROUPID}" "${GROUP_NAME}"; \
    fi; \
    if getent passwd "${USERID}" >/dev/null; then \
      EXISTING_USER="$(getent passwd "${USERID}" | cut -d: -f1)"; \
      addgroup "$EXISTING_USER" "$GROUP_NAME"; \
    else \
      USER_NAME=hostuser; \
      adduser -D \
        -u "${USERID}" \
        -G "${GROUP_NAME}" \
        "${USER_NAME}"; \
    fi

WORKDIR /usr/app
RUN chown ${USERID}:${GROUPID} /usr/app

# Copy entrypoint script and make it executable (as root)
COPY --chown=root:root docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

COPY --chown=${USERID}:${GROUPID} . /usr/app

# Set entrypoint - runs as root to fix permissions, then switches to user
ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]

# Don't set USER here - entrypoint will switch to the user
# This allows entrypoint to run as root to fix permissions
CMD ["sh", "-c", "set -eu; npm i --no-audit --no-fund && npm run debug"]
