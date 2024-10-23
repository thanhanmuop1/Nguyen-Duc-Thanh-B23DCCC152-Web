const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

let users = [
    { id: 1, name: 'Nguyen Thanh'},
    { id: 2, name: 'Huy Phuc'},
];

app.get('/users',(req,res) => {
    res.status(200).json(users);
})

app.post('/users',(req,res) => {
    const newUser = {
        id: users.length + 1,
        name: req.body.name
    }
    users.push(newUser);
    res.status(201).json(users);
})

app.put('/users/:id',(req,res) => {
    const userId = parseInt(req.params.id);
    const user = users.find(user => user.id === userId);

    if(!user){
        res.status(404).json({message: 'User not found'});
    }

    user.name = req.body.name || user.name;

    res.status(200).json(users);
})

app.delete('/users/:id', (req, res) => {
    const userId = parseInt(req.params.id);
    users = users.filter(u => u.id !== userId);

    res.status(200).json(users);
})

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });