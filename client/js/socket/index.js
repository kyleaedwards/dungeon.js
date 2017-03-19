/**
 * Imports
 */
const handlers = require('./handlers');

/**
 * MUD socket client.
 */
module.exports = class Socket {

  /**
   * Constructor
   *
   * @param   {Object}  app   Application injection
   */
  constructor(app) {
    this._ = io.connect('http://localhost:8080');
    this.app = app;
    this._server = null;

    // Register socket event handlers.
    for (let key in handlers) {
      this._.on(key, handlers[key].bind(this));
    }
  }

  /**
   * Helper method to submit commands to the server.
   *
   * @param   {String}  command   String command
   */
  message(command) {
    this._.emit('message', command);
  }

};
