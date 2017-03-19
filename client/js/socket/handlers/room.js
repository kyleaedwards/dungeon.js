module.exports = function room(room) {
  const users = room.users.slice(0);
  if (users.length) {
    const usersStrings = [users.pop().handle];
    const remaining = users.map(u => u.handle).join(', ');
    if (remaining) {
      usersStrings.unshift(remaining);
    }
    const isAre = room.users.length > 1 ? 'are' : 'is';
    room.others = usersStrings.join(', and ') + ' ' + isAre + ' here.';
  } else {
    // room.others = 'You are the only one here.'
  }
  this.app.display.template('room', room);
};
