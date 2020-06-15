import { CommandHandler } from '../types';
import wallet from '../wallet/tokeninfo/lookup-token';

const Description = 'Get information about token'

let TokenInfo = ''

/*
  Handle logic for the Balance command. Just print to the user its amount.
 */
const Handler: CommandHandler = async ctx => {

  if (TokenInfo === '') {
    TokenInfo = JSON.stringify(await wallet(ctx.config.tokenId), null, 2);
  }
  await ctx.reply(`Token Information : \n${TokenInfo}`);
};

export default { Handler, Description};
