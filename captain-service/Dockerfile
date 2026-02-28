FROM oven/bun:latest

WORKDIR /captain-service

# Copy dependency files first (for caching)
COPY package.json ./

RUN bun install

# Copy the rest of the application code
COPY . .

# on port to be forwarded by the container
EXPOSE 3002

CMD ["bun", "run", "dev"]