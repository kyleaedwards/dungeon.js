module.exports = class Prompt {

  constructor(ctx) {
    this.ctx = ctx;
    this.queue = [];
    this.current = null;
  }

  /**
   * Pushes a prompt onto the queue and schedules a shift.
   *
   * @param   {Object}    prompt    Prompt object
   * @param   {Function}  [action]  Optional callback
   */
  push(prompt, action) {
    if (action && typeof action === 'function') {
      prompt.action = (response) => {
        let input = false;
        if (prompt.validation && prompt.validation.test) {
          if (prompt.validation.test(response)) {
            input = response;
          }
        } else {
          input = response;
        }
        if (input === false) {
          this.ctx.print(prompt.error || 'Invalid response');
          this.queue.unshift(prompt);
        } else {
          action(input);
        }
        this.shift();
      };
    }
    this.queue.push(prompt);
    if (this.immediate) {
      clearImmediate(this.immediate);
    }
    this.immediate = setImmediate(() => {
      this.immediate = undefined;
      this.shift();
    });
  }

  /**
   * Shifts a prompt from the queue and sends to the client.
   *
   * @param   {Object}    prompt    Prompt object
   */
  shift(prompt) {
    this.current = this.queue.shift();
    if (this.current) {
      this.ctx.client.emit('prompt', {
        message: this.current.message,
        conceal: this.current.conceal,
      });
    }
  }

  /**
   * Compiles an array of prompts in the queue and returns responses
   * to a single callback.
   *
   * @param   {Array}     prompts    Prompt object array
   * @param   {Function}  action     Callback when complete
   */
  series(prompts, action) {
    const results = {};
    let i = 0;
    const end = prompts.length;
    prompts.forEach((prompt) => {
      prompt.action = (response) => {
        let input = false;
        if (typeof prompt.validation === 'function') {
          if (prompt.validation(response)) {
            input = response;
          }
        } else if (prompt.validation && prompt.validation.test) {
          if (prompt.validation.test(response)) {
            input = response;
          }
        } else {
          input = response;
        }
        if (input === false) {
          this.ctx.print(prompt.error || 'Invalid response');
          this.queue.unshift(prompt);
        } else {
          results[prompt.key] = input;
          // If final prompt is completed, run the callback with the obtained results.
          if (++i === end) {
            action(results);
          }
        }
        this.shift();
      }
      this.push(prompt);
    });
  }

};
