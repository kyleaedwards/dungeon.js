var Room = require('../models/room');

/**
 * In-mem cache/game state handler.
 *
 * Not quite sure how to handle game state, but I know it should be separate
 * from the context.
 */
module.exports = class State {

  constructor() {
    this.users = {};
    this.rooms = {};
    this.contexts = {};
  }

  invalidateContext(userId, logout) {
    if (this.contexts[userId] && logout !== false) {
      this.contexts[userId].logout();
    }
    this.contexts[userId] = null;
    if (this.users[userId]) {
      this.users[userId].online = false;
    }
  }

  setContext(ctx) {
    const user = ctx.user;
    this.contexts[user.id] = ctx;
    this.users[user.id] = user;
    user.online = true;
  }

};
