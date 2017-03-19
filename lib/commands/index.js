/**
 * Each of these modules below marks a command catchable by the `Parser`. Each
 * command object must have the following attributes:
 *
 * - command:   The command key that the `Parser` resolves to with its logic.
 * - strategy:  The `Parser` strategy that the command belongs to.
 * - role:      The role a player must possess to use the command. Otherwise the
 *              user will be told they lack sufficient permissions.
 * - action:    The function called when the command is invoked. The context and
 *              command data are passed in from the `Parser`.
 */
module.exports = [
  require('./login'),
  require('./logout'),
  require('./signup'),
  require('./go'),
  require('./dig'),
  require('./grant'),
  require('./help'),
  require('./say'),
  require('./emote'),
  require('./shout'),
  require('./boom'),
  require('./edit'),
  require('./look'),
  require('./where'),
  require('./warp'),
];
