/**
 * Ranges:
 * - Private
 * - Normal
 * - Area
 * - Global
 */
module.exports = function communication(message) {
  const isSelf = message.sender === message.me;
  const msg = message.message;
  const sender = message.sender;
  const recipient = message.recipient;
  let range = message.range || 'normal';
  let subject = `[info][${sender}]:[/info]`;
  let suffix = '';
  if (recipient) {
    range = 'private';
    if (isSelf) {
      subject = `To [${recipient}]:`
    } else {
      subject = `[${sender}] whispers:`
    }
  } else if (range === 'area') {
    subject = `[info][${sender}] shouting:[/info]`;
  } else if (range === 'global') {
    subject = `❗️[${sender}]:`;
    // subject = `❗️ ${sender}:`
    // suffix = ` ❗️`;
  } else if (range === 'emote') {
    subject = sender;
  }

  this.app.display.process(`[${range}]${subject} ${msg}[/${range}]${suffix}`);
};
