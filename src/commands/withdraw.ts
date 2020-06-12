import {Guid} from "guid-typescript";
import { TransferHistory } from '../models/transferHistory';
import { CommandHandler } from '../types';

const Description = 'Withdraw the tokens to a specific address'

/*
  Handle logic to withdraw tokens.
 */
const Handler: CommandHandler = async ctx => {
  const { conn } = ctx;

  if (ctx.chat?.type !== 'private') {
    await ctx.reply(`Command must be used in a private chat`);
    return;
  }

  const usage = () =>
    ctx.reply(
      `Usage: /withdraw <btc/bch> <address> <amount>. Example: /withdraw bch bitcoincash:qqu0fl22ar6r66m3y03w33d6sd9hmuwp3qnkwckjmh 1000`
    );

  const { args, account } = ctx;

  if (args.length !== 3) {
    await usage();
    return;
  }

  const [settleMethodId, address, amountRaw] = args;

  const amount = parseFloat(amountRaw);

  if (!(amount > 0)) {
    await usage();
    return;
  }

  let transfer: TransferHistory;

  try {
    transfer = await conn.getRepository(TransferHistory).save(
    new TransferHistory(
        Guid.create().toString(),
        ctx.config.tokenId,
        new Date().toISOString(),
        account.id,
        "funding",
        amount.toString()
    ));
  } catch (error) {
    if (error.message.match(/account_check/)) {
      await ctx.reply(`Insufficient funds`);
      return;
    }

    throw error;
  }

  await ctx.reply(`OK!`);
};

export default { Handler, Description};
