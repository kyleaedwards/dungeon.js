/**
 * Constants
 */
const DEFAULT_PROMPT = '> ';
const MODIFIER_KEYS = {
  16: 'shift',
  17: 'control',
  18: 'option',
  91: 'leftCommand', // Gotta figure out good names
  93: 'rightCommand', // Because of the Mac/PC discrepancies
};
const ACTION_KEYS = {
  8: 'backspace',
  13: 'return',
  27: 'esc',
  188: 'comma',
  190: 'period',
  192: 'backtick',
  220: 'backslash',
  222: 'apostrophe',
};

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
    this.pre.innerText = DEFAULT_PROMPT;
    this.preStack = [];

    this.heldKeys = {};

    // Create the container.
    this.gutter = document.createElement('div');
    this.gutter.id = 'gutter';
    this.gutter.appendChild(this.pre);
    this.gutter.appendChild(this._);
    this.app._app.appendChild(this.gutter);

    this.context = false;

    // Initialize prompt concealment for passwords.
    this.concealed = false;

    // Capture keypresses.
    this._handleKeyDown = this.handleKeyDown.bind(this);
    this._handleKeyUp = this.handleKeyUp.bind(this);
    this._.addEventListener('keyup', this._handleKeyUp);
    this._.addEventListener('keydown', this._handleKeyDown);

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
    if (!this.context) {
      this.pre.innerText = (this.preStack.pop() || DEFAULT_PROMPT);
      this._.type = 'text';
      this.concealed = false;
    }
  }

  /**
   * Submits a value to the server via the app socket.
   */
  setPre(pre) {
    this.preStack.push(this.pre.innerText);
    this.pre.innerText = pre + ' ';
  }

  /**
   * Sets a command context, in which all subsequent prompts will
   * apply as arguments to the command until an escape key is pressed.
   */
  setContext(context) {
    this.context = context;
    this.context.previousPrompt = this.pre.innerText;
    this.pre.innerHTML = `<span class="command">${DEFAULT_PROMPT}${context.command} </span>`;
  }

  /**
   * Clears the command context.
   */
  clearContext(context) {
    this.context = null;
    this.clear();
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
    if (this.context) {
      lastLine = this.context.previousPrompt;
      value = `${this.context.command} ${value}`;
    }
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
    this._.removeEventListener('keydown', this._handleKeyDown);
    this._.removeEventListener('keyup', this._handleKeyUp);
    this._.removeEventListener('blur', this._refocus);
    this._ = null;
    this.gutter = null;
    this.pre = null;
    this.app = null;
  }

  /**
   * Event handler to bind key up.
   */
  handleKeyUp(e) {
    const key = e.which || e.keyCode || 0;
    const action = ACTION_KEYS[key];
    const modifier = MODIFIER_KEYS[key];
    let preventDefault = false;
    switch (action) {
      case 'return':
        preventDefault = true;
        this.submit(this._.value);
        this.clear();
        break;
      case 'apostrophe':
        if (!this.context && this._.value.length === 1) {
          this.setContext({
            command: this._.value[0] === '"' ? 'shout' : 'say',
          });
          preventDefault = true;
          this._.value = '';
        }
        break;
      case 'esc':
        if (this.context) this.clearContext();
        preventDefault = true;
        break;
    }
    if (modifier) {
      preventDefault = true;
      this.heldKeys[modifier] = false;
    }
    if (preventDefault) {
      e.preventDefault();
    }
  }

  /**
   * Event handler to bind key up.
   */
  handleKeyDown(e) {
    const key = e.which || e.keyCode || 0;
    const modifier = MODIFIER_KEYS[key];
    const action = ACTION_KEYS[key];
    if (modifier) {
      e.preventDefault();
      this.heldKeys[modifier] = true;
    }
    if (this.context && action === 'backspace' && this._.value.length === 0) {
      e.preventDefault();
      this.clearContext();
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
