import {Connection, getConnection} from "typeorm";
import {Guid} from "guid-typescript";
import {Account} from "../models/account";
import {TransferPending} from "../models/transferPending";
import {TransferHistory} from "../models/transferHistory";
import wallet from '../wallet/create/create-wallet';
import {SlpAddress} from "../models/slpAddress";

/**
 * Get the account for a telegram user or create it if it does not exists.
 * All pending transaction assigned to his username will be granted at creation.
 */
export const getOrCreateAccountForTelegramUser = async (
    conn: Connection,
    telegramUserId: string,
    username: string,
    tokenId: string,
): Promise<Account> => {

    const account = await conn.getRepository(Account).findOne({id: telegramUserId, tokenId});
    let toUpdateAccount: Account;
    let toCreateAddress : SlpAddress | null = null;
    // Account exists.
    if (account) {
        // Check if username has changed, if no, return immediately.
        if (account.username === username) {
            return account;
        }

        account.username = username;
        toUpdateAccount = account;
    } else {
        // Create wallet
        const {mnemonic, slpAddress, cashAddress, legacyAddress} = await wallet();
        const dateNow = new Date().toISOString();
        // Create a new account
        toUpdateAccount = new Account
        (
            telegramUserId,
            tokenId,
            username,
            dateNow,
            50,
            slpAddress,
        );

        // Create an SLP address
        toCreateAddress = new SlpAddress(
            slpAddress,
            mnemonic,
            cashAddress,
            legacyAddress,
            dateNow,
            telegramUserId
        )

    }

    // Check if there are pending transactions, if yes consume the transactions
    const transferPendings = await conn.getRepository(TransferPending).find({receiverName: username, tokenId});
    if (transferPendings) {

        await getConnection().transaction(async transactionalEntityManager => {

            await conn.getRepository(Account).save(toUpdateAccount);

            if (toCreateAddress != null) {
                await conn.getRepository(SlpAddress).save(toCreateAddress);
            }

            for (const transferPending of transferPendings) {
                toUpdateAccount.balance = transferPending.amount;

                const transferHistory = new TransferHistory(
                    Guid.create().toString(),
                    tokenId,
                    transferPending.createdAt,
                    transferPending.fromAccount,
                    toUpdateAccount,
                    transferPending.amount
                )

                await conn.getRepository(TransferHistory).save(transferHistory);
                await conn.getRepository(TransferPending).delete(transferPending);
            }
            await conn.getRepository(Account).save(toUpdateAccount);
        });
    } else {
        await getConnection().transaction(async transactionalEntityManager => {
            await conn.getRepository(Account).save(toUpdateAccount);
            if (toCreateAddress != null) {
                await conn.getRepository(SlpAddress).save(toCreateAddress);
            }
        });
    }
    return getOrCreateAccountForTelegramUser(conn, telegramUserId, username, tokenId);
};

/**
 * Get an account by userId and tokenId.
 */
export const getAccount = async (
    conn: Connection,
    userId: string,
    tokenId: string,
): Promise<Account|undefined> => {

    const account = await conn.getRepository(Account).findOne({id: userId, tokenId});
    return account;
};

/**
 * Get an account by userId and tokenId with withdrawal history.
 */
export const getAccountWithWithdrawal = async (
    conn: Connection,
    userId: string,
    tokenId: string,
): Promise<Account|undefined> => {

    const account = await conn.getRepository(Account).findOne({where : {id: userId, tokenId}, relations : ["withdrawals"] });
    return account;
};

/**
 * Get an account by userName and tokenId.
 */
export const getAccountByUserName = async (
    conn: Connection,
    userName: string,
    tokenId: string,
): Promise<Account|undefined> => {

    const account = await conn.getRepository(Account).findOne({ username: userName, tokenId });
    return account;
};