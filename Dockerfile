FROM node:12

WORKDIR /peerid-backend

ARG node_env=''
ENV NODE_ENV=$node_env

COPY ./package*.json ./

RUN npm install --silent

COPY . .

ENTRYPOINT ["/peerid-backend/docker-entrypoint.sh"]

EXPOSE 3000

CMD ["npm", "run", "start"]
