FROM node:16.13.2-alpine AS builder
WORKDIR /app
COPY package.json .
COPY yarn.lock .
RUN yarn
COPY . .
RUN yarn build

# => Run container
FROM nginx:1.15.2-alpine

# Nginx config
RUN rm -rf /etc/nginx/nginx.conf
COPY nginx /etc/nginx

# Static build
COPY --from=builder /app/build /usr/share/nginx/html/

# Default port exposure
EXPOSE 80

# Copy .env.examplev file and shell script to container
WORKDIR /usr/share/nginx/html
COPY ./env.sh .
COPY .env.example .

# Add bash
RUN apk add --no-cache bash

# Make our shell script executable
RUN chmod +x env.sh

# Start Nginx server
CMD ["/bin/bash", "-c", "/usr/share/nginx/html/env.sh && nginx -g \"daemon off;\""]