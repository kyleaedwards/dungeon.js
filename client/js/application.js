/**
 * Imports
 */
const Display = require('./display');
const Prompt = require('./prompt');
const Socket = require('./socket');
const pkg = require('../../package.json');

/**
 * MUD application.
 */
module.exports = class Application {

  /**
   * Constructor
   */
  constructor() {

    // Deactivate existing singleton but preserve socket.
    if (window.__SOMUD__) {
      this.state = window.somud.state;
      this.socket = window.somud.socket;
      this.socket.app = this;
      window.__SOMUD__.deactivate();
      window.__SOMUD__ = null;
    } else {
      this.socket = new Socket(this);
      this.state = {};
    }

    // Mount DOM element.
    this._app = document.getElementById('app');
    this._app.innerHTML = '';

    // Create
    this.display = new Display(this);
    this.prompt = new Prompt(this);
    this._server = null;
    this.display.template('intro', {
      version: pkg.version,
      title: pkg.name.toUpperCase(),
      description: pkg.description,
    });

    // Set the singleton globally.
    window.__SOMUD__ = this;

  }

  /**
   * Deactivates the application and frees up DOM elements and listeners.
   */
  deactivate() {
    // Deactivate prompt.
    this.prompt.deactivate();
    this.prompt = null;

    // Deactivate display.
    this.display.deactivate();
    this.display = null;

    // Free up DOM element.
    this._app = null;
  }

};
