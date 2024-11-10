const db = require('../config/database');

const Todo = {
    getAll: (calback) => {
        db.query('SELECT * FROM todos', calback);
    },

    create: (title, description, dueDate, priority, callback) => {
        db.query('INSERT INTO todos (title, description, dueDate, priority) VALUES (?, ?, ?, ?)', [title, description, dueDate, priority], callback);
    },

    update: (id, title, description, dueDate, completed, priority, callback) => {
        db.query('UPDATE todos SET title = ?, description = ?, dueDate = ?, completed = ?, priority = ? WHERE id = ?', [title, description, dueDate, completed, priority, id], callback);
    },

    delete: (id, callback) => {
        db.query('DELETE FROM todos WHERE id = ?', [id], callback);
    }
}

module.exports = Todo;