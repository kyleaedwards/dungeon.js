/**
 * Imports
 */
const keywords = require('../artifacts/keywords.json');

/**
 * Parses a phrase according to the logic of the parsing strategy. It's goal
 * should be to generate an object containing a `command` string and an `args`
 * array.
 *
 * @param   {String}    phrase    Phrase to be parsed
 * @returns {Object}              Determined command and args
 */
module.exports = function parse(phrase) {
  const command = keywords[phrase] || phrase;
  return {
    command,
    args: [],
  };
};
