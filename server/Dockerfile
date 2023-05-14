# Use the official Node.js image as the base image
FROM node:18

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json files into the new working directory
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the rest of the application code into the container's working directory
COPY . .

RUN ls -la

# Expose the port the app will run on
EXPOSE 4005

# Define the command to run the app
CMD ["npm", "start"]

