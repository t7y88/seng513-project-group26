# Use the latest LTS version of Node.js
FROM node:20

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install
RUN ls node_modules/.bin && npm list vite

# Copy the rest of your application files
COPY . .

# # Expose the port your app runs on
# EXPOSE 5173

# Define the command to run your app
CMD ["npm", "run", "dev"]