FROM oven/bun:latest

WORKDIR /ride-service

# Copy dependency files first (for caching)
COPY package.json ./

RUN bun install

# Copy the rest of the application code
COPY . .

# on port to be forwarded by the container
EXPOSE 3003

CMD ["bun", "run", "dev"]