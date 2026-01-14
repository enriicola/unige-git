FROM docker.io/grafana/grafana:11.4.0

COPY ./entrypoint.sh /entrypoint.sh
USER root
RUN apk add --no-cache postgresql-client ca-certificates curl

RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
