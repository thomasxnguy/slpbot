import {Connection, getConnection} from "typeorm";
import {Guid} from "guid-typescript";
import {Account} from "../models/account";
import {TransferPending} from "../models/transferPending";
import {TransferHistory} from "../models/transferHistory";

export const getOrCreateAccountForTelegramUser = async (
    conn: Connection,
    telegramUserId: string,
    username: string,
    tokenId: string,
): Promise<Account> => {

    const account = await conn.getRepository(Account).findOne({id: telegramUserId, tokenId});

    if (account) {
        return account;
    }

    // Create a new account otherwise
    const newAccount = new Account
    (
        telegramUserId,
            tokenId,
            username,
            new Date().toISOString(),
            "50",
    );

    // Check if there are pending transactions, if yes consume the transactions
    const transferPendings = await conn.getRepository(TransferPending).find({receiverName: username, tokenId});
    if (transferPendings) {

        await getConnection().transaction(async transactionalEntityManager => {
            for (const transferPending of transferPendings) {
                newAccount.balance = (Number(newAccount.balance) + Number(transferPending.amount)).toString();

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
            await conn.getRepository(Account).save(newAccount);
        });
    } else {
        await conn.getRepository(Account).save(newAccount);
    }

    return getOrCreateAccountForTelegramUser(conn, telegramUserId, username, tokenId);
};

export const getAccount = async (
    conn: Connection,
    userId: string,
    tokenId: string,
): Promise<Account> => {

    const account = await conn.getRepository(Account).findOne({id: userId, tokenId});

    if (account) {
        return account;
    }

    return getAccount(conn, userId, tokenId);
};

export const getAccountByUserName = async (
    conn: Connection,
    userName: string,
    tokenId: string,
): Promise<Account|undefined> => {

    const account = await conn.getRepository(Account).findOne({ username: userName, tokenId });

    if (account) {
        return account;
    }

    return undefined;
};