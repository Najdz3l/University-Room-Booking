FROM oven/bun:latest

WORKDIR /backend

# Copy package files
COPY package.json bun.lock ./

# Install dependencies
RUN bun install

# Copy source code
COPY src ./src
COPY tsconfig.json ./

# Expose port
EXPOSE 3000

# Run the application | "dev" script defined in package.json
CMD ["bun", "run", "dev"]
