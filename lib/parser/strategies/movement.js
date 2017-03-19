/**
 * Imports
 */
const movement = require('../artifacts/movement.json');

module.exports = function parse(phrase) {
  if (phrase.indexOf('go ') === 0) {
    phrase = phrase.slice(3);
  }
  return movement[phrase];
}
