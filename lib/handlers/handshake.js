/**
 * Simple handshake to ensure connection and supply server UUID to the
 * client.
 */
module.exports = (ctx) => (clientData) => {
  ctx.client.emit('handshook', ctx.serverName);
};
