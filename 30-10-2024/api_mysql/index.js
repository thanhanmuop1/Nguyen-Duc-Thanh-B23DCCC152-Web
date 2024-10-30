const express = require('express');
const app = express();
const port = 3000;
const todoRoutes = require('./src/routers/todos');

app.use(express.json());
app.use('/todos', todoRoutes);

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });

