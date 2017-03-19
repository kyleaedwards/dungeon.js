module.exports = function disconnect() {
  this.app.display.line(this.app.display.error('Disconnected from the server.'));
  this.app.prompt.disable();
};
