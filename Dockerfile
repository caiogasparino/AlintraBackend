# Use the latest LTS version of Node.js as the base image
FROM node:latest as builder

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json files to the working directory
COPY package*.json ./

# Install the Nest.js CLI globally
RUN npm install -g @nestjs/cli

# Install the project dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Build the application
RUN npm run build

# Use a separate Node.js base image for the production environment
FROM node:latest

# Set the working directory in the container
WORKDIR /app

# Copy the built application from the builder stage to the production image
COPY --from=builder /app .

# Set environment variables for Kafka
ENV KAFKA_ADVERTISED_LISTENERS=PLAINTEXT://kafka:9092
ENV KAFKA_LISTENER_SECURITY_PROTOCOL_MAP=PLAINTEXT:PLAINTEXT
ENV KAFKA_INTER_BROKER_LISTENER_NAME=PLAINTEXT
ENV KAFKA_ZOOKEEPER_CONNECT=zookeeper:2181

# Expose the port that the application listens on
EXPOSE 3000
