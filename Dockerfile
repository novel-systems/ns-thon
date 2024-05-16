FROM node:18.20.2-alpine3.18 as shared
WORKDIR /app

COPY shared/package*.json ./shared/
WORKDIR /app/shared
RUN npm ci

COPY shared /app/shared

FROM node:18.20.2-alpine3.18 as frontend-builder
WORKDIR /app

COPY frontend/package*.json ./frontend/
WORKDIR /app/frontend
# TODO: resolve peer dependencies
RUN npm ci --legacy-peer-deps

COPY frontend /app/frontend
COPY --from=shared /app/shared /app/shared

ARG VITE_CLOUDINARY_CLOUD_NAME
ARG VITE_AUTH0_DOMAIN
ARG VITE_AUTH0_CLIENT_ID
ARG VITE_BASE_URL
ARG VITE_IS_DEBUG=true

RUN npm run build

# Use the official Node.js 18 image as the base image
FROM node:18.20.2-alpine3.18

# Set the working directory to /app
WORKDIR /app

# Copy the package.json and package-lock.json files for backend
COPY backend/package*.json ./backend/

# Set the working directory to 'backend' and install dependencies for backend
WORKDIR /app/backend
RUN npm ci

# Copy the entire 'backend', 'shared' and 'frontend' directories to the container
COPY backend /app/backend
COPY --from=shared /app/shared /app/shared
COPY --from=frontend-builder /app/frontend/dist /app/backend/build

# Expose the port that the app runs on
EXPOSE 2222

# Command to start the app
CMD ["npm", "run", "start"]