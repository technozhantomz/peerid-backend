# Creating accounts required for PeerID to function

NOTE: If you have exisiting accounts you would like to use, please skip to the section related to pulling your account ID and your private active key

### Dependencies: 

For this following tasks, you must have one of the following:

NOTE: For the following walkthrough, we will assume you have your own testnet running as a system service

- Your own testnet running -  Instructions can be found [here for docker](https://infra.peerplays.tech/advanced-topics/private-testnets/peerplays-qa-environment)  and [here for system service!](https://infra.peerplays.tech/advanced-topics/private-testnets/private-testnets-manual-install)
- Using the testnet cli_wallet to connect to: wss://mint.peerplays.download/api - along with relevant testnet funds

### Unlocking cli_wallet
Since we began with a fresh testnet; We require creating new accounts from the cli-wallet to be used for payments and escrow. 


- Unlocking cli_wallet (Please replace "password" with your peerplays wallet password):

```
./cli_wallet
unlock password
```

## Creating payment-account 
NOTE: - Your brain key will be different than what is listed below 

**ENSURE YOU SAVE THE OUTPUT OF `suggest_brain_key` COMMAND** 

```
suggest_brain_key 
create_account_with_brain_key "your_suggested_brain_key" payment-account nathan nathan true
```

Output of the above command will look similar to the following: 

```
 {
 	"ref_block_num": 56015,
 	"ref_block_prefix": 3819424927,
 	"expiration": "2021-09-03T12:37:54",
 	"operations": [
 		[
 			5, {
 				"fee": {
 					"amount": 514941,
 					"asset_id": "1.3.0"
 				},
 				"registrar": "1.2.18",
 				"referrer": "1.2.18",
 				"referrer_percent": 0,
 				"name": "payment-account-account",
 				"owner": {
 					"weight_threshold": 1,
 					"account_auths": [],
 					"key_auths": [
 						["TEST7q6r7ZXwUGB45yNMCs1TQaCbBhvWzFXKTyxS5YUdhBQM2YhLcP", 1]
 					],
 					"address_auths": []
 				},
 				"active": {
 					"weight_threshold": 1,
 					"account_auths": [],
 					"key_auths": [
 						["TEST7U8Jh42nMv84gT3JfASLvdVgGBVjSWougobj4AsCt42yK59tGz", 1]
 					],
 					"address_auths": []
 				},
 				"options": {
 					"memo_key": "TEST8Da4aA4UVhHyJQSYXiyGGSRMYHh3a1JzZsfxAZXmMKaD5yfGKu",
 					"voting_account": "1.2.5",
 					"num_witness": 0,
 					"num_committee": 0,
 					"votes": [],
 					"extensions": []
 				},
 				"extensions": {}
 			}
 		]
 	],
 	"extensions": [],
 	"signatures": ["2026bccb4af34cb641989dd1e4edbddce9025e302820236d20a5f2433590a3b4da2d4c4021272f6e24fcd36f67ecf0d97160eff5ca16d96f9d0c4ffbc6fed25107"]
 }
```

## Creating escrow-account
NOTE: Your brain keys will be different than what is listed below 

**ENSURE YOU SAVE THE OUTPUT OF `suggest_brain_key` COMMAND** 

```
suggest_brain_key 

create_account_with_brain_key "your_suggested_brain_key" escrow-account nathan nathan true
```

Output of the above command will look similar to the following: 
```
create_account_with_brain_key "DEVALL SLATISH POUNDAL REDDISH DAMSONWHOEVER COUCHEE GUSSIE SYNOVIA BROIL EPACME FOSSULE APPLIER FLYBACKDOSER GIPSER" escrow-account nathan nathan true
{
	"ref_block_num": 56015,
	"ref_block_prefix": 3819424927,
	"expiration": "2021-09-03T12:37:54",
	"operations": [
		[
			5, {
				"fee": {
					"amount": 514941,
					"asset_id": "1.3.0"
				},
				"registrar": "1.2.18",
				"referrer": "1.2.18",
				"referrer_percent": 0,
				"name": "escrow-account",
				"owner": {
					"weight_threshold": 1,
					"account_auths": [],
					"key_auths": [
						["TEST7q6r7ZXwUGB45yNMCs1TQaCbBhvWzFXKTyxS5YUdhBQM2YhLcP", 1]
					],
					"address_auths": []
				},
				"active": {
					"weight_threshold": 1,
					"account_auths": [],
					"key_auths": [
						["TEST7U8Jh42nMv84gT3JfASLvdVgGBVjSWougobj4AsCt42yK59tGz", 1]
					],
					"address_auths": []
				},
				"options": {
					"memo_key": "TEST8Da4aA4UVhHyJQSYXiyGGSRMYHh3a1JzZsfxAZXmMKaD5yfGKu",
					"voting_account": "1.2.5",
					"num_witness": 0,
					"num_committee": 0,
					"votes": [],
					"extensions": []
				},
				"extensions": {}
			}
		]
	],
	"extensions": [],
	"signatures": ["2026bccb4af34cb641989dd1e4edbddce9025e302820236d20a5f2433590a3b4da2d4c4021272f6e24fcd36f67ecf0d97160eff5ca16d96f9d0c4ffbc6fed25107"]
}
```

## Confirming account creation/funding:
We can confirm account creation with the following commands: 

 `get_account payment-account` and `get_account escrow-account`

You will require your public active key for both accounts - you will see in something similar to below: 

NOTE - Your keys will not be x's

```
  "active": {
    "weight_threshold": 1,
    "account_auths": [],
    "key_auths": [[
        "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",

```

To fund each account, send over TEST tokens from nathan account - You can fund both accounts with the following commands:

`transfer nathan payment-account 20000 TEST "" true`

`transfer nathan escrow-account 20000 TEST "" true`

## Obtaining active private keys for new accounts:

From the cli_wallet - use the command `get_private_key` command along with your active public key - Results will look like the following: 

```
get_private_key <YOUR active public key>
<output of your private active key>
```


For further configurations you will need BOTH private keys from the payment-account & escrow-account




