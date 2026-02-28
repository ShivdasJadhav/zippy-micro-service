FROM oven/bun:latest

WORKDIR /user-service

# Copy dependency files first (for caching)
COPY package.json ./

RUN bun install

# Copy the rest of the application code
COPY . .

# on port to be forwarded by the container
EXPOSE 3001

CMD ["bun", "run", "dev"]