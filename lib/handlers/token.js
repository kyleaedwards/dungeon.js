const Session = require('../models/session');

/**
 * Attempt a client token login on initialization.
 */
module.exports = (ctx) => (token) => {
  Session.getByToken(token, (err, session) => {
    if (!err && session) {
      ctx.login(session);
    } else {
      ctx.client.emit('tokenExpired');
    }
  });
};
