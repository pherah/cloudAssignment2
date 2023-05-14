# Use an official Node.js runtime as a parent image
FROM node:14

# Set the working directory to /app
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . /app

# Install any needed packages specified in package.json
RUN npm install

# Build the app
RUN npm run 

# Expose port 3000 for the frontend app
EXPOSE 3000

# Start the app with Node.js
CMD ["npm", "start"]