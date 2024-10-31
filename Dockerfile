FROM oven/bun:canary-alpine AS runner
WORKDIR /app

# Install required system dependencies
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    gcc \
    libstdc++ \
    linux-headers

# Copy backend files
COPY backend/ .
RUN bun install --production

EXPOSE 4000

# Start backend
CMD [ "bun", "start" ]
