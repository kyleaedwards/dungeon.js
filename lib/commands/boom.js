module.exports = {
  command: 'boom',
  strategy: 'flat',
  description: 'Broadcasts a message to all connected players.',
  category: 'communication',
  role: 'admin',
  action(ctx, cmd) {
    const communication = {
      type: 'communication',
      range: 'global',
      message: cmd.args[0],
      sender: ctx.user.handle,
    };
    Object.keys(ctx.state.rooms).forEach((roomId) => {
      ctx.broadcastToRoom(communication, true, roomId);
    });
  },
};
