/**
 * Imports
 */
const natural = require('natural');
const stopwords = natural.stopwords;
const tokenizer = new natural.AggressiveTokenizer();
const synonyms = require('../artifacts/synonyms.json');

module.exports = function parse(phrase) {

  const args = tokenizer.tokenize(phrase)
    .filter(s => (s.length === 1 && s !== 'a') || stopwords.indexOf(s) === -1);

  let command = args.shift();

  command = synonyms[command] || command;

  return {
    command: command,
    args: args.map(s => synonyms[s] || s),
  };

};
