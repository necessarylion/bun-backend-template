# Build stage
FROM oven/bun:latest AS builder
WORKDIR /app

COPY . .

RUN bun install
RUN bun run build

FROM debian:12-slim
WORKDIR /app
COPY --from=builder /app/server /app/server

# set env
ENV APP_ENV=production
EXPOSE 3000
# Run the standalone binary
CMD ["/app/server"]
