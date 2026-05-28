FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm install

# Copy source code
COPY index.html ./
COPY src ./src
COPY public ./public
COPY *.config.* ./

# Expose port
EXPOSE 8080

# Run development server with hot reloading
CMD ["npm", "run", "dev", "--", "--host"]
