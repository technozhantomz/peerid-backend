# PeerID

## API Documentation

You can find API documentation here - [/docs/swagger.yaml](/docs/swagger.yaml)

Also, you can build the documentation. Just run npm run `build:doc` and documentation will be built into `docs` folder.

## Dependency
1. Docker & Docker-Compose

2. NVM <br>
https://github.com/nvm-sh/nvm

3. node v12.13.0

4. Postgres v11.3

5. Start the dependencies (Postgres) 
```bash 
   docker-compose -f docker_dependency.yml up
```

## Development

For development you can use nodemon. Clone this project into your folder and run the following commands to run the backend:

```bash
nvm use  # switch to node version as in .nvmrc file
npm i
npm run serve # start server with nodemon
```

### Commits

> If you have run the init script, you can commit via `git cz`.  
> If you have not run the init script, you must commit via `npm run commit`.  
> If you do neither, commit message consistency will be difficult for you.

This repository uses a combination of tools to aid in consistent commit messages. The reason we do this is so we can have dynamic changelog creation and smart semantic versioning based on commits (with the ability to override).

The following tools are used:

1. [commitizen](https://www.npmjs.com/package/commitizen)  
   Used for prompting recommended entries within a commit message to ensure it contains the necessary information.
   - [conventional changelog](https://www.npmjs.com/package/cz-conventional-changelog)  
     - Prompts for conventional changelog standard.
2. [husky](https://www.npmjs.com/package/husky)  
   By using the hooks from this package we intercept commits being made and verify them with commitlint.
   - Prevent bad commits/pushes.
3. [commitlint](https://www.npmjs.com/package/@commitlint/cli)
   - cli
   - [config-conventional](https://www.npmjs.com/package/@commitlint/config-conventional)
     - rule preset in use

## Migrations & Seeds

To run all pending migrations
```npm run db-migrate-all```

To undo single migrations
```npm run db-migrate-undo```

To undo all migrations BE CAREFUL
```npm run db-migrate-undo```

To run all Seeds. Seeds can be run multiple times and should be used for dev only
```npm run db-seed-all```

To undo single migrations
```npm run db-seed-undo-all```

## Docker

You can run the application with docker-compose:

```bash
docker-compose up --build
```

## Project configuration 

To run the app without any issues, the project configurations have to be provided in the [/config/development.json](/config/development.json)

### Database config
Following database credentials are required to connect to the db:
```bash
"db": {
  "user": "USERNAME",
  "password": "PASSWORD",
  "host": "DB_HOSTNAME",
  "port": "DB_PORT",
  "database": "DB_NAME"
}
```

### Google config
PeerID uses google oAuth to enable Sign in with Google. Create an app on google with the scopes `'https://www.googleapis.com/auth/userinfo.profile'` and `'https://www.googleapis.com/auth/userinfo.email'`

and provide the credentials in the config as below:
```bash
"google": {
  "clientId": "GOOGLE_CLIENT_ID",
  "clientSecret": "GOOGLE_CLIENT_SECRET"
}
```

### Facebook config
PeerID uses facebook oAuth to enabled Sign in with Facebook. Create an app on facebook with the `email` scope and provide the credentials in the config as below:

```bash
"facebook": {
  "clientId": "FACEBOOK_CLIENT_ID",
  "clientSecret": "FACEBOOK_CLIENT_SECRET"
}
```

### Discord config
PeerID uses discord oAuth to enabled Sign in with Discord. Create an app on discord with the `identify` and `email` scopes and provide the credentials in the config as below:

```bash
"discord": {
  "clientId": "DISCORD_CLIENT_ID",
  "clientSecret": "DISCORD_CLIENT_SECRET"
}
```

### Mailer config
PeerID sends emails to the newly registered users to verify their email and forgot password functionality. We have to provide the following credentials in the config as below:

```bash
"mailer": {
  "host": "EMAIL_HOSTNAME",
  "port": EMAIL_PORT,
  "secure": false,
  "auth": {
    "user": "EMAIL_AUTH_USERNAME",
    "pass": "EMAIL_AUTH_PASSWORD"
  },
  "sender": "PeerID"
}
```

### Peerplays config
PeerID can connect to the peerplays testnet using the peerplays config provided in the config file as below. If this config is not provided, it will connect to the peerplays mainnet instead:

```bash
"peerplays": {
  "peerplaysWS": "wss://irona.peerplays.download/api",
  "peerplaysFaucetURL": "https://irona-faucet.peerplays.download/api/v1/accounts",
  "referrer": "1.2.0",
  "feeAssetId": "1.3.0",
  "paymentAccountID": "PAYMENT_ACCOUNT_ID",
  "paymentAccountWIF": "PAYMENT_ACCOUNT_WIF"
}
```