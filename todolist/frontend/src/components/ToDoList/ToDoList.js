import React, { useState, useEffect } from 'react';
import { Collapse, Drawer, Popconfirm, Button } from 'antd';
import axiosInstance from '../axios';
import ToDoItem from '../ToDoItem/ToDoItem';
import './ToDoList.css';

const { Panel } = Collapse;

const ToDoList = () => {
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch tasks from the server
  useEffect(() => {
    axiosInstance.get('/todos')
      .then(response => setTasks(response.data))
      .catch(error => console.error('Error fetching tasks:', error));
  }, []);

  // Add a new task
  const addTask = () => {
    if (newTaskTitle && newTaskDueDate) {
      const newTask = {
        title: newTaskTitle,
        description: newTaskDescription,
        dueDate: new Date(newTaskDueDate).toISOString(),
        completed: 0
      };

      axiosInstance.post('/todos', newTask)
        .then(response => {
          const createdTask = {
            ...newTask,
            id: response.data.id
          };
          setTasks([...tasks, createdTask]);
          setNewTaskTitle('');
          setNewTaskDueDate('');
          setNewTaskDescription('');
        })
        .catch(error => console.error('Error adding task:', error));
    }
  };

  // Delete a task
  const deleteTask = (id) => {
    axiosInstance.delete(`/todos/${id}`)
      .then(response => {
        setTasks(tasks.filter(task => task.id !== id));
      })
      .catch(error => console.error('Error deleting task:', error));
  };

  // Toggle task completion
  const toggleTaskCompletion = (id) => {
    const taskToUpdate = tasks.find(task => task.id === id);
    const newCompletedStatus = taskToUpdate.completed === 1 ? 0 : 1;

    axiosInstance.put(`/todos/${id}`, {
      ...taskToUpdate,
      completed: newCompletedStatus
    })
      .then(response => {
        const updatedTasks = tasks.map(task =>
          task.id === id ? { ...task, completed: newCompletedStatus } : task
        );
        setTasks(updatedTasks);
      })
      .catch(error => console.error('Error updating task:', error));
  };

  // Filter tasks based on search term and completion status
  const filterTasks = (tasks) => {
    return tasks.filter(task => 
      task.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  // Filter tasks based on completion status and search term
  const activeTasks = filterTasks(tasks.filter(task => task.completed === 0));
  const completedTasks = filterTasks(tasks.filter(task => task.completed === 1));

  // Handle edit task
  const handleEdit = (task) => {
    setEditingTask(task);
    setDrawerVisible(true);
  };

  // Update task
  const handleUpdate = () => {
    if (editingTask.title && editingTask.dueDate) {
      axiosInstance.put(`/todos/${editingTask.id}`, {
        ...editingTask,
        dueDate: new Date(editingTask.dueDate).toISOString()
      })
        .then(response => {
          const updatedTasks = tasks.map(task =>
            task.id === editingTask.id ? editingTask : task
          );
          setTasks(updatedTasks);
          setDrawerVisible(false);
          setEditingTask(null);
        })
        .catch(error => console.error('Error updating task:', error));
    }
  };

  return (
    <>
      <div className="navbar">
        <div className="navbar-brand">To Do</div>
        <div className="search-bar">
          <input 
            type="text" 
            placeholder="Search tasks..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <div className="todo-list">
        <h2>Thêm công việc</h2>
        <div className='add-task'>
          <input 
          type='text' 
            placeholder='Task title' 
            value={newTaskTitle} 
            onChange={(e) => setNewTaskTitle(e.target.value)} 
          />
          <input 
            type='text' 
            placeholder='Task description' 
            value={newTaskDescription} 
            onChange={(e) => setNewTaskDescription(e.target.value)} 
          />
          <input 
            type='date' 
            value={newTaskDueDate} 
            onChange={(e) => setNewTaskDueDate(e.target.value)} 
          />
          <button className='add-btn' onClick={addTask}>Add task</button>
        </div>
      

      <div className="active-tasks">
        <h2>Công việc cần làm</h2>
        {activeTasks.length === 0 ? (
          <p className='no-tasks'>Hiện tại không có việc gì cần hoàn thành</p>
        ) : (
          activeTasks.map((task) => (
            <ToDoItem 
              key={task.id} 
              task={task} 
              onToggle={toggleTaskCompletion} 
              onDelete={deleteTask}
              onEdit={handleEdit}
            />
          ))
        )}
      </div>

      <Collapse className="completed-tasks">
        <Panel header={`Đã hoàn thành (${completedTasks.length})`} key="1">
          {completedTasks.map((task) => (
            <ToDoItem 
              key={task.id} 
              task={task} 
              onToggle={toggleTaskCompletion} 
              onDelete={deleteTask}
              onEdit={handleEdit}
            />
          ))}
        </Panel>
      </Collapse>

      <Drawer
        title="Edit Task"
        placement="right"
        onClose={() => {
          setDrawerVisible(false);
          setEditingTask(null);
        }}
        open={drawerVisible}
      >
        {editingTask && (
          <div className="edit-form">
            <input
              type="text"
              value={editingTask.title}
              onChange={(e) => setEditingTask({...editingTask, title: e.target.value})}
              placeholder="Task title"
            />
            <input
              type="text"
              value={editingTask.description}
              onChange={(e) => setEditingTask({...editingTask, description: e.target.value})}
              placeholder="Task description"
            />
            <input
              type="date"
              value={editingTask.dueDate.split('T')[0]}
              onChange={(e) => setEditingTask({...editingTask, dueDate: e.target.value})}
            />
            <Popconfirm
              title="Update Task"
              description="Are you sure to change this task?"
              okText="Yes"
              onConfirm={handleUpdate}
              cancelText="No"
            >
              <Button >Update</Button>
            </Popconfirm>
          </div>
        )}
      </Drawer>
    </div>
    </>
  );
};

export default ToDoList; 