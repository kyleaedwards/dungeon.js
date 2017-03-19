/**
 * Imports
 */
const synonyms = require('../artifacts/synonyms.json');

/**
 * Parses a phrase according to the logic of the parsing strategy. Its goal
 * should be to generate an object containing a `command` string and an `args`
 * array.
 *
 * @param   {String}    phrase    Phrase to be parsed
 * @returns {Object}              Determined command and args
 */
module.exports = function parse(phrase) {

  if (phrase.indexOf('@') === 0) {
    phrase = 'tell ' + phrase.slice(1);
  }

  let command = phrase.split(' ').shift();
  let hasTarget = command === 'tell' || command === 'page';
  let target;
  let str = phrase.slice(command.length + 1);

  // Determine target if necessary.
  if (str.indexOf('to ') === 0) {
    str = str.slice(3);
    hasTarget = true;
  }
  if (hasTarget) {
    const spacePos = str.indexOf(' ');
    target = str.slice(0, spacePos);
    str = str.slice(spacePos + 1);
    target = target.replace(/^@|:$/g, '');
  }

  // Strip quotes.
  if ((str[0] === '"' && str[str.length - 1] === '"') ||
      (str[0] === '\'' && str[str.length - 1] === '\'')) {
    str = str.slice(1, -1);
  }

  command = synonyms[command] || command;

  return {
    command,
    args: [ str ],
    target
  };

};
