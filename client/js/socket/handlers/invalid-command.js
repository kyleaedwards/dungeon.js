module.exports = function invalidCommand(msg) {
  const choices = [
    'I\'m sorry, I don\'t know what you mean by "' + msg.split(' ')[0] + '".',
    'Why, that\'s an odd thing to say.',
    'Are you sure you meant to say that?',
    'I\'m afraid I can\'t do that.',
  ];
  this.app.display.line(choices[Math.floor(Math.random() * choices.length)]);
};
