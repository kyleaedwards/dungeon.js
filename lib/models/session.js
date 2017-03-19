/**
 * Imports
 */
const db = require('./adapters/mysql');
const uuid = require('uuid').v4;

/**
 * Constants
 */
const TABLE = 'sessions';
const SESSION_EXPIRY = 1000 * 60 * 60 * 24; // One day.

/**
 * Session walkthrough:
 * 1) User submits token.
 * 2) If token exists and is logged in,
 * 3) Log that token + client out.
 * 4) Log in with other token.
 */
class Session {

  constructor(data) {
    for (var key in data) {
      if (typeof this[key] !== 'function') {
        this[key] = data[key];
      }
    }
  }

  updateExpiry(cb) {
    const expires = new Date(Date.now() + SESSION_EXPIRY);
    const query = `UPDATE ${TABLE} SET expires = ? WHERE token = ?`;
    db.query(query, [expires, this.token], (err, res) => {
      if (err) {
        cb('Database error.');
      } else {
        cb();
      }
    });
  }

  isExpired() {
    const now = Date.now();
    const expires = this.expires.getTime();
    return (now > expires);
  }
  isValid() { return !this.isExpired(); }

  logout(cb) {
    this.expires = new Date(0);
    const query = `UPDATE ${TABLE} SET expires = ? WHERE userId = ?`;
    db.query(query, [this.expires, this.userId], (err, res) => {
      if (err) {
        console.error(err);
        cb('Database error.');
      } else {
        cb();
      }
    });
  }

  static getByToken(token, cb) {
    const now = new Date();
    const query = `SELECT * FROM ${TABLE} WHERE token = ? AND expires > ?`;
    db.query(query, [token, now], (err, res) => {
      if (err) {
        console.error(err);
        cb('Database error.');
      } else if (!res.length) {
        cb(null, false);
      } else {
        const data = {
          token: res[0].token,
          expires: new Date(res[0].expires),
          userId: res[0].userId,
        };
        cb(null, new Session(data));
      }
    });
  }

  static getByUser(userId, cb) {
    const now = Date.now();
    const query = `SELECT * FROM ${TABLE} WHERE userId = ? AND expires > ?`;
    db.query(query, [userId, now], (err, res) => {
      if (err) {
        console.error(err);
        cb('Database error.');
      } else if (!res.length) {
        cb(null, false);
      } else {
        const data = {
          token: res[0].token,
          expires: new Date(res[0].expires),
          userId: res[0].userId,
        };
        cb(null, new Session(data));
      }
    });
  }

  static create(userId, cb) {
    if (!userId || typeof userId === 'function') {
      return cb('Invalid user id.');
    }
    const expires = new Date(Date.now() + SESSION_EXPIRY);
    const token = uuid();
    const query = `INSERT INTO ${TABLE} (userId, token, expires) VALUES (?, ?, ?)`;
    db.query(query, [userId, token, expires], (err, results) => {
      if (err) {
        console.log(err);
        return cb('Database error.');
      }
      Session.getByToken(token, cb);
    });
  }
}

module.exports = Session;
