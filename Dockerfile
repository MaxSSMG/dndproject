# Build stage
FROM node:20-alpine AS build-stage

WORKDIR /app

# install dependencies
COPY package*.json ./
RUN npm ci

# copy app files
COPY . .

# build Vite app
RUN npm run build


# Production stage
FROM nginx:alpine AS production-stage

# copy built files
COPY --from=build-stage /app/dist /usr/share/nginx/html

# nginx serves on 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
