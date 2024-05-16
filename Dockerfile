# Use the official Node.js 16 image as the base image
FROM node:16.20.2-alpine3.18

# Set the working directory to /app
WORKDIR /app

# Copy the package.json and package-lock.json files for 'shared' and 'backend' folders
COPY shared/package*.json ./shared/
COPY backend/package*.json ./backend/

# Install dependencies for 'shared'
WORKDIR /app/shared
RUN npm ci

# Install dependencies for 'backend'
WORKDIR /app/backend
RUN npm ci

# Copy the entire 'shared' and 'backend' directories to the container
COPY shared /app/shared
COPY backend /app/backend

# Set the working directory to 'backend'
WORKDIR /app/backend

# Expose the port that the app runs on
EXPOSE 2222

# Command to start the app
CMD ["npm", "run", "start"]