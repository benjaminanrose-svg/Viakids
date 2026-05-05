#!/bin/sh

# If SPRING_DATASOURCE_URL not explicitly set, parse from DATABASE_URL (Railway format)
if [ -z "$SPRING_DATASOURCE_URL" ] && [ -n "$DATABASE_URL" ]; then
  # DATABASE_URL = postgresql://user:pass@host:port/db
  # Strip scheme and extract parts
  WITHOUT_SCHEME="${DATABASE_URL#postgresql://}"
  USERINFO="${WITHOUT_SCHEME%%@*}"
  HOSTPART="${WITHOUT_SCHEME#*@}"

  export SPRING_DATASOURCE_URL="jdbc:postgresql://${HOSTPART}"
  export SPRING_DATASOURCE_USERNAME="${USERINFO%%:*}"
  export SPRING_DATASOURCE_PASSWORD="${USERINFO#*:}"
fi

exec java -jar app.jar --server.port="${PORT:-8080}"
