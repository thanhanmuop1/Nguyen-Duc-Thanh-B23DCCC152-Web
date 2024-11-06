const Todo = require('../models/todo');

exports.getAllTodos = (req, res) => {
    Todo.getAll((err, results) => {
        if (err) return res.status(500).json({ error: err });
        res.status(200).json(results);
    });
};

exports.createTodo = (req, res) => {
    const { title, description, dueDate } = req.body;
    Todo.create(title, description, dueDate, (err, result) => {
        if (err) return res.status(500).json({ error: err });
        res.status(201).json({
            id: result.insertId,
            title,
            description,
            dueDate,
            completed: 0
        });
    });
};

exports.updateTodo = (req, res) => {
    const { id } = req.params;
    const { title, description, dueDate, completed } = req.body;
    Todo.update(id, title, description, dueDate, completed, (err, result) => {
        if (err) return res.status(500).json({ error: err });
        res.status(200).json({
            id: parseInt(id),
            title,
            description,
            dueDate,
            completed
        });
    });
};

exports.deleteTodo = (req, res) => {
    const { id } = req.params;
    Todo.delete(id, (err, result) => {
        if (err) return res.status(500).json({ error: err });
        res.status(200).json({message: 'Todo deleted successfully'});
    });
};
