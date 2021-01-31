FROM node:14.11.0
EXPOSE 3000
WORKDIR /client
COPY package*.json /client/
RUN npm install
COPY . /client/
RUN npm config set proxy http://server:9000
CMD ["npm", "start"]