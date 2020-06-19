import {Connection, getConnection} from "typeorm";
import {Account} from "../models/account";
import {Config} from "../config";
import wallet from '../wallet/send/send-token';
import {Withdrawal} from "../models/withdrawal";

/**
 * Execute a withdrawal to a slp address.
 */
export const withdrawalFund = async (
    conn: Connection,
    config : Config,
    accountId: string,
    slpAddress: string,
    amount : number
): Promise<string> => {

    try {
        const resp = await getConnection().transaction("REPEATABLE READ", async transactionalEntityManager => {
            const {tokenId} = config;
            const account = await conn.getRepository(Account).findOne({id: accountId, tokenId});
            if (!account) {
                return 'User does not exists'
            }

            // pre-check if enough funds.
            if ((account.balance - amount) < 0) {
                return "Insufficient fund"
            }

            account.balance = Number((account.balance-amount).toFixed(config.tokenDecimal));

            const txId = await wallet(config.walletMnemo, tokenId, amount, slpAddress);

            if (txId === "invalid address") {
                return "invalid slp address"
            }


            const withdrawal = new Withdrawal(
                txId,
                tokenId,
                new Date().toISOString(),
                slpAddress,
                account,
                amount
            )

            await conn.getRepository(Withdrawal).save(withdrawal);
            await conn.getRepository(Account).save(account);

            return '';
        });
        return resp;
    } catch (error) {
        console.log('error ');
        return 'Withdrawal failed, please try again'
    }
};