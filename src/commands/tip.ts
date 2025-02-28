import { CommandHandler } from '../types';
import { getAccountByUserName } from "../services/account.service";
import { transferFund } from "../services/transfer.service";
import {recordTransfer} from "../services/transferPending.service";
import {isNumber, truncateDecimals} from "../utils";

const Description = 'Send a tip to another user'

/*
  Handle logic for tip command.
 */
const Handler: CommandHandler = async ctx => {
  const { conn } = ctx;

  const usage = () => ctx.reply(`Usage: /tip @username <amount>. Example: /tip @thomasxnguy 10`);

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

  // if amount it is not a number, print usage.
  if (!isNumber(amountRaw)) {
    await usage();
    return;
  }

  const amount = parseFloat(truncateDecimals(amountRaw, ctx.config.tokenDecimal));

  if (!(amount > 0)) {
    await ctx.reply(`Tip amount needs to be more than ${ctx.config.tokenMinimumValue}`);
    return;
  }

  // pre-check if enough funds.
  if ((ctx.account.balance - amount) < 0) {
    await ctx.reply(`Insufficient funds`);
    return;
  }

  const receiver = await getAccountByUserName(conn, receiverUsername, ctx.config.tokenId);

  if (!receiver) {
    // If receiver does not exist, record the transfer to the pending table.
    const msg = await recordTransfer(conn, account.id, receiverUsername, ctx.config.tokenId, amount, ctx.config.tokenDecimal);
    if (msg !== '') {
      await ctx.reply(msg);
      return;
    }
  } else {
    // Execute the transfer
    const msg = await transferFund(conn, account.id, receiver.id, ctx.config.tokenId, amount, ctx.config.tokenDecimal);
    if (msg !== '') {
      await ctx.reply(msg);
      return;
    }
  }


  const senderUsername = ctx.from?.username ?? 'You';

  await ctx.reply(`${senderUsername} tipped ${amount} ${ctx.config.tokenName} to @${receiverUsername}`);
};

export default {Handler, Description};
