import React from 'react';
import './ToDoItem.css';

const getDueDateClass = (dueDate) => {
  const today = new Date();
  const targetDate = new Date(dueDate);
  const diffTime = targetDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 *24));

  if (diffDays < 0) {
    return {className: 'expired', text: 'Expired'};
  }
  else if (diffDays >= 0 && diffDays <= 1) {
    return {className: 'due-soon', text: 'Today'};
  }
  else if (diffDays > 1 && diffDays <= 7) {
    return {className: 'due-upcoming', text: `${diffDays} days left`};
  }
  else {
    return 'due-later';
  }
}

const ToDoItem = ({task, onToggle, onDelete}) => {
  const {className: dueDateClass, text: dueDateText} = getDueDateClass(task.dueDate);

  return (
    <div className='ToDoItem'>
      <input type='checkbox' checked={task.completed} onChange={() => onToggle(task.id)}/>
      <div className={`content ${task.completed ? 'completed' : ''}`}>
        <p className='title'>{task.title}</p>
        <p className={`due-date ${dueDateClass}`}>{dueDateText ? dueDateText : new Date(task.dueDate).toLocaleDateString()}</p>
      </div>
      <button className='delete-btn' onClick={() => onDelete(task.id)}>Delete</button>
    </div>
  )
}

export default ToDoItem;