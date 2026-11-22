import React from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays, Pencil, Trash2 } from 'lucide-react';
import './TaskCard.css';

const TaskCard = ({ task, onDelete }) => {
  const formattedDate = task.dueDate
    ? new Date(task.dueDate).toLocaleDateString('en-IN')
    : 'No due date';

  return (
    <div className="task-card">
      <div className="task-card-header">
        <h3>{task.title}</h3>

        <span className={`task-status ${task.status?.toLowerCase().replace(' ', '-')}`}>
          {task.status}
        </span>
      </div>

      <p className="task-description">
        {task.description || 'No description available'}
      </p>

      <div className="task-card-details">
        <span className={`task-priority ${task.priority?.toLowerCase()}`}>
          {task.priority} Priority
        </span>

        <span className="task-due-date">
          <CalendarDays size={16} />
          {formattedDate}
        </span>
      </div>

      <div className="task-card-actions">
        <Link to={`/edit-task/${task._id}`} className="task-edit-btn">
          <Pencil size={16} />
          Edit
        </Link>

        <button
          className="task-delete-btn"
          onClick={() => onDelete(task._id)}
        >
          <Trash2 size={16} />
          Delete
        </button>
      </div>
    </div>
  );
};

export default TaskCard;
