/**
 * Imports
 */
const db = require('./adapters/mysql');

/**
 * Constants
 */
const DIRECTIONS = {
  up: 'down',
  down: 'up',
  north: 'south',
  south: 'north',
  east: 'west',
  west: 'east',
};

class Room {

  constructor(data) {
    for (var key in data) {
      if (typeof this[key] !== 'function') {
        this[key] = data[key];
      }
    }
  }

  save(cb) {
    const query = 'UPDATE rooms SET shortDesc = ?, longDesc = ? WHERE id = ?';
    db.query(query, [this.shortDesc, this.longDesc, this.id], cb);
  }

  getConnectionIds(cb) {
    const query = 'SELECT toId, direction FROM room_connections WHERE fromId = ?';
    db.query(query, [this.id], cb);
  }

  /**
   * Either retrieves a room based on the room's ID, or on the room's adjoining ID
   * and its direction.
   */
  static getRoom(id, direction, cb) {
    if (typeof direction === 'function') {
      cb = direction;
      direction = null;
    }
    if (!id) {
      return cb('Invalid room ID.');
    }
    let query = [
      'SELECT r.id AS id, r.shortDesc AS shortDesc, r.longDesc AS longDesc, u.id AS userId, u.handle AS user_handle',
      'FROM rooms r',
      'LEFT JOIN user_rooms ur ON r.id = ur.roomId',
      'LEFT JOIN users u ON ur.userId = u.id',
    ];
    let values;
    if (!direction) {
      query.push('WHERE r.id = ?');
      values = [id];
    } else {
      query.push('WHERE r.id = (SELECT rc.toId FROM room_connections rc WHERE rc.fromId = ? AND rc.direction = ?)');
      values = [id, direction];
    }
    db.query(query.join(' '), values, (err, results) => {
      if (err) {
        console.log(err);
        cb('Database error.');
      } else if (!results.length) {
        cb('That room does not exist.');
      } else {
        const data = {
          id: results[0].id,
          shortDesc: results[0].shortDesc,
          longDesc: results[0].longDesc,
          users: results
                  .map(u => ({ id: u.userId, handle: u.user_handle }))
                  .filter(u => u.id),
        };
        cb(null, new Room(data));
      }
    });
  }

  static createRoom(shortDesc, longDesc, cb) {
    db.query('INSERT INTO rooms (shortDesc, longDesc) VALUES (?, ?)', [shortDesc, longDesc], (err, res) => {
      if (err || !res.insertId) {
        console.log(err);
        return cb('Database error.');
      }
      Room.getRoom(res.insertId, cb);
    });
  }

  static getAll(search, cb) {
    let where = '';
    if (search) {
      where = `WHERE shortDesc LIKE '%${search}%'`;
    }
    db.query(`SELECT id, shortDesc FROM rooms ${where} ORDER BY shortDesc ASC`, cb);
  }

  static connect(from, to, direction, back, cb) {
    if (typeof back === 'function') {
      cb = back;
      back = true;
    }
    db.query('SELECT id FROM room_connections WHERE fromId = ? AND direction = ?', [from, direction], (err, res) => {
      if (err || !res) {
        console.log(err);
        return cb('Database error.');
      } else if (res.length) {
        return cb('Connection already exists from room #' + from + ' to direction ' + direction + '.');
      }
      db.query('INSERT INTO room_connections (fromId, toId, direction) VALUES (?, ?, ?)', [from, to, direction], (err, res) => {
        if (back) {
          const opposite = Room.DIRECTIONS[direction];
          db.query('INSERT INTO room_connections (fromId, toId, direction) VALUES (?, ?, ?)', [to, from, opposite], (err, res) => {
            if (err || !res.insertId) {
              return cb('Database error.');
            }
            return cb(null, res.insertId);
          });
        } else {
          if (err || !res.insertId) {
            return cb('Database error.');
          }
          return cb(null, res.insertId);
        }
      });
    });
  }
}

Room.DIRECTIONS = DIRECTIONS;

module.exports = Room;
