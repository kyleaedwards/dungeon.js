module.exports = {
  command: 'emote',
  strategy: 'flat',
  description: 'Emotes to other players near you.',
  category: 'communication',
  role: 'player',
  action(ctx, cmd) {
    const communication = {
      type: 'communication',
      range: 'emote',
      message: cmd.args[0],
      sender: ctx.user.handle,
    };
    ctx.broadcastToRoom(communication, true);
  },
};
