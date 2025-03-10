# Use Node.js 20 as the base image
FROM node:20

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json from the root directory
COPY ../package*.json ./  

# Install backend dependencies
RUN npm install

# Copy the rest of the backend code into the container
COPY backend/ .

# Run tests during the build process
RUN npm test

# Expose the backend port
EXPOSE 3000

# Start the backend server
CMD node server.js & node worker.js
# CMD ["node", "server.js"]
