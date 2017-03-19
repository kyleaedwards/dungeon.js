module.exports = function login(message) {
  const sender = message.sender;
  this.app.display.process(`[system]${sender} logged in.[/system]`);
};
