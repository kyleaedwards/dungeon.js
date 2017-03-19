/**
 * Imports
 */
const Mustache = require('mustache');
const templates = require('../templates');

/**
 * Constants
 */
const LINE = '<span class="rule"></span>';
const entityMap = {
  // '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  // '"': '&quot;',
  // "'": '&#39;',
  // '`': '&#x60;',
};

function escapeHtml(string) {
  return String(string).replace(/[<>]/g, function (s) {
    return entityMap[s];
  });
}

/**
 * MUD display module.
 */
module.exports = class Display {

  /**
   * Constructor
   *
   * @param   {Object}  app   Application injection
   */
  constructor(app) {
    this.app = app;
    this._ = document.createElement('div');
    this._.id = 'display';
    this.app._app.appendChild(this._);
    this.maxLines = 50;
    if (!this.app.state.lines) {
      this.app.state.lines = [];
    }
    this.app.state.lines.forEach(el => {
      this._.appendChild(el);
    });
    window.scrollTo(0,document.body.scrollHeight);
  }

  /**
   * Prints escaped line.
   */
  line(...args) {
    const el = document.createElement('div');
    el.className = 'line';
    args.forEach((arg) => {
      if (typeof arg === 'string') {
        el.appendChild(document.createTextNode(arg));
      } else {
        el.appendChild(arg);
      }
    });
    this.app.state.lines.push(el);
    while (this.app.state.lines.length > this.maxLines) {
      this._.removeChild(this.app.state.lines.shift());
    }
    this._.appendChild(el);
    window.scrollTo(0,document.body.scrollHeight);
  }

  /**
   * Prints raw HTML.
   */
  rawline(...args) {
    const el = document.createElement('div');
    el.className = 'line';
    el.innerHTML = args.join('');
    this.app.state.lines.push(el);
    while (this.app.state.lines.length > this.maxLines) {
      this._.removeChild(this.app.state.lines.shift());
    }
    this._.appendChild(el);
    window.scrollTo(0, document.body.scrollHeight);
  }

  /**
   * Creates a span tag with a provided class.
   */
  c(cn, ...args) {
    const el = document.createElement('span');
    el.className = cn;
    args.forEach((arg) => {
      if (typeof arg === 'string') {
        el.appendChild(document.createTextNode(arg));
      } else {
        el.appendChild(arg);
      }
    });
    return el;
  }

  /**
   * Passes along options to Mustache template before processing
   * markup.
   */
  template(type, options) {
    if (templates[type]) {
      const output = Mustache.render(templates[type], options);
      console.log(options);
      this.process(output);
    }
  }

  /**
   * Processes templatized markup and converts tags into
   * styled text.
   */
  process(output) {
    output = escapeHtml(output);
    output = output.replace(/\[line\]/gi, LINE);
    while (output.match(/\[([^\]/]+)\](.+?)\[\/\1\]/gi)) {
      output = output.replace(/\[([^\]/]+)\](.+?)\[\/\1\]/gi, (match, tag, content) => {
        if (typeof this[tag] === 'function') {
          return this[tag](content).outerHTML;
        } else {
          return content;
        }
      });
    }
    output.split(/\n/).forEach((line) => {
      this.rawline(line);
    });
  }

  /**
   * Prints a clickable command to the display.
   */
  command(cmd) {
    const el = this.c('command', cmd);
    el.setAttribute('data-cmd', cmd);
    return el;
  }

  /**
   * Markup and text helper methods.
   **/
  system() { return this.c('system', ...arguments); }
  success() { return this.c('success', '✔ ', ...arguments); }
  info() { return this.c('info', ...arguments); }
  warn() { return this.c('warn', ...arguments); }
  error() { return this.c('error', '✘ ', ...arguments); }
  bold() { return this.c('bold', ...arguments); }
  italic() { return this.c('italic', ...arguments); }
  underline() { return this.c('underline', ...arguments); }
  dim() { return this.c('dim', ...arguments); }
  rainbow() { return this.c('rainbow', ...arguments); }
  normal() { return this.c('normal', ...arguments); }
  area() { return this.c('area', ...arguments); }
  private() { return this.c('private', ...arguments); }
  global() { return this.c('global', ...arguments); }
  emote() { return this.c('emote', ...arguments); }

  /**
   * Template helper methods.
   **/
  room(room) { return this.template('room', room); }
  handshook() { return this.template('handshook'); }

  /**
   * Deactivates the display and frees up DOM elements and listeners.
   */
  deactivate() {
    this._ = null;
    this.app = null;
  }

};
