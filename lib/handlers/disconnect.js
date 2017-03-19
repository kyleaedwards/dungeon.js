/**
 * Destroy context on disconnect.
 */
module.exports = (ctx) => () => {
  ctx.destroy(false);
};
