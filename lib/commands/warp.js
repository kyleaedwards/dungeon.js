module.exports = {
  command: 'warp',
  strategy: 'nlp',
  description: 'Teleport to room ID.',
  category: 'movement',
  role: 'creator',
  action(ctx, cmd) {
    console.log(cmd);
    var roomId = cmd.args[0];
    if (!isNaN(roomId) && roomId > 0) {
      ctx.moveRoom(roomId);
    } else {
      ctx.error('Invalid room ID.');
    }
  },
};
