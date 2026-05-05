#!/bin/sh
set -e

# Priority 1: SPRING_DATASOURCE_URL already set — use as-is
if [ -n "$SPRING_DATASOURCE_URL" ]; then
  echo "[entrypoint] Using SPRING_DATASOURCE_URL from env"

# Priority 2: DATABASE_URL in postgresql://user:pass@host:port/db format (Railway)
elif [ -n "$DATABASE_URL" ]; then
  echo "[entrypoint] Parsing DATABASE_URL"
  WITHOUT_SCHEME="${DATABASE_URL#postgresql://}"
  USERINFO="${WITHOUT_SCHEME%%@*}"
  HOSTPART="${WITHOUT_SCHEME#*@}"
  export SPRING_DATASOURCE_URL="jdbc:postgresql://${HOSTPART}"
  export SPRING_DATASOURCE_USERNAME="${USERINFO%%:*}"
  export SPRING_DATASOURCE_PASSWORD="${USERINFO#*:}"

# Priority 3: Individual PG* variables (also provided by Railway Postgres plugin)
elif [ -n "$PGHOST" ]; then
  echo "[entrypoint] Building datasource from PG* variables"
  export SPRING_DATASOURCE_URL="jdbc:postgresql://${PGHOST}:${PGPORT:-5432}/${PGDATABASE:-railway}"
  export SPRING_DATASOURCE_USERNAME="${PGUSER:-postgres}"
  export SPRING_DATASOURCE_PASSWORD="${PGPASSWORD:-}"

else
  echo "[entrypoint] WARNING: No database env vars found, falling back to localhost"
fi

echo "[entrypoint] SPRING_DATASOURCE_URL=${SPRING_DATASOURCE_URL}"
exec java -jar app.jar --server.port="${PORT:-8080}"
