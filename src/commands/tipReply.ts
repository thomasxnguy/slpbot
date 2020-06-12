import { CommandHandler } from '../types';
import { getAccountByUserName } from "../repositories/account.repository";
import { transferFund } from "../repositories/transfer.repository";
import {recordTransfer} from "../repositories/transferPending.repository";

/*
  Handle logic for tip at reply.
 */
const Handler: CommandHandler = async ctx => {
  const { conn } = ctx;
  const usage = () => ctx.reply(`Usage: Reply with tip <amount>. Example: tip 10`);

  // Fetch the receiver user name from the context.
  const receiverUsername = ctx.message?.reply_to_message?.from?.username || undefined

  // If it is a reply message.
  if (receiverUsername) {

    const {args, account} = ctx;

    if (args.length !== 1) {
      await usage();
      return;
    }

    const amount = parseFloat(args[0]);
    if (!(amount > 0)) {
      await usage();
      return;
    }

    if ((Number(ctx.account.balance) - amount) < 0) {
      await ctx.reply(`Insufficient funds`);
      return;
    }

    const receiver = await getAccountByUserName(conn, receiverUsername, ctx.config.tokenId);

    if (!receiver) {
      // If receiver does not exist, record the transfer to temp table.
      await recordTransfer(conn, account, receiverUsername, ctx.config.tokenId, amount);
    } else {
      // Execute the transfer
      await transferFund(conn, account, receiver, ctx.config.tokenId, amount);
    }

    const senderUsername = ctx.from?.username ?? 'You';

    await ctx.reply(`${senderUsername} tipped ${amount} ${ctx.config.tokenId} to @${receiverUsername}`);
  }
};

export default {Handler};
