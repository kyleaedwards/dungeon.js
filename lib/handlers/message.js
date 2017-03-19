const _ = require('lodash');

/**
 * Handles any common input from the client and passes it along to either
 * the prompt queue or the command parser.
 */
module.exports = (ctx, parser) => (message) => {
  const prompt = ctx.prompt.current;
  if (prompt) {
    if (typeof prompt.action === 'function') {
      return prompt.action(message);
    } else {
      return ctx.print('That was weird. Sorry.');
    }
  }
  const cmd = parser.parse(message);
  if (cmd) {
    if (cmd.role) {
      if (!ctx.user) {
        return ctx.print('You must be logged in to do that.');
      } else if (_.isArray(cmd.role) && !_.intersection(cmd.role, ctx.user.roles).length) {
        return ctx.print('You don\'t have permission to do that.');
      } else if (ctx.user.roles.indexOf(cmd.role) === -1) {
        return ctx.print('You don\'t have permission to do that.');
      }
    }
    cmd.command(ctx, cmd);
  } else {
    ctx.client.emit('invalidCommand', message);
  }
};
