import {Connection, getConnection} from "typeorm";
import {Guid} from "guid-typescript";
import {Account} from "../models/account";
import {TransferPending} from "../models/transferPending";

/**
 * Record a pending transaction for a non existing user.
 */
export const recordTransfer = async (
    conn: Connection,
    senderId: string,
    receiverName: string,
    tokenId : string,
    amount : number
): Promise<string> => {

    try {
        const resp = await getConnection().transaction("REPEATABLE READ", async transactionalEntityManager => {
            const sender = await conn.getRepository(Account).findOne({id: senderId, tokenId});
            if (!sender) {
                return 'user does not exists.'
            }

            // check if enough funds.
            if ((Number(sender.balance) - amount) < 0) {
                return 'Insufficient fund';
            }

            sender.balance = (Number(sender.balance) - amount).toString();

            const transferTemp = Object.assign(new TransferPending(), {
                id: Guid.create().toString(),
                receiverName,
                tokenId,
                createdAt: new Date().toISOString(),
                fromAccountId: sender.id,
                amount,
            })

            await conn.getRepository(TransferPending).save(transferTemp);
            await conn.getRepository(Account).save(sender);

            return '';
        });

        return resp;
    } catch (error) {
        console.log('error ');
        return 'Tip failed, please try again'
    }
};
