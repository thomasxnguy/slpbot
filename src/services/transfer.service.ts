import {Connection, getConnection} from "typeorm";
import {Guid} from "guid-typescript";
import {Account} from "../models/account";
import {TransferHistory} from "../models/transferHistory";

/**
 * Execute an transfer between sender and receiver account.
 * Balance will be updated in an atomic way.
 */
export const  transferFund = async (
    conn: Connection,
    senderId: string,
    receiverId: string,
    tokenId : string,
    amount : number
): Promise<string> => {

    if (senderId === receiverId) {
        return ''
    }

    try {
        const resp = await getConnection().transaction("REPEATABLE READ", async transactionalEntityManager => {
            const sender = await conn.getRepository(Account).findOne({id: senderId, tokenId});
            if (!sender) {
                return 'User does not exists'
            }
            const receiver = await conn.getRepository(Account).findOne({id: receiverId, tokenId});
            if (!receiver) {
                return 'Receiver does not exists'
            }

            // check if enough funds.
            if ((Number(sender.balance) - amount) < 0) {
                return 'Insufficient fund';
            }

            sender.balance -= amount;
            receiver.balance += amount;
            const transfer = new TransferHistory(
                Guid.create().toString(),
                tokenId,
                new Date().toISOString(),
                sender.id,
                receiver.id,
                amount
            )

            await conn.getRepository(TransferHistory).create(transfer);
            await conn.getRepository(Account).save(receiver);
            await conn.getRepository(Account).save(sender);

            return '';
        });
        return resp;
    } catch (error) {
        console.log('error ');
        return 'Tip failed, please try again'
    }
};