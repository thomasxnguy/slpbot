## WalletSLPBot

> Telegram tipping bot for SLP tokens.  
>
> Support any kind of tokens.

### Requirements
- node v10.x


### Get started

- Clone this repository and run `npm install`
- Build with `npm run build`
- Start with `npm run start`

### Local Environment
- Setup Database with `cd docker; docker-compose up`
- Run migration with `npm run db:migration -- migration:run`
- To create new migration, run `npm run db:migration -- migration:generate -n {{name}}`
- Verify Database connecting to pgadmin `http://localhost:8080` or `psql -h localhost -p 5432 --username=admin -d slpbotdb`
- 

### Usages

| Command     | Availability | Description                            | Example                                                                                                                                   |
| ----------- | ------------ | -------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `/balance`  | DM/Group     | Look up your balance               | `/balance`                                                                                                                                |
| `/tip`      | DM/Group     | Send someone a tip                     | `/tip @someone 10` to send 10 `TOKEN` to `@someone`                                                                                           |
| `/deposit`  | DM           | Add to your `TOKEN` balance using any coin | `/deposit bsv` to see BSV deposit instructions                                                                                            |
| `/withdraw` | DM           | Withdraw your `TOKEN` balance as any coin  | `/withdraw bch qzs4cgag90hvr89e9ws74pgx763j9u32pus3yf8n7w 100` to withdraw 100 `TOKEN` as BCH to `qzs4cgag90hvr89e9ws74pgx763j9u32pus3yf8n7w` |

###Licence
MIT