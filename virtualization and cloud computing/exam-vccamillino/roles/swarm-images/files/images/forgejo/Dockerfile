FROM codeberg.org/forgejo/forgejo:9.0.3
# TODO: install dependencies
RUN apk add --no-cache su-exec netcat-openbsd curl jq ca-certificates postgresql-client

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# TODO: add a new entrypoint and use it to replace the original
ENTRYPOINT [ "./entrypoint.sh" ]
