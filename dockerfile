# Base image
FROM node:14

# Create app directory and set it as working directory
WORKDIR /app

# Install app dependencies by copying package.json and package-lock.json files
COPY package*.json ./

RUN npm install

# Install PM2 globally
RUN npm install pm2 -g

# Copy source code to container
COPY . .

# Compile TypeScript into JavaScript
RUN npm run build

# Start the application using PM2 and the ecosystem.config.js file (adjust according to where tsc outputs the compiled js file)
CMD [ "pm2-runtime", "./ecosystem.config.js" ]

