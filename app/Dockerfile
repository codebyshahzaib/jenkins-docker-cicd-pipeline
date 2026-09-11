# Build the Vite bundle in an isolated Node image.
FROM node:22-alpine AS frontend-build
WORKDIR /app

COPY package*.json ./
RUN npm ci
COPY index.html vite.config.js ./
COPY src ./src
RUN npm run build

# Serve only the compiled frontend in production.
FROM nginx:1.27-alpine AS frontend
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=frontend-build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
