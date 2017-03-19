/**
 * Imports
 */
const _ = require('lodash');
const Prompt = require('../prompt');
const User = require('../models/user');
const Room = require('../models/room');
const Session = require('../models/session');

/**
 * The context is essentially a helper object belonging to each connected
 * user, to couple functionality with the socket connection client. These
 * contexts are passed to the called commands where they can trigger events
 * on the game state.
 */
module.exports = class Context {

  constructor(client, state, serverName) {
    this.prompt = new Prompt(this);
    this.state = state;
    this.client = client;
    this.serverName = serverName;
    this._messages = [];
    this._immediate = null;
  }

  print(message) {
    if (this._done) return;
    if (this._immediate) {
      clearImmediate(this._immediate);
      this._immediate = null;
    }
    this._messages.push(message);
    this._immediate = setImmediate(() => {
      this._immediate = null;
      this.client.emit('print', this._messages);
      this._messages = [];
    });
  }

  error(msg) { this.print(`[error]${msg}[/error]`); }
  success(msg) { this.print(`[success]${msg}[/success]`); }

  printRoom(room) {
    const users = room.users.filter(u => u.id !== this.user.id);
    this.client.emit('room', _.assign({}, room, { users }));
  }

  /**
   * Attempts a login with a user or session instance.
   *
   * @param   {User|Session}  user    User or session instance
   * @param   {Boolean}       signup  Optional signup flag to
   */
  login(user, signup) {

    // Login with user or session.
    const isSession = user instanceof Session;

    // DRY code for after the user is obtained.
    const loginWithUser = (err, user) => {
      if (err) {
        console.error(err);
        return;
      }

      // Circular magicks.
      this.user = user;
      user.ctx = this;

      if (!signup) {
        this.success(`Logged in successfully as [bold]${user.handle}[/bold].`);
      }

      // Log out other existing users.
      this.state.invalidateContext(user.id);

      // If logging in,
      if (!isSession) {

        // Create a new session.
        Session.create(user.id, (err, session) => {
          if (err) {
            console.error(err);
            this.print('Could not create a session...');
          } else {
            this.session = session;
            // Store the token on the client.
            this.client.emit('tokenCreated', session.token);
          }
        });
      } else {
        this.session.updateExpiry((err) => {
          if (err) {
            console.error(err);
          }
        });
      }

      // Store the context locally so we can log out the user.
      this.state.setContext(this);
      this.moveRoom(user.roomId, true);
      this.broadcastToRoom({
        type: 'login',
        sender: this.user.handle,
      });

    }

    // If the `user` var is a session, get the user first.
    if (isSession) {
      this.session = user;
      User.getById(user.userId, loginWithUser);
    // Otherwise, just log in.
    } else {
      loginWithUser(null, user);
    }

  }

  logout() {
    if (!this.user) {
      this.print('But you aren\'t logged in...');
    } else {
      if (this.session) {
        // Destroy the session.
        this.session.logout(() => {
          // Tell other users in the current room.
          this.broadcastToRoom({
            type: 'logout',
            sender: this.user.handle,
          });
          // Set the user's status to offline.
          this.user.online = false;
          // Remove the user's reference from the current context.
          this.user = null;
          // Print the status to the current user.
          this.print('You are now logged out.');
        });
      }
    }
  }

  // Moving rooms.
  // User says go x.
  // Get new room. room
  // Remove user from this.state.rooms[user.room].
  // Message rooms[user.room].users that user.handle has left.
  // Set user.room = roomId;
  // Add user to rooms[user.room].
  // Message rooms[user.room].users that user.handle has entered.
  /**
   * Oh boy, this is a real mess of a function.
   */
  moveRoom(roomId, silent) {
    const doMove = () => {
      let room = this.state.rooms[this.user.roomId];
      if (room) {
        room.users = room.users.filter(u => u.id !== this.user.id);
        if (!silent) {
          this.broadcastToRoom(`${this.user.handle} left the area.`);
        }
      }
      this.user.roomId = roomId;
      room = this.state.rooms[this.user.roomId];
      this.user.moveTo(room, (err) => {
        if (err) {
          this.print('Database error.');
        } else {
          // This is suspect, but it's not breaking things...
          room.users.push({
            id: this.user.id,
            handle: this.user.handle,
          });
          if (!silent) {
            this.broadcastToRoom(`${this.user.handle} entered the area.`);
          }
          this.printRoom(room);
        }
      });
    };
    if (!this.state.rooms[roomId]) {
      Room.getRoom(roomId, (err, room) => {
        if (err) {
          this.print(err);
        } else {
          this.state.rooms[room.id] = room;
          // this.printRoom(room);
          doMove();
        }
      });
    } else {
      doMove();
    }
  }

  getRoom() {
    return this.state.rooms[this.user.roomId];
  }

  broadcastNearby(message, broadcastToSelf) {
    const room = this.state.rooms[this.user.roomId];
    room.getConnectionIds((err, connections) => {
      this.broadcastToRoom(message, broadcastToSelf);
      connections.forEach((connection) => {
        this.broadcastToRoom(message, broadcastToSelf, connection.toId);
      });
    });
  }

  broadcastToRoom(message, broadcastToSelf, roomId) {
    const room = this.state.rooms[roomId ? roomId : this.user.roomId];
    if (!room) {
      return;
    }
    const users = room.users
      .map(u => this.state.users[u.id])
      .filter(u => !!u);
    users.forEach((user) => {
      if ((broadcastToSelf || user !== this.user) && user.online && user.ctx && !user.ctx._done) {
        if (typeof message === 'string') {
          user.ctx.print(message);
        } else {
          message.me = user.handle;
          user.ctx.client.emit(message.type || 'message', message);
        }
      }
    });
  }

  destroy(logout) {
    if (this.user) {
      this.broadcastToRoom({
        type: 'logout',
        sender: this.user.handle,
      });
      this.state.invalidateContext(this.user.id, logout);
      this.client = null;
      this.prompt = null;
      this.state = null;
      this.user = null;
      this.room = null;
    } else {
      console.log('something weird here...');
    }
    this._done = true;
  }

};
