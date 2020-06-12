import {Connection, getConnection} from "typeorm";
import {Guid} from "guid-typescript";
import {Account} from "../models/account";
import {TransferHistory} from "../models/transferHistory";

/**
 * Execute an transfer between sender and receiver account.
 * Balance will be updated in an atomic way.
 */
export const transferFund = async (
    conn: Connection,
    sender: Account,
    receiver: Account,
    tokenId : string,
    amount : number
): Promise<void> => {

    // eslint-disable-next-line no-param-reassign
    sender.balance = (Number(sender.balance) - amount).toString();
    // eslint-disable-next-line no-param-reassign
    receiver.balance = (Number(receiver.balance) + amount).toString();

    const transfer = new TransferHistory(
        Guid.create().toString(),
        tokenId,
        new Date().toISOString(),
        sender.id,
        receiver.id,
        amount.toString()
    )

    await getConnection().transaction(async transactionalEntityManager => {
        await conn.getRepository(TransferHistory).save(transfer);
        await conn.getRepository(Account).save(receiver);
        await conn.getRepository(Account).save(sender);
    });
};