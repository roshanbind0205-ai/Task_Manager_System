
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import TaskForm from '../components/TaskForm';
import { createTask } from '../services/taskService';
import './AddTask.css';

const AddTask = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const handleAddTask = async (formData) => {
    try {
      setLoading(true);
      setError('');
      await createTask(formData);
      navigate('/tasks');
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Task add nahi ho paya. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-task-layout">

      <Sidebar />
      <main className="add-task-main">
        <Navbar />
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
            {error && (
              <div className="add-task-error">
                {error}
              </div>
            )}
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
