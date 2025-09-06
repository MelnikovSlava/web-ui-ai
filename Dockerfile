FROM oven/bun:1.1.35-alpine AS runner
WORKDIR /app

# Install required system dependencies
RUN apk add --no-cache \
    python3 \
    py3-pip \
    py3-setuptools \
    make \
    g++ \
    gcc \
    libstdc++ \
    linux-headers \
    sqlite \
    sqlite-dev

# Copy backend files
COPY backend/ .
RUN bun install --omit dev
RUN bun run migrate

EXPOSE 4000

# Start backend
CMD [ "bun", "start" ]
