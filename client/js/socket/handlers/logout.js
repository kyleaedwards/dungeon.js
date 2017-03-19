/**
 * Ranges:
 * - Private
 * - Normal
 * - Area
 * - Global
 */
module.exports = function logout(message) {
  const sender = message.sender;
  this.app.display.process(`[system]${sender} logged out.[/system]`);
};
