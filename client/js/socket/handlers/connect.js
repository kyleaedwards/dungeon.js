module.exports = function connect(data) {
  if (this._server) {
    this.app.display.line('Trying to reconnect...');
  } else {
    this.app.display.line('Connecting to server...');
  }
  this._.emit('handshake', 'Hello World from client');
};
