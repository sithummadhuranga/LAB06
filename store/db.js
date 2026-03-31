// store/db.js
/*
 * In-memory data layer — per lab specification (no database).
 * Exported as a singleton object so all modules share the same reference.
 * Using plain arrays + manual counters instead of UUIDs keeps the payload
 * IDs short and easy to test with curl / Postman.
 */

const db = {
  users: [],
  posts: [],
  _uid: 1,
  _pid: 1,

  nextUserId() { 
    this._uid = Date.now() + Math.floor(Math.random() * 1000); 
    return this._uid; 
  },
  nextPostId() { 
    this._pid = Date.now() + Math.floor(Math.random() * 1000); 
    return this._pid; 
  },

  findUserByEmail(email) {
    return this.users.find(u => u.email === email.toLowerCase().trim());
  },

  findUserById(id) {
    return this.users.find(u => u.id === id);
  },

  findPostById(id) {
    return this.posts.find(p => p.id === id);
  },

  findPostIndexById(id) {
    return this.posts.findIndex(p => p.id === id);
  },
};

module.exports = db;
