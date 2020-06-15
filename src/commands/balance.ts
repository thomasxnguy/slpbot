import { CommandHandler } from '../types';

const Description = 'Get the balance for current account'

/*
  Handle logic for the Balance command. Just print to the user its amount.
 */
const Handler: CommandHandler = async ctx => {
  await ctx.reply(`${ctx.account.balance} ${ctx.config.tokenName}`);
};

export default { Handler, Description};
