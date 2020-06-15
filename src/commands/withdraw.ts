import { CommandHandler } from '../types';
import {isNumber, truncateDecimals} from "../utils";
import {withdrawalFund} from "../services/withdrawal.service";

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
      `Usage: /withdraw <slp_address> <amount>. Example: /withdraw slp:qpcfjcsntpu9yrcv9ud2sfqaztfpvy8tusan0wrlnj 50`
    );

  const { args, account } = ctx;

  if (args.length !== 2) {
    await usage();
    return;
  }

  const [address, amountRaw] = args;

  // if amount it is not a number, print usage.
  if (!isNumber(amountRaw)) {
    await usage();
    return;
  }

  if (address === '' || !address.startsWith('slp')) {
    await ctx.reply(`Invalid slp address`);
    return;
  }

  const amount = parseFloat(truncateDecimals(amountRaw, ctx.config.tokenDecimal));

  if (!(amount > 0)) {
    await ctx.reply(`Withdraw amount needs to be more than ${ctx.config.tokenMinimumValue}`);
    return;
  }

  // pre-check if enough funds.
  if ((ctx.account.balance - amount) < 0) {
    await ctx.reply(`Insufficient funds`);
    return;
  }

  try {
    const msg = await withdrawalFund(conn, ctx.config, account.id, address, amount);
    if (msg !== '') {
      await ctx.reply(msg);
      return;
    }
  } catch (error) {
      await ctx.reply('Withdrawal failed, please try again');
      return;
  }

  await ctx.reply(`${amount} ${ctx.config.tokenName} successfully sent to slp address [${address}]!`);
}


export default { Handler, Description};
