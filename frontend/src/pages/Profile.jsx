
import React, { useEffect, useState } from 'react';
import { User, Lock, Save } from 'lucide-react';

import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Loader from '../components/Loader';
import useAuth from '../hooks/useAuth';
import api from '../services/api';

import './Profile.css';

const Profile = () => {
  const { user } = useAuth();

  const [profile, setProfile] = useState({
    name: '',
    email: '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/users/profile');
        const userData = response.data.user;

        setProfile({
          name: userData.name || '',
          email: userData.email || '',
        });
      } catch (err) {
        setError(
          err.response?.data?.message ||
          'Unable to load profile'
        );

        setProfile({
          name: user?.name || '',
          email: user?.email || '',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const handleProfileChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError('');
      setMessage('');

      const response = await api.put(
        '/users/profile',
        profile
      );

      setProfile({
        name: response.data.user.name,
        email: response.data.user.email,
      });

      setMessage('Profile updated successfully!');
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Profile update failed'
      );
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    try {
      setChangingPassword(true);
      setError('');
      setMessage('');

      const response = await api.put(
        '/users/change-password',
        passwordData
      );

      setMessage(
        response.data.message ||
        'Password changed successfully!'
      );

      setPasswordData({
        currentPassword: '',
        newPassword: '',
      });
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Password change failed'
      );
    } finally {
      setChangingPassword(false);
    }
  };

  if (loading) {
    return <Loader message="Loading profile..." />;
  }

  return (
    <div className="profile-layout">
      <Sidebar />
      <main className="profile-main">

        <Navbar />

        <div className="profile-content">

          <div className="profile-header">
            <h1>My Profile</h1>
            <p>
              Manage your personal information and password.
            </p>
          </div>

          {message && (
            <div className="profile-success">
              {message}
            </div>
          )}

          {error && (
            <div className="profile-error">
              {error}
            </div>
          )}

          <div className="profile-card">

            <div className="profile-card-heading">
              <User size={22} />
              <h2>Personal Information</h2>
            </div>

            <form onSubmit={handleUpdateProfile}>

              <div className="profile-form-group">
                <label htmlFor="profile-name">
                  Full Name
                </label>

                <input
                  id="profile-name"
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  value={profile.name}
                  onChange={handleProfileChange}
                  minLength="3"
                  required
                />
              </div>

              <div className="profile-form-group">
                <label htmlFor="profile-email">
                  Email Address
                </label>

                <input
                  id="profile-email"
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={profile.email}
                  onChange={handleProfileChange}
                  required
                />
              </div>

              <button type="submit" disabled={saving}>
                <Save size={17} />
                {saving ? 'Saving...' : 'Update Profile'}
              </button>

            </form>
          </div>

          <div className="profile-card">

            <div className="profile-card-heading">
              <Lock size={22} />
              <h2>Change Password</h2>
            </div>

            <form onSubmit={handleChangePassword}>

              <div className="profile-form-group">
                <label htmlFor="current-password">
                  Current Password
                </label>

                <input
                  id="current-password"
                  type="password"
                  name="currentPassword"
                  placeholder="Enter current password"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  required
                />
              </div>

              <div className="profile-form-group">
                <label htmlFor="new-password">
                  New Password
                </label>

                <input
                  id="new-password"
                  type="password"
                  name="newPassword"
                  placeholder="Enter new password"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  minLength="6"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={changingPassword}
              >
                <Lock size={17} />
                {changingPassword
                  ? 'Changing...'
                  : 'Change Password'}
              </button>

            </form>
          </div>

        </div>
      </main>
    </div>
  );
};

export default Profile;
