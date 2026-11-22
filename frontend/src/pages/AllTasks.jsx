import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pencil, Trash2, Plus, ListTodo } from 'lucide-react';
import { toast } from 'react-toastify';

import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Loader from '../components/Loader';
import { getAllTasks, deleteTask } from '../services/taskService';

import './AllTasks.css';

const AllTasks = () => {
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const fetchTasks = async () => {
    try {
      setLoading(true);

      const response = await getAllTasks();

      const taskList =
        response?.data?.tasks ||
        response?.tasks ||
        response?.data ||
        [];

      setTasks(Array.isArray(taskList) ? taskList : []);

    } catch (err) {
      toast.error(
        err.response?.data?.message || 'Tasks load nahi ho paaye.',
        {
          position: 'top-right',
          autoClose: 3000,
        }
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const confirmDelete = async (id) => {
    if (deletingId) return;

    try {
      setDeletingId(id);

      await deleteTask(id);

      setTasks((previousTasks) =>
        previousTasks.filter(
          (task) => task._id !== id && task.id !== id
        )
      );

      toast.success('Task deleted successfully!', {
        position: 'top-right',
        autoClose: 3000,
      });

    } catch (err) {
      toast.error(
        err.response?.data?.message ||
        'Task delete nahi ho paaya.',
        {
          position: 'top-right',
          autoClose: 4000,
        }
      );
    } finally {
      setDeletingId(null);
    }
  };

  const handleDelete = (id) => {
    if (deletingId) return;

    toast.info(
      ({ closeToast }) => (
        <div className="delete-confirm-toast">

          <div className="delete-confirm-content">
            <strong>Delete Task?</strong>

            <p>
              Are you sure you want to delete this task ?
            </p>
          </div>

          <div className="delete-confirm-actions">

            <button
              type="button"
              className="delete-confirm-yes"
              onClick={() => {
                closeToast();
                confirmDelete(id);
              }}
            >
              Yes, Delete
            </button>

            <button
              type="button"
              className="delete-confirm-no"
              onClick={closeToast}
            >
              Cancel
            </button>

          </div>

        </div>
      ),
      {
        position: 'top-right',
        autoClose: false,
        closeOnClick: false,
        closeButton: true,
        draggable: false,
        pauseOnHover: true,
        theme: 'colored',
      }
    );
  };

  const getStatusClass = (status) => {
    return (status || 'Pending')
      .toLowerCase()
      .replace(/\s+/g, '-');
  };

  const getPriorityClass = (priority) => {
    return (priority || 'Medium').toLowerCase();
  };

  return (
    <div className="all-tasks-page">

      <Navbar />

      <div className="all-tasks-layout">

        <Sidebar />

        <main className="all-tasks-main">

          <div className="all-tasks-content">

            <div className="all-tasks-header">

              <div>
                <h1>All Tasks</h1>

                <p>
                  Manage and track all your tasks in one place.
                </p>
              </div>

              <button
                className="all-tasks-add-btn"
                onClick={() => navigate('/add-task')}
              >
                <Plus size={18} />
                Add New Task
              </button>

            </div>

    
            <div className="all-tasks-summary">

              <div className="all-tasks-summary-icon">
                <ListTodo size={24} />
              </div>

              <div>
                <span>Total Tasks</span>
                <h2>{tasks.length}</h2>
              </div>

            </div>

            {loading ? (

              <Loader />

            ) : tasks.length === 0 ? (

              <div className="all-tasks-empty">

                <ListTodo size={42} />

                <h3>No tasks found</h3>

                <p>
                  Abhi aapne koi task add nahi kiya hai.
                </p>

                <button
                  onClick={() => navigate('/add-task')}
                >
                  Create Your First Task
                </button>

              </div>

            ) : (

              <div className="all-tasks-table-wrapper">

                <table className="all-tasks-table">

                  <thead>
                    <tr>
                      <th>Task</th>
                      <th>Priority</th>
                      <th>Status</th>
                      <th>Due Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>

                  <tbody>

                    {tasks.map((task) => {

                      const taskId = task._id || task.id;

                      return (
                        <tr key={taskId}>

                          <td>
                            <div className="all-task-title">

                              <strong>{task.title}</strong>

                              <span>
                                {task.description || 'No description'}
                              </span>

                            </div>
                          </td>

                          <td>
                            <span
                              className={`task-priority ${getPriorityClass(task.priority)}`}
                            >
                              {task.priority || 'Medium'}
                            </span>
                          </td>

                          <td>
                            <span
                              className={`task-status ${getStatusClass(task.status)}`}
                            >
                              {task.status || 'Pending'}
                            </span>
                          </td>

                          <td>
                            {task.dueDate
                              ? new Date(task.dueDate).toLocaleDateString()
                              : 'No due date'}
                          </td>

                          <td>

                            <div className="all-task-actions">

                              <button
                                className="all-task-edit-btn"
                                title="Edit task"
                                onClick={() =>
                                  navigate(`/edit-task/${taskId}`)
                                }
                              >
                                <Pencil size={17} />
                              </button>

                               
                              <button
                                className="all-task-delete-btn"
                                title="Delete task"
                                disabled={deletingId === taskId || deletingId !== null}
                                onClick={() => handleDelete(taskId)}
                              >
                                <Trash2 size={17} />
                              </button>

                            </div>

                          </td>

                        </tr>
                      );

                    })}

                  </tbody>

                </table>

              </div>

            )}

          </div>

        </main>

      </div>

    </div>
  );
};

export default AllTasks;
