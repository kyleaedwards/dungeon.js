const utils = require('../../utils');

module.exports = function handshook(serverName) {
  if (this._server) {
    this.app.display.line('Reconnected!');
  }
  this.app.prompt.enable();
  this._server = serverName;

  // Submit token for immediate login.
  const token = utils.getCookie('token');
  if (token) {
    this._.emit('token', token);
  } else {
    this.app.display.template('handshook');
  }
};
