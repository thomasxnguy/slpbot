import {Connection, getConnection} from "typeorm";
import {Guid} from "guid-typescript";
import {Account} from "../models/account";
import {TransferPending} from "../models/transferPending";
import {TransferHistory} from "../models/transferHistory";

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
    // Account exists.
    if (account) {
        // Check if username has changed, if no, return immediately.
        if (account.username === username) {
            return account;
        }

        account.username = username;
        toUpdateAccount = account;
    } else {
        // Create a new account otherwise.
        toUpdateAccount = new Account
        (
            telegramUserId,
            tokenId,
            username,
            new Date().toISOString(),
            50,
        );
    }

    // Check if there are pending transactions, if yes consume the transactions
    const transferPendings = await conn.getRepository(TransferPending).find({receiverName: username, tokenId});
    if (transferPendings) {

        await getConnection().transaction(async transactionalEntityManager => {
            for (const transferPending of transferPendings) {
                toUpdateAccount.balance += transferPending.amount;

                const transferHistory = new TransferHistory(
                    Guid.create().toString(),
                    tokenId,
                    transferPending.createdAt,
                    transferPending.fromAccountId,
                    telegramUserId,
                    transferPending.amount
                )

                await conn.getRepository(TransferHistory).save(transferHistory);
                await conn.getRepository(TransferPending).delete(transferPending);
            }
            await conn.getRepository(Account).save(toUpdateAccount);
        });
    } else {
        await conn.getRepository(Account).save(toUpdateAccount);
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