# Build stage
FROM oven/bun:latest AS builder
WORKDIR /app

COPY . .

RUN bun install
RUN bun run build

FROM debian:12-slim
WORKDIR /app
COPY --from=builder /app/server /app/server
COPY --from=builder /app/db /app/db

# set env
ENV NODE_ENV=production
ENV PORT=3333
EXPOSE 3333
# Run the standalone binary
CMD ["/app/server"]
