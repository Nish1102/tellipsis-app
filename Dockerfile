# Use an official Node.js runtime as the base image
FROM node:18

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies with --legacy-peer-deps to resolve peer dependency conflicts
RUN npm install --legacy-peer-deps

# Copy the entire application to the container
COPY . .

# Set the environment variable to use port 3009
ENV PORT=3009

# Expose port 3009
EXPOSE 3009

# Start the application
CMD ["npm", "start"]

