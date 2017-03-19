const Room = require('../models/room');

module.exports = {
  command: 'say',
  strategy: 'flat',
  description: 'Talk to the current room.',
  category: 'communication',
  role: 'player',
  action(ctx, cmd) {
    const communication = {
      type: 'communication',
      message: cmd.args[0],
      sender: ctx.user.handle,
    };
    if (cmd.target) {
      const target = ctx.getRoom().users.filter(u => u.handle === cmd.target);
      if (target && target[0]) {
        const user = ctx.state.users[target[0].id];
        if (user && user.ctx && !user.ctx._done) {
          if (user.id === ctx.user.id) {
            ctx.print(`That's you!`);
            return;
          }
          communication.recipient = cmd.target;
          user.ctx.client.emit('communication', communication);
          ctx.client.emit('communication', Object.assign({}, communication, { me: ctx.user.handle }));
          return;
        }
      }
      ctx.print(cmd.target + ' is not here.');
    } else {
      ctx.broadcastToRoom(communication, true);
    }
  },
};
