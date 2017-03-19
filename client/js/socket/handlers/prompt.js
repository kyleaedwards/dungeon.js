module.exports = function prompt(pre) {
  if (pre.conceal) {
    this.app.prompt.conceal();
  }
  this.app.prompt.setPre(pre.message);
};
