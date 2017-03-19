const Room = require('../models/room');

module.exports = {
  command: 'edit',
  strategy: 'keyword',
  description: 'Edits a room.',
  category: 'building',
  role: 'creator',
  action(ctx, cmd) {
    ctx.print('Editing a room...');
    ctx.prompt.series([
      {
        key: 'shortDesc',
        message: 'Short Description:',
        error: 'I said short description, not that short.',
        validation: phrase => phrase.length > 3,
      },
      {
        key: 'longDesc',
        message: 'Long Description:',
        validation: phrase => !!phrase && phrase.length > 0,
        error: 'A long description is required.'
      }
    ], (results) => {
      const shortDesc = results.shortDesc;
      const longDesc = results.longDesc;
      const room = ctx.state.rooms[ctx.user.roomId];
      room.shortDesc = shortDesc;
      room.longDesc = longDesc;
      room.save((err) => {
        if (err) {
          ctx.error('Something went wrong.');
        } else {
          ctx.success('Room ID ' + ctx.user.roomId + ' edited successfully.');
        }
      });
    });
  },
};
