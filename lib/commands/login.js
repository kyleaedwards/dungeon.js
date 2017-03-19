const User = require('../models/user');
const Room = require('../models/room');
const Session = require('../models/session');

module.exports = {
  command: 'login',
  strategy: 'keyword',
  description: 'Logs the player in.',
  category: 'meta',
  action(ctx) {
    if (ctx.user) {
      return ctx.error('You\'re already logged in as ' + ctx.user.handle + '.');
    }
    ctx.prompt.series([
      {
        key: 'username',
        message: 'Username:',
      },
      {
        key: 'password',
        message: 'Password:',
        conceal: true,
      }
    ], (results) => {
      const username = results.username;
      const password = results.password;
      User.checkCredentials(username, password, (err, user) => {
        if (err) {
          ctx.error(err);
        } else {
          ctx.login(user);
        }
      });
    });
  },
};
