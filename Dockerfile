FROM node:12

WORKDIR /peerid-backend

ARG node_env=''
ENV NODE_ENV=$node_env

COPY ./package*.json /peerid-backend

RUN npm install --silent

COPY . .

COPY docker-entrypoint.sh /

ENTRYPOINT ["/docker-entrypoint.sh"]

EXPOSE 3000

CMD ["npm", "run", "start"]
