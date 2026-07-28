# Base image
FROM node:18

# Create app folder
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all code
COPY . .

# Expose port
EXPOSE 5000

# Start app
CMD ["npm", "start"]