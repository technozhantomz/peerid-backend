# PeerID - Backend

## Dependencies: 

The following has been tested on the latest Ubuntu 20.04.

This installation document assumes you are running your own testnet, or have access to the current "mint" testnet.  If you do not have access to either of the above, please refer to the documentation here:

- Your own testnet running -  Instructions can be found [here for docker](https://infra.peerplays.tech/advanced-topics/private-testnets/peerplays-qa-environment)  and [here for system service!](https://infra.peerplays.tech/advanced-topics/private-testnets/private-testnets-manual-install)
- Using the testnet cli_wallet to connect to: wss://mint.peerplays.download/api - along with relevant testnet funds

You will also need to create two blockchain accounts, a payment account and an escrow account.  If you do not already have accounts you will use for these purposes, instructions for creating them are [here](/docs/accountCreation.md).

### Node.js

You will need Node.js version 12.13.0 - This can easily be installed via the NVM repo [here!](https://github.com/nvm-sh/nvm) or using the following script:


- Installing NVM:  `curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash`
- Installing/Using Node 12:  `nvm install 12 && nvm use 12` 


### Installing, and enabling system start up of Postgres v11.3 

_Note: Docker is required if you are running Postgres 12.x on the same system already._

```
sudo apt update && sudo apt dist-upgrade 
wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -
echo "deb http://apt.postgresql.org/pub/repos/apt/ $(lsb_release -cs)-pgdg main" | sudo tee /etc/apt/sources.list.d/postgresql-pgdg.list
sudo apt update
sudo apt install postgresql-11
sudo systemctl enable postgresql.service && sudo systemctl start postgresql.service
sudo -i -u postgres
psql
CREATE DATABASE peerid;
\q
exit
```

### Running Postgres 11.3 with Docker - Docker-Compose required:

`docker-compose -f docker_dependency.yml up`

## Configuring PeerID Backend
Cloning the backend - `git clone https://gitlab.com/PBSA/peerid/peerid-backend.git`

Creating the `.env` environment file - `cp example.env .env`

Configure the `.env` file with relevant Postgres connection information 

NOTE: The commited .env file is an EXAMPLE - Modify this using your best security practices, for security reasons, you should not using the following example file. 

Changing default ports & **not** using the default postgres user is **HIGHLY** recommended

```
DB_USER=postgres
DB_PASSWORD=123456
DB_HOST=postgres
DB_PORT=5432
DB_DATABASE=peerid-backend
```

### Configuring default.json, development.json and production.json
Change into config directory and open default.json with text editor - `cd peerid-backend/config/ && nano development.json`

The first section is related to the above section - Connecting with the postgres user you created and connection details above

The second is setting up SSO for Google, Facebook, and Discord logins

NOTE - This is **NOT** a requirement

For information on how to get ClientID and SecretKeys from Google, Facebook, and Discord you can use the following links:

#### Facebook
- https://theonetechnologies.com/blog/post/how-to-get-facebook-application-id-and-secret-key

#### Google
- https://developers.google.com/adwords/api/docs/guides/authentication#webapp

- https://console.developers.google.com/apis/credentials

#### Discord
- http://faq.demostoreprestashop.com/faq.php?fid=133&pid=41

### Email sender setup

Follow the documentation on how to add an app password, and use this inside of the following section:

https://devanswers.co/create-application-specific-password-gmail/

```
  "mailer": {
    "host": "smtp.gmail.com",
    "port": 587,
    "secure": false,
    "auth": {
      "user": "<your_email_address>",
      "pass": "<app_password_provided_by_google>"
    },
    "sender": "<your_name>",
    "tls": {
        "rejectUnauthorized": false

```
### Configuring Peerid / Peerplays testnet information
```
  "frontendUrl": "<wherever_your_front_url_lives>", - this can be localhost, or the complete URL
  "backendUrl": "http://localhost:3000", - Leaving this has default is fine, reverse proxy with SSL is recommended
  "frontendCallbackUrl": "http://localhost:8082/callback",
  "peerplays": {
    "peerplaysWS": "wss://mint.peerplays.download/api", - Your testnet api or leave as default to connect to Peerplays testnet
    "peerplaysFaucetURL": "https://mint-faucet.peerplays.download/api/v1/accounts", - Your faucet URL, this would be attached to testnet setup, or leave default to use the mint-testnet
    "referrer": "1.2.0", - This is the commitee account on general testnets
    "feeAssetId": "1.3.0", - This is the on-chain asset ID for TEST token (PPY on mainnet)
    "paymentAccountID": "1.2.x", - Obtained in steps above
    "paymentAccountWIF": "5HttHcgL2NgFc5XsFY8bs51VehVDS2Tb4NGkRuwjJ6v6Mq7eC7S" - Obtained in steps above
  
```

## Serving the application

You can use the following commands to install the dependencies & run the software from the root directory of the project

```
npm i
npm run start 
```

It is recommended to use pm2 to serve this application in the background, this can be done like the following:

- `npm install pm2 -g` - installing globally
- `pm2 --name peerid-backend start npm -- start`
- `pm2 logs peerid-backend` - Checking logs to ensure startup was successful

Here are a few other pm2 commands that can be useful: 

`pm2 restart peerid-backend` - Restarting the service after changes
`pm2 stop peerid-backend` - Gracefully stopping the service
`pm2 del peerid-backend` - Gracefully deleting application

It is also best practice to use a reverse proxy with TLS/SSL - Here is an example using nginx:

```
server {
  server_name <your URL/DOMAIN>;
  root /var/www/peerid-gui;

   add_header 'Access-Control-Allow-Origin' '*' always;
   add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS, PUT, DELETE' always;
   add_header 'Access-Control-Allow-Headers' 'X-Requested-With,Accept,Content-Type,Authorization, Origin' always;

  location /api {
   add_header 'Access-Control-Allow-Origin' '*' always;
   add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS, PUT, DELETE' always;
   add_header 'Access-Control-Allow-Headers' 'X-Requested-With,Accept,Content-Type,Authorization, Origin' always;

  proxy_pass http://localhost:3000;

            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
  }

}
```

## API Documentation

You can find API documentation [here!](/docs/swagger.yaml)



## How to force migration of databases

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

