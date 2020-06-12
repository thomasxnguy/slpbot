import {Connection, getConnection} from "typeorm";
import {Guid} from "guid-typescript";
import {Account} from "../models/account";
import {TransferPending} from "../models/transferPending";

/**
 * Record a pending transaction for a non existing user.
 */
export const recordTransfer = async (
    conn: Connection,
    sender: Account,
    receiverName: string,
    tokenId : string,
    amount : number
): Promise<void> => {

    // eslint-disable-next-line no-param-reassign
    sender.balance = (Number(sender.balance) - amount).toString();

    const transferTemp = Object.assign(new TransferPending(), {
        id: Guid.create().toString(),
        receiverName,
        tokenId,
        createdAt: new Date().toISOString(),
        fromAccountId: sender.id,
        amount,
    })

    await getConnection().transaction(async transactionalEntityManager => {
        await conn.getRepository(TransferPending).save(transferTemp);
        await conn.getRepository(Account).save(sender);
    });
};
