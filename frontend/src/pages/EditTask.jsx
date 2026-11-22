
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import TaskForm from '../components/TaskForm';
import Loader from '../components/Loader';
import { getTaskById, updateTask } from '../services/taskService';
import './EditTask.css';

const EditTask = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTask = async () => {
      try {
        setLoading(true);
        setError('');

        const response = await getTaskById(id);

        const taskData =
          response?.data?.task ||
          response?.task ||
          response?.data;

        if (!taskData?._id) {
          throw new Error('Task not found');
        }

        setTask(taskData);
      } catch (err) {
        setError(
          err.response?.data?.message ||
          err.message ||
          'Unable to load task'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [id]);

  const handleUpdateTask = async (formData) => {
    try {
      setSaving(true);
      setError('');

      await updateTask(id, formData);

      navigate('/tasks');
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Task update failed'
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Loader message="Loading task..." />;
  }

  return (
    <div className="edit-task-layout">
      <Sidebar />

      <main className="edit-task-main">
        <Navbar />

        <div className="edit-task-content">
          <div className="edit-task-header">
            <h1>Edit Task</h1>
            <p>Update your task details below.</p>
          </div>

          {error && (
            <div className="edit-task-error">
              {error}
            </div>
          )}

          {!task && (
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => navigate('/tasks')}
            >
              Back to All Tasks
            </button>
          )}

          {task && (
            <div className="edit-task-form-card">
              <TaskForm
                initialData={task}
                onSubmit={handleUpdateTask}
                buttonText="Update Task"
                loading={saving}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default EditTask;
