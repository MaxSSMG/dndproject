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

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build-stage /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
