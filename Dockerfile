# Set the node version as a build argument
ARG NODE_VERSION=24.4.0

# Use the specified Node.js version as the base image
FROM node:${NODE_VERSION}-alpine

# Create and change to the app directory
WORKDIR /app

# Copy application dependency manifests to the container image
COPY package*.json .

# Install dependencies
RUN npm ci --omit=dev

# Copy the source code
COPY src src

# Copy the entrypoint script
COPY entrypoint.sh .

# Run the web service on container startup
ENTRYPOINT ["./entrypoint.sh"]

# Expose port for documentation, but this can be overriden if env variable PORT is set
EXPOSE 4000
