FROM node:25-alpine

ARG USERID=1000
ARG GROUPID=1000

RUN set -eux; \
    npm install -g npm@11; \
    apk add --no-cache git; \
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
COPY --chown=${USERID}:${GROUPID} . /usr/app

USER ${USERID}:${GROUPID}
CMD ["sh", "-c", "set -eu; npm i --no-audit --no-fund && npm run debug"]

