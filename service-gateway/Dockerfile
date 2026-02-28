FROM oven/bun:latest

WORKDIR /service-gateway

# Copy dependency files first (for caching)
COPY package.json ./

RUN bun install

# Copy the gateway
COPY . .

# on port to be forwarded by the container
EXPOSE 3000

CMD ["bun", "run", "dev"]