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

### Run in local environment
- Setup database with `cd docker; docker-compose up`
- Run migration with `npm run db:migration -- migration:run`
- To create new migration, run `npm run db:migration -- migration:generate -n {{name}}`
- Verify Database with pgadmin `http://localhost:8080` or with cli`psql -h localhost -p 5432 --username=admin -d slpbotdb`
 

### Usages

| Command     | Availability | Description                            | Example                                                                                                                                   |
| ----------- | ------------ | -------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `/help`     | DM/Group     | Show bot commands                      | `/help`
| `/balance`  | DM/Group     | Look up your balance                   | `/balance`                                                                                                                                |
| `/tip`      | DM/Group     | Send someone a tip                     | `/tip @someone 10` to send 10 `TOKEN` to `@someone`
| `/tokeninfo`| DM/Group     | Show basic information about the slp token | `/tokeninfo`                                                                                                                                                                 |
| `/withdraw` | DM           | Withdraw your `TOKEN` balance to an external slp address | `/withdraw simpleledger:qzs4cgag90hvr89e9ws74pgx763j9u32pus3yf8n7w 100` to withdraw 100 `TOKEN` to `simpleledger:qzs4cgag90hvr89e9ws74pgx763j9u32pus3yf8n7w` |
| `/withdrawhistory` | DM     | Show records of all withdrawal         |  `/withdrawhistory`

### Licence
MIT
