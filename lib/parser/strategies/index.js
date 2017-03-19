/**
 * Parser strategies take in a prompt string and attempt to extract a usable
 * command and argument set.
 */
module.exports = {
  'keyword': require('./keyword'),
  'flat': require('./flat'),
  'nlp': require('./nlp'),
  'movement': require('./movement'),
};
