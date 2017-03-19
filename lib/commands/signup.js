const User = require('../models/user');

module.exports = {
  command: 'signup',
  strategy: 'keyword',
  description: 'Creates a user.',
  category: 'meta',
  action(ctx) {
    let lastPassword;
    ctx.prompt.series([
      {
        key: 'username',
        message: 'Username:',
        validation: handle => handle && handle.length >= 3 && handle.length <= 16,
        error: 'User handles have to be between 3 and 16 characters.',
      },
      {
        key: 'password',
        message: 'Password:',
        conceal: true,
        validation: pw => {
          lastPassword = pw;
          return (pw && pw.length >= 8 && pw.length <= 16);
        },
        error: 'Passwords have to be between 8 and 16 characters.',
      },
      {
        key: 'confirm',
        message: 'Confirm password:',
        conceal: true,
      },
    ], (results) => {
      const username = results.username;
      const password = results.password;
      const confirm = results.confirm;
      if (password === confirm) {
        User.createUser(username, password, (err, user) => {
          if (err) {
            ctx.error(err);
          } else {
            ctx.success('Created user ' + user.handle + ' successfully.');
            ctx.login(user, true);
          }
        });
      } else {
        ctx.error('Passwords did not match, please try again.');
      }
    });
  },
};
