import React, { useState, useEffect } from 'react';
import { Collapse, Drawer, Popconfirm, Button, Modal, Input, Dropdown, Space } from 'antd';
import { DownOutlined } from '@ant-design/icons';
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
  const [modalVisible, setModalVisible] = useState(false);
  const [sortBy, setSortBy] = useState('default');

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

  // Rút gọn hàm sortTasks
  const sortTasks = (tasksToSort) => {
    const sortedTasks = [...tasksToSort];
    switch (sortBy) {
      case 'dueDate':
        return sortedTasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
      case 'title':
        return sortedTasks.sort((a, b) => a.title.localeCompare(b.title));
      default:
        return sortedTasks;
    }
  };

  // Rút gọn hàm filterTasks
  const filterTasks = (tasks) => {
    const filteredTasks = tasks.filter(task => 
      task.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return sortTasks(filteredTasks);
  };

  // Rút gọn các biến tasks đã lọc
  const activeTasks = filterTasks(tasks.filter(task => task.completed === 0));
  const completedTasks = filterTasks(tasks.filter(task => task.completed === 1));

  // Rút gọn các hàm xử lý
  const handleEdit = (task) => {
    setEditingTask(task);
    setDrawerVisible(true);
  };

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

  // Rút gọn các hàm modal
  const showModal = () => setModalVisible(true);

  const handleCancel = () => {
    setModalVisible(false);
    setNewTaskTitle('');
    setNewTaskDescription('');
    setNewTaskDueDate('');
  };

  const handleOk = () => {
    addTask();
    setModalVisible(false);
  };

  // Rút gọn menu items
  const sortItems = [
    { key: 'default', label: 'Mặc định' },
    { key: 'dueDate', label: 'Theo ngày hết hạn' },
    { key: 'title', label: 'Theo tên nhiệm vụ' }
  ];

  return (
    <>
      <div className="navbar">
        <div className="navbar-brand">To Do</div>
        <div className="search-bar">
          <Input 
            placeholder="Search tasks..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <div className="todo-list">
        <div className="todo-header" style={{ display: 'flex', gap: '10px', alignItems: 'center', justifyContent: 'space-between' }}>
          <Button type="primary" onClick={showModal}>
            Thêm công việc
          </Button>
          <Dropdown
            menu={{
              items: sortItems,
              onClick: ({ key }) => setSortBy(key),
            }}
          >
            <Button>
              <Space>
                Sắp xếp
                <DownOutlined />
              </Space>
            </Button>
          </Dropdown>
        </div>
        <Modal
          title="Thêm công việc mới"
          open={modalVisible}
          onOk={handleOk}
          onCancel={handleCancel}
          okText="Add"
          cancelText="Cancel"
          okButtonProps={{ disabled: !newTaskTitle || !newTaskDueDate }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Input
              placeholder="Task title"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
            />
            <Input.TextArea
              placeholder="Task description"
              value={newTaskDescription}
              onChange={(e) => setNewTaskDescription(e.target.value)}
              rows={4}
            />
            <input 
              type="date" 
              style={{ width: '100%', padding: '4px 11px', borderRadius: '6px', border: '1px solid #d9d9d9' }}
              value={newTaskDueDate}
              onChange={(e) => setNewTaskDueDate(e.target.value)}
            />
          </div>
        </Modal>
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
              <Input
                value={editingTask.title}
                onChange={(e) => setEditingTask({...editingTask, title: e.target.value})}
                placeholder="Task title"
              />
              <Input.TextArea
                value={editingTask.description}
                onChange={(e) => setEditingTask({...editingTask, description: e.target.value})}
                placeholder="Task description"
                rows={4}
              />
              <input
                type="date"
                style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #d9d9d9' }}
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
                <Button type="primary">Update</Button>
              </Popconfirm>
            </div>
          )}
        </Drawer>
      </div>
    </>
  );
};

export default ToDoList; 
