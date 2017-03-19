/**
 * Imports
 */
const _ = require('lodash');
const db = require('./adapters/mysql');
const bcrypt = require('bcrypt');

/**
 * Constants
 */
const SALT_ROUNDS = 10;

class User {

  constructor(data) {
    for (var key in data) {
      if (typeof this[key] !== 'function') {
        this[key] = data[key];
      }
    }
  }

  moveTo(roomId, cb) {
    if (typeof roomId === 'object' && roomId.id) {
      roomId = roomId.id;
    }
    if (typeof roomId === 'number') {
      db.query('UPDATE user_rooms SET roomId = ? WHERE userId = ?', [roomId, this.id], (err, res) => {
        if (err) {
          cb('Database error.');
        } else {
          cb();
        }
      });
    }
  }

  grantRole(roleName, cb) {
    const existsQuery = `SELECT u.id
      FROM users u
      INNER JOIN user_roles ur ON ur.userId = u.id
      INNER JOIN roles r ON r.id = ur.roleId
      WHERE ur.role = ?
        AND u.id = ?`;
    db.query(existsQuery, [roleName, this.id], (err, results) => {
      if (results && results.length) {
        cb('User already possesses that role.');
      } else {
        const setQuery = `INSERT INTO user_roles
          (userId, roleId) VALUES
          (?, (SELECT id FROM roles WHERE role = ?))`;
        db.query(setQuery, [this.id, roleName], (err, results) => {
          if (results && results.insertId) {
            cb(null);
          } else {
            cb('Could not grant role.');
          }
        });
      }
    });
  }

  static checkCredentials(handle, password, cb) {
    db.query('SELECT * FROM users WHERE handle = ?', [handle], (err, results) => {
      if (err) {
        console.log(err);
        cb('Database error.');
      } else if (!results.length) {
        cb('User doesn\'t exist.');
      } else {
        bcrypt.compare(password, results[0].password, (err, res) => {
          if (res && res === true) {
            db.query('UPDATE users SET lastLoggedIn = NOW()');
            User.getByHandle(handle, cb);
          } else {
            cb('Invalid handle/password combination.');
          }
        });
      }
    });
  }

  static getByHandle(handle, cb) {
    if (!handle || !_.isString(handle)) {
      return cb('Invalid handle.');
    }
    return User.get('handle', handle, cb);
  }
  static getById(id, cb) {
    if (!id || !_.isInteger(id)) {
      return cb('Invalid ID.')
    }
    return User.get('id', id, cb);
  }

  static get(label, value, cb) {
    const query = `
      SELECT u.id AS id, u.handle AS handle, r.role AS role, up.roomId AS roomId
      FROM users u
      LEFT JOIN user_roles ur ON u.id = ur.userId
      LEFT JOIN roles r ON ur.roleId = r.id
      INNER JOIN user_rooms up ON u.id = up.userId
      WHERE u.${label} = ?
    `;
    db.query(query, [value], (err, results) => {
      if (err) {
        console.log(err);
        cb('Database error.');
      } else if (!results.length) {
        cb('User not found.');
      } else {
        const data = {
          id: results[0].id,
          handle: results[0].handle,
          roles: results.map(u => u.role),
          roomId: results[0].roomId,
        };
        cb(null, new User(data));
      }
    });
  }

  static createUser(handle, password, cb) {
    if (!handle) {
      return cb('Invalid handle.');
    }
    if (!password || !password.length || password.length < 8) {
      return cb('Invalid password. Must be at least 8 characters.');
    }
    db.query('SELECT id FROM users WHERE handle = ?', [handle], (err, results) => {
      if (err) {
        console.log(err);
        cb('Database error.');
      } else if (results.length) {
        cb('User already exists.');
      } else {
        bcrypt.hash(password, SALT_ROUNDS, (err, hash) => {
          // Store hash in your password DB.
          if (err) {
            cb('Password hash error.');
          } else {
            const query = `
              BEGIN;
              INSERT INTO users (handle, password, createdAt, lastLoggedIn) VALUES (?, ?, NOW(), NOW());
              SET @uid = LAST_INSERT_ID();
              INSERT INTO user_rooms (userId, roomId) VALUES (@uid, (SELECT id FROM rooms LIMIT 1));
              INSERT INTO user_roles (userId, roleId) VALUES (@uid, (SELECT id FROM roles WHERE role = 'player' LIMIT 1));
              COMMIT;
            `;
            db.query(query, [handle, hash], (err, res) => {
              if (err) {
                console.error(err);
                return cb('Database error.');
              } else {
                User.getByHandle(handle, cb);
              }
            });
          }
        });
      }
    });
  }
}

module.exports = User;
