const Room = require('../models/room');

module.exports = {
  command: 'go',
  strategy: 'flat',
  description: 'Moves the player.',
  category: 'movement',
  role: 'player',
  action(ctx, cmd) {
    const direction = cmd.args[0].toLowerCase();
    if (!Room.DIRECTIONS[direction]) {
      return ctx.error('I don\'t understand that direction.');
    }
    Room.getRoom(ctx.user.roomId, cmd.args[0], (err, room) => {
      if (err || !room) {
        ctx.error('You can\'t go that way.');
      } else {
        ctx.moveRoom(room.id);
      }
    });
  },
};
