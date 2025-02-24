# 1. Build Stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package.json and package-lock.json to install dependencies
COPY package.json package-lock.json ./
# Some of the dependencies fail to install so ignore errors
RUN npm ci --omit=dev || :

# Need next command in PATH
RUN npm i next

# Fix for some dep resolve problem
RUN npm i rxdb

# Copy the rest of the app and build it
COPY . .
RUN npm run build

# 2. Production Stage (Final Image)
FROM node:20-alpine

WORKDIR /app

# Copy only necessary files from the build stage
COPY --from=builder /app/package.json /app/package-lock.json ./
#COPY --from=builder /app/.next /app/.next
COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/public /app/public

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Expose port
EXPOSE 3000

# Start the Next.js server
CMD ["npm", "run", "start"]
