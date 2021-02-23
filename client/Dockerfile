# Stage 0: Build static client files
FROM node:14.11.0 as build-stage
WORKDIR /client
COPY package*.json /client/
RUN npm install
COPY . /client/
RUN npm run build

# Stage 1: based on nginx, to have only the compiled app, ready for production.
FROM nginx:1.15
EXPOSE 80

# Delete the default welcome to nginx page.
RUN rm /usr/share/nginx/html/*

# Copy react build from build-stage
COPY --from=build-stage /client/build/ /usr/share/nginx/html

# Copy over the custom default configs.
COPY nginx/configs/default.conf /etc/nginx/conf.d/default.conf

# Start nginx in the foreground to play nicely with Docker.
CMD ["nginx", "-g", "daemon off;"]