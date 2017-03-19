/**
 * Imports
 */
const User = require('../models/user');

/**
 * Grant user a role. "grant role to handle" or "grant handle role"
 */
module.exports = {
  command: 'grant',
  strategy: 'flat',
  description: 'Grants a role.',
  category: 'admin',
  role: 'admin',
  action(ctx, cmd) {
    let hasTo = false;
    cmd = cmd.args[0].split(' ');
    cmd = cmd.filter(word => {
      if (word === 'to') {
        hasTo = true;
      }
      return word !== 'to'
    });
    let role = cmd[hasTo ? 0 : 1];
    let handle = cmd[hasTo ? 1 : 0];
    User.getByHandle(handle, (err, user) => {
      if (user) {
        user.grantRole(role, (err) => {
          if (err) {
            ctx.error(err);
          } else {
            ctx.success('Role granted successfully.');
          }
        });
      } else {
        ctx.error('That user does not exist.');
      }
    });
  },
};
