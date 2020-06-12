import { CommandHandler } from '../types';

const Description = 'Create an account'

/*
  Handle logic at start. Creation of account is managed by the interceptor,
  we don't need to do anything here.
 */
const Handler: CommandHandler = async ctx => {
  if (ctx.chat?.type === 'private') {
    await ctx.reply(`You're all set! Next try /help`);
  } else {
    await ctx.reply(`You're all set, @${ctx.username}`);
  }
};

export default { Handler, Description};
