FROM node:22-alpine

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm install

# Copy source files and compile frontend
COPY . .
RUN npm run build

# Configure production environment
ENV NODE_ENV=production
ENV PORT=8080
EXPOSE 8080

# Start production server
CMD ["npx", "tsx", "server.ts"]
