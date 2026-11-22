import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

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

  useEffect(() => {
    const fetchTask = async () => {
      try {
        setLoading(true);

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
        toast.error(
          err.response?.data?.message ||
          err.message ||
          'Unable to load task',
          {
            position: 'top-right',
            autoClose: 4000,
          }
        );

        setTask(null);

      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [id]);

  const handleUpdateTask = async (formData) => {
    if (saving) return;

    try {
      setSaving(true);

      await updateTask(id, formData);

      toast.success('Task updated successfully!', {
        position: 'top-right',
        autoClose: 3000,
      });

      navigate('/tasks');

    } catch (err) {
      toast.error(
        err.response?.data?.message ||
        'Task update failed. Please try again.',
        {
          position: 'top-right',
          autoClose: 4000,
        }
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
