/**
 * Each of these modules below accept a context instance and return an event
 * handler function to respond to a socket message with the matching key. If
 * you'd like to add custom socket events, be sure to include the handler here.
 *
 * NOTE: Chances are there will be little need to add much here, as the client
 * should primarily be sending events as commands under the `message` event
 * label.
 *
 * Each handler must follow the interface of (context) => Function.
 */
module.exports.message = require('./message');
module.exports.handshake = require('./handshake');
module.exports.token = require('./token');
module.exports.disconnect = require('./disconnect');
