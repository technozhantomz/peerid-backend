FROM node:12-alpine3.12

WORKDIR /peerid-backend

ARG node_env=''
ENV NODE_ENV=$node_env

COPY ./package*.json /peerid-backend
RUN apk update && apk add bash git
RUN npm install

COPY . .

COPY docker-entrypoint.sh /

ENTRYPOINT ["/docker-entrypoint.sh"]

EXPOSE 3000

CMD ["npm", "run", "start"]