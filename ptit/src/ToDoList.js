import React, { useState, useEffect } from 'react';
import ToDoItem from './ToDoItem';
import './ToDoList.css';

const ToDoList = () => {
  const [tasks, setTasks] = useState([]);

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');

  const addTask = () => {
    if (newTaskTitle && newTaskDueDate) {
      const newTask = {
        id: tasks.length + 1,
        title: newTaskTitle,
        dueDate: newTaskDueDate,
        completed: false,
      }

      setTasks([...tasks, newTask]);
      setNewTaskTitle('');
      setNewTaskDueDate('');
    }
  }

  const deleteTask = (id) => {
    setTasks(tasks.filter(tasks => tasks.id !== id))
  }

  const toggleTaskCompletion = (id) => {
    setTasks(tasks.map(tasks => tasks.id === id ? {...tasks, completed: !tasks.completed} : tasks))
  }

  const sortTasksByDueDate = () => {
    setTasks((prevTasks) =>
      [...prevTasks].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    );
  };

  useEffect(() => {
    sortTasksByDueDate();
  }, [tasks]);


  return (
    <div className="todo-list">
      <h1>My work <span>🎯</span></h1>
      {tasks.length === 0 ? (
        <p className='no-tasks'>Hiện tại không có việc gì cần hoàn thành</p>
      ) : (
        tasks.map(tasks => (
          <ToDoItem key={tasks.id} task={tasks} onToggle={toggleTaskCompletion} onDelete={deleteTask}/>
        ))
      )
    }
    <div className='add-task'>
      <input type='text' placeholder='Task title' value={newTaskTitle} onChange={(e) => setNewTaskTitle(e.target.value)}/>
      <input type='date' value={newTaskDueDate} onChange={(e) => setNewTaskDueDate(e.target.value)}/>
      <button className='add-btn' onClick={addTask}>Add task</button>
    </div>
    </div>
  )
}

export default ToDoList;