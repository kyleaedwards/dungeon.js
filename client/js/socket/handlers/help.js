module.exports = function help(categories) {
  const commands = [];
  for (var category in categories) {
    commands.push({ category });
    categories[category].forEach((cmd) => {
      commands.push(cmd);
    });
    commands.push({ isBlank: 1 });
  }
  commands.pop();
  this.app.display.template('help', { commands });
};
