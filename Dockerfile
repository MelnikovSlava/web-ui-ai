# Build frontend
FROM oven/bun:canary-alpine AS frontend-build
WORKDIR /app
COPY frontend/ .
RUN bun install
RUN bun run build

# Final stage
FROM oven/bun:canary-alpine AS runner
WORKDIR /app

# Install required system dependencies
# RUN apk add --no-cache \
#     python3 \
#     make \
#     g++ \
#     gcc \
#     libstdc++ \
#     linux-headers

# Copy frontend build
COPY --from=frontend-build /app/dist ./static

# Copy backend files
COPY backend/ .
RUN bun install --production

EXPOSE 4000

# Start backend
CMD [ "bun", "start" ]