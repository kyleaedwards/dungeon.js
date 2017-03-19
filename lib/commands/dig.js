const Room = require('../models/room');

const DIRECTION = [
  'north',
  'south',
  'east',
  'west',
  'up',
  'down',
];

module.exports = {
  command: 'dig',
  strategy: 'keyword',
  description: 'Creates a room.',
  category: 'building',
  role: 'creator',
  action(ctx, cmd) {
    ctx.print('Creating a room...');
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
      Room.createRoom(shortDesc, longDesc, (err, room) => {
        if (err) {
          ctx.error(err || 'Room not created.');
        } else {
          ctx.prompt.series([
            {
              key: 'direction',
              message: 'Connect from current room? (Enter direction or leave blank to not connect):',
              validation: /^(east|west|north|south|up|down)?$/i,
              error: 'Be sure to spell out the proper direction.',
            },
            {
              key: 'back',
              message: 'Create connection back? [YES|NO]',
              validation: /^(y(es)?|no?)$/i,
              error: 'Not a valid Y/N answer.',
            },
          ], (results) => {
            const direction = results.direction;
            const from = ctx.user.roomId;
            const to = room.id;
            if (direction) {
              Room.connect(from, to, direction.toLowerCase(), results.back[0].toLowerCase() === 'y', (err, connectionId) => {
                if (err) {
                  ctx.error('Database error.');
                } else {
                  ctx.success('Room created at ID: ' + to);
                }
              });
            } else {
              ctx.success('Room created at ID: ' + to);
            }
          });
        }
      });
    });
  },
};
