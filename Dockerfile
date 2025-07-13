# Config
ARG NODE_IMAGE=node:24-alpine

# ---

# Build stage
FROM ${NODE_IMAGE} AS build

# Create and change to the app directory
WORKDIR /app

# Copy application dependency manifests to the container image
COPY package*.json .

# Install dependencies
RUN npm ci

# Copy local code to the container image
COPY . .

# Build the application
RUN npm run build

# ---

# Production stage
FROM ${NODE_IMAGE} AS production

# Add environment variables
ENV HUSKY=0

# Create and change to the app directory
WORKDIR /app

# Copy application dependency manifests to the container image
COPY package*.json .

# Install dependencies
RUN npm ci --omit=dev

# Copy the entrypoint script
COPY entrypoint.sh .

# Copy the build output to the production image
COPY --from=build /app/build .

# Run the web service on container startup
ENTRYPOINT ["./entrypoint.sh"]

# Expose port for documentation, but this can be overriden if env variable PORT is set
EXPOSE 4000
