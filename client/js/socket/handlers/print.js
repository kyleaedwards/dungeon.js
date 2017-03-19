module.exports = function print(msgs) {
  msgs.forEach(msg => this.app.display.process(msg));
};
