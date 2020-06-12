import { CommandHandler } from '../types';
import { getAccountByUserName } from "../repositories/account.repository";
import { transferFund } from "../repositories/transfer.repository";
import {recordTransfer} from "../repositories/transferPending.repository";

const Description = 'Send a tip to another user'

/*
  Handle logic for tip command.
 */
const Handler: CommandHandler = async ctx => {
  const { conn } = ctx;

  const usage = () => ctx.reply(`Usage: /tip @username <amount>. Example: /tip @brekken 10`);

  const { args, account } = ctx;

  if (args.length < 2) {
    await usage();
    return;
  }

  const [receiverRaw, amountRaw] = args;

  const receiverUsername = receiverRaw.match(/^@([a-z0-9_]+)$/i)?.[1];

  // if receiver user name is not specified, print usage.
  if (!receiverUsername) {
    await usage();
    return;
  }

  const amount = parseFloat(amountRaw);

  // if amount is negative, print usage.
  if (!(amount > 0)) {
    await usage();
    return;
  }

  // check if enough funds.
  if ((Number(ctx.account.balance) - amount) < 0) {
    await ctx.reply(`Insufficient funds`);
    return;
  }

  const receiver = await getAccountByUserName(conn, receiverUsername, ctx.config.tokenId );

  if (!receiver) {
    // If receiver does not exist, record the transfer to the pending table.
    await recordTransfer(conn, account, receiverUsername, ctx.config.tokenId, amount);
  } else {
    // Execute the transfer
    await transferFund(conn, account, receiver, ctx.config.tokenId, amount);
  }

  const senderUsername = ctx.from?.username ?? 'You';

  await ctx.reply(`${senderUsername} tipped ${amount} ${ctx.config.tokenId} to @${receiverUsername}`);
};

export default {Handler, Description};
