/**
 * Imports
 */
const commands = require('../commands');
const strategies = require('./strategies');

module.exports = class Parser {
  constructor(strategyQueue) {
    if (!strategyQueue) {
      strategyQueue = [
        'movement',
        'keyword',
        'flat',
        'nlp',
      ];
    }
    const cmds = strategyQueue.reduce((res, s) => {
      res[s] = commands
        .filter(cmd => cmd.strategy === s)
        .reduce((obj, cmd) => {
          obj[cmd.command] = {
            action: cmd.action,
            role: cmd.role,
          };
          return obj;
        }, {});
      return res;
    }, {});
    this.strategies = strategyQueue
      .map(s => ({
        strategy: s,
        commands: cmds[s],
        parser: strategies[s],
      }))
      .filter(s => typeof s.parser === 'function');
  }
  parse(text) {
    for (var i = 0; i < this.strategies.length; i++) {
      let res = this.strategies[i].parser(text);
      if (res) {
        if (res.command && this.strategies[i].commands[res.command]) {
          let cmd = this.strategies[i].commands[res.command];
          res.role = cmd.role;
          res.command = cmd.action;
          return res;
        } else if (typeof res === 'string') {
          text = res; // Transform for next parse strategy.
        }
      }
    }
    return false;
  }
};
