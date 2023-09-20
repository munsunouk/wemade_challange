# Base image
FROM node:14

# Create app directory and set it as working directory
WORKDIR /app

# Install app dependencies by copying package.json and package-lock.json files
COPY package*.json ./

RUN npm install

# Copy source code to container
# COPY ./src/*.ts ./src/
# COPY ./app.ts .
COPY . .

# Compile TypeScript into JavaScript
RUN npm run build

# Run the compiled app.js file (adjust according to where tsc outputs the compiled js file)
CMD [ "node", "dist/app.js" ]
