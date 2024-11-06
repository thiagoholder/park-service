# par-payment/Dockerfile
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json yarn.lock ./
RUN yarn install --production

# Copy the rest of the application code
COPY . .

# Expose the gRPC server port
EXPOSE 5000

# Start the NestJS server
CMD ["yarn", "start"]
