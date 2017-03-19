/**
 * MUD prompt element to connect to both the display and socket.
 */
module.exports = class Prompt {

  /**
   * Constructor
   *
   * @param   {Object}  app   Application injection
   */
  constructor(app) {

    this.app = app;

    // Create the input element.
    this._ = document.createElement('input');
    this._.type = 'text';
    this._.id = 'prompt';
    this._.disabled = true; // Initially disable prompt.

    // Create the pre-prompt text.
    this.pre = document.createElement('span');
    this.pre.id = 'pre';
    this.pre.innerText = '> ';
    this.preStack = [];

    // Create the container.
    this.gutter = document.createElement('div');
    this.gutter.id = 'gutter';
    this.gutter.appendChild(this.pre);
    this.gutter.appendChild(this._);
    this.app._app.appendChild(this.gutter);

    // Initialize prompt concealment for passwords.
    this.concealed = false;

    // Capture [RETURN] key.
    this._handleKeypress = this.handleKeypress.bind(this);
    this._.addEventListener('keyup', this._handleKeypress);

    // Keep focus on prompt element.
    this._refocus = this.refocus.bind(this);
    this._.addEventListener('blur', this._refocus);
    this._.focus();

  }

  /**
   * Disables the prompt.
   */
  disable() {
    this._.disabled = true;
    this.clear();
  }

  /**
   * Enables the prompt.
   */
  enable() {
    this._.disabled = false;
    this._.focus();
  }

  /**
   * Clears prompt and pops the next pre-prompt from its stack.
   */
  clear() {
    this._.value = '';
    this.pre.innerText = (this.preStack.pop() || '> ');
    this._.type = 'text';
    this.concealed = false;
  }

  /**
   * Submits a value to the server via the app socket.
   */
  setPre(pre) {
    this.preStack.push(this.pre.innerText);
    this.pre.innerText = pre + ' ';
  }

  /**
   * Conceals the prompt text for passwords or other sensitive information.
   * Note that this is NOT actually a secure way to transmit data.
   */
  conceal() {
    this.concealed = true;
    this._.type = 'password';
  }

  /**
   * Submits a value to the server via the app socket.
   *
   * @param   {String}  value   String value from the prompt
   */
  submit(value) {
    value = value.trim();
    let lastLine = `${this.pre.innerText} `;
    if (this.concealed) {
      lastLine += '•'.repeat(value.length);
    } else {
      lastLine += value;
    }
    this.app.display.line(this.app.display.dim(lastLine));
    this.app.socket.message(value);
  }

  /**
   * Deactivates the prompt and frees up DOM elements and listeners.
   */
  deactivate() {
    this._.removeEventListener('keyup', this._handleKeypress);
    this._.removeEventListener('blur', this._refocus);
    this._ = null;
    this.gutter = null;
    this.pre = null;
    this.app = null;
  }

  /**
   * Event handler to bind keypresses.
   */
  handleKeypress(e) {
    const key = e.which || e.keyCode || 0;
    if (key === 13) {
      e.preventDefault();
      this.submit(this._.value);
      this.clear();
    }
  }

  /**
   * Event handler to continually keep focus on the prompt.
   */
  refocus(e) {
    e.preventDefault();
    this._.focus();
  }

};
