# Use Node.js 20 as the base image
FROM node:20

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY frontend/package*.json ./

# Install frontend dependencies
RUN npm install

# Copy the rest of the frontend code into the container
COPY frontend/ .

# Build the Next.js app
RUN npm run build

# Expose the frontend port
EXPOSE 3001

# Start the Next.js app
CMD ["npm", "run", "dev"]
