FROM node:21-slim

WORKDIR /app

COPY package.json .
COPY package-lock.json .
RUN npm ci

COPY . .

# Build the Angular application
RUN npm run build

# Expose port 3000
EXPOSE 3000

CMD ["npx", "lite-server", "--baseDir", "dist/app/browser"]
