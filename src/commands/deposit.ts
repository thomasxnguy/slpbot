import { CommandHandler } from '../types';
import {isNumber, truncateDecimals} from "../utils";
import {withdrawalFund} from "../services/withdrawal.service";

const Description = 'Deposit tokens'

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
      `Usage: /deposit <txId>. Example: /deposit f1aa8276f055fc0497ed5c5dc5fe2b8626fa1dacef9d06a5bc1de3941bb5e3b6`
    );

  const { args, account } = ctx;

  if (args.length !== 1) {
    await usage();
    return;
  }

  const [txId] = args;

  try {
    // Do deposit
  } catch (error) {
      await ctx.reply('Deposit failed, please try again');
      return;
  }

  await ctx.reply(`Your deposit has been registered, I will contact you again when it will be confirmed!`);
}


export default { Handler, Description};
