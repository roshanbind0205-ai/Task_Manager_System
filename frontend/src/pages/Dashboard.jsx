
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ListTodo, Clock, CheckCircle, PlusCircle } from 'lucide-react';

import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Loader from '../components/Loader';
import { getAllTasks } from '../services/taskService';

import './Dashboard.css';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await getAllTasks();

        const taskData =
          response?.data?.tasks ||
          response?.tasks ||
          response?.data ||
          [];

        setTasks(Array.isArray(taskData) ? taskData : []);
      } catch (err) {
        setError(
          err.response?.data?.message ||
          'Tasks load nahi ho sake.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const completedTasks = tasks.filter(
    task => task.status === 'Completed'
  ).length;

  const pendingTasks = tasks.filter(
    task => task.status === 'Pending'
  ).length;

  const inProgressTasks = tasks.filter(
    task => task.status === 'In Progress'
  ).length;

  
return (
  <div className="dashboard-layout">

    <div className="dashboard-main">

      <Navbar />

      <Sidebar />

      <main className="dashboard-content">

        <div className="dashboard-inner">

          <div className="dashboard-header">
            <div>
              <h1>Dashboard</h1>
              <p>Welcome back! Here's your task overview.</p>
            </div>

            <Link to="/add-task" className="dashboard-add-button">
              <PlusCircle size={18} />
              Add New Task
            </Link>
          </div>

          {loading ? (
            <Loader message="Loading dashboard..." />
          ) : (
            <>
              {error && (
                <div className="dashboard-error">{error}</div>
              )}

              <div className="dashboard-stats">

                <div className="dashboard-stat-card">
                  <div className="dashboard-stat-icon total-icon">
                    <ListTodo />
                  </div>
                  <div>
                    <p>Total Tasks</p>
                    <h2>{tasks.length}</h2>
                  </div>
                </div>

                <div className="dashboard-stat-card">
                  <div className="dashboard-stat-icon pending-icon">
                    <Clock />
                  </div>
                  <div>
                    <p>Pending Tasks</p>
                    <h2>{pendingTasks}</h2>
                  </div>
                </div>

                <div className="dashboard-stat-card">
                  <div className="dashboard-stat-icon progress-icon">
                    <Clock />
                  </div>
                  <div>
                    <p>In Progress</p>
                    <h2>{inProgressTasks}</h2>
                  </div>
                </div>

                <div className="dashboard-stat-card">
                  <div className="dashboard-stat-icon completed-icon">
                    <CheckCircle />
                  </div>
                  <div>
                    <p>Completed Tasks</p>
                    <h2>{completedTasks}</h2>
                  </div>
                </div>

              </div>

              <section className="dashboard-tasks-section">

                <div className="dashboard-section-heading">
                  <h2>Recent Tasks</h2>
                  <Link to="/tasks">View All</Link>
                </div>

                {tasks.length === 0 ? (
                  <div className="dashboard-empty">
                    <ListTodo size={42} />
                    <h3>No tasks yet</h3>
                    <p>Create your first task to get started.</p>
                    <Link to="/add-task">Create Task</Link>
                  </div>
                ) : (
                  <div className="dashboard-recent-list">

                    {tasks.slice(0, 5).map(task => (
                      <div
                        className="dashboard-task-row"
                        key={task._id || task.id}
                      >
                        <div className="dashboard-task-info">
                          <h3>{task.title}</h3>
                          <p>
                            {task.description || 'No description'}
                          </p>
                        </div>

                        <span
                          className={`dashboard-status status-${task.status?.toLowerCase().replace(/\s+/g, '-')}`}
                        >
                          {task.status}
                        </span>
                      </div>
                    ))}

                  </div>
                )}

              </section>
            </>
          )}

        </div>
      </main>

    </div>
  </div>
);

};

export default Dashboard;
