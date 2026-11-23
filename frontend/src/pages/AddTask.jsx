
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import TaskForm from '../components/TaskForm';
import { createTask } from '../services/taskService';

import './AddTask.css';

const AddTask = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const handleAddTask = async (formData) => {
    if (loading) return;

    try {
      setLoading(true);

      await createTask(formData);

      toast.success('Task added successfully!', {
        position: 'top-right',
        autoClose: 3000,
      });

      navigate('/tasks');

    } catch (err) {
      toast.error(
        err.response?.data?.message ||
        'Task added Unsuccessfully! Please try again.',
        {
          position: 'top-right',
          autoClose: 4000,
        }
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-task-layout">

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="add-task-main">

        {/* Navbar */}
        <div className="add-task-navbar">
          <Navbar />
        </div>

        {/* Scrollable Content */}
        <div className="add-task-scroll-area">

          <div className="add-task-content">

            <div className="add-task-header">
              <div>
                <h1>Add New Task</h1>
                <p>
                  Create a new task and manage your work efficiently.
                </p>
              </div>
            </div>

            <div className="add-task-form-card">

              <TaskForm
                onSubmit={handleAddTask}
                buttonText="Create Task"
                loading={loading}
              />

            </div>

          </div>

        </div>

      </main>

    </div>
  );
};

export default AddTask;
