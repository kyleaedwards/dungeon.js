module.exports = {
  command: 'help',
  strategy: 'flat',
  description: 'Displays help text.',
  category: 'meta',
  action(ctx, cmd) {
    const commands = require('./index.js');
    const cmds = {};
    const categories = [];
    const arg = cmd.args[0];
    const isCommand = false;
    commands.forEach((command) => {
      if ((!ctx.user && command.role) || (ctx.user && ctx.user.roles.indexOf(command.role) < 0)) {
        return;
      }
      if (!cmds[command.category]) {
        cmds[command.category] = [];
        categories.push(command.category);
      }
      cmds[command.category].push({
        command: command.command,
        description: command.description,
      });
    });
    categories.forEach((cat) => {
      cmds[cat] = cmds[cat]
        .filter(c => !!c.description)
        .sort((a, b) => {
          return a.command.localeCompare(b.command);
        });
    });
    ctx.client.emit('help', cmds);
  },
};
