## WalletSLPBot

> Telegram tipping bot for SLP tokens.  
>
> Support any kind of tokens.

### Requirements
- node v10.x


### Get started

Clone this repository and run `npm install`

- For local development setup postgres DB : `docker run --rm --name slpbotdb -e POSTGRES_PASSWORD={PASSWORD} -d -p 5432:5432 postgres`

### Usages

| Command     | Availability | Description                            | Example                                                                                                                                   |
| ----------- | ------------ | -------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `/balance`  | DM/Group     | Look up your balance               | `/balance`                                                                                                                                |
| `/tip`      | DM/Group     | Send someone a tip                     | `/tip @someone 10` to send 10 `TOKEN` to `@someone`                                                                                           |
| `/deposit`  | DM           | Add to your `TOKEN` balance using any coin | `/deposit bsv` to see BSV deposit instructions                                                                                            |
| `/withdraw` | DM           | Withdraw your `TOKEN` balance as any coin  | `/withdraw bch qzs4cgag90hvr89e9ws74pgx763j9u32pus3yf8n7w 100` to withdraw 100 `TOKEN` as BCH to `qzs4cgag90hvr89e9ws74pgx763j9u32pus3yf8n7w` |

###Licence
MIT