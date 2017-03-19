module.exports = {
  command: 'look',
  strategy: 'nlp',
  description: 'Examines your surroundings.',
  category: 'exploration',
  role: 'player',
  action(ctx, cmd) {
    // If the user wants to check out the room, just replay the description.
    if (!cmd.args[0] || cmd.args[0] === 'area' || cmd.args[0] === 'room') {
      ctx.printRoom(ctx.state.rooms[ctx.user.roomId]);
    } else {
      ctx.print('Sorry, there\'s really nothing to look at just yet.');
    }
  },
};
