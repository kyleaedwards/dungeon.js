const Room = require('../models/room');

module.exports = {
  command: 'where',
  strategy: 'flat',
  description: 'Shows rooms with IDs. (Optional search argument.)',
  category: 'movement',
  role: 'creator',
  action(ctx, cmd) {
    const search = cmd.args[0];
    Room.getAll(search, (err, rooms) => {
      rooms.forEach((room) => {
        ctx.print(`${room.shortDesc} (${room.id})`);
      });
    });
  },
};
