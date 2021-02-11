FROM node:14.11.0
EXPOSE 9000
WORKDIR /server
COPY package*.json /server/
RUN npm install
COPY . /server/
RUN cp docker_entrypoint.sh /usr/local/bin/ && \
    chmod +x /usr/local/bin/docker_entrypoint.sh
ENTRYPOINT ["/usr/local/bin/docker_entrypoint.sh"]