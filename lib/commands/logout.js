module.exports = {
  command: 'logout',
  description: 'Logs the player out.',
  category: 'meta',
  strategy: 'keyword',
  role: 'player',
  action(ctx) {
    ctx.logout();
  },
};
