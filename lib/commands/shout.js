module.exports = {
  command: 'shout',
  strategy: 'flat',
  description: 'Shout to the surrounding area.',
  category: 'communication',
  role: 'player',
  action(ctx, cmd) {
    const communication = {
      type: 'communication',
      range: 'area',
      message: cmd.args[0],
      sender: ctx.user.handle,
    };
    ctx.broadcastNearby(communication, true);
  },
};
