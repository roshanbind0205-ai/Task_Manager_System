import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, LogOut, UserCircle, CheckSquare } from 'lucide-react';
import useAuth from '../hooks/useAuth';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/dashboard" className="navbar-logo">
        <CheckSquare size={27} />
        <span>TaskManager</span>
      </Link>

      <div className="navbar-right">
        <Link to="/dashboard" className="navbar-link">
          <LayoutDashboard size={19} />
          <span>Dashboard</span>
        </Link>

        <Link to="/profile" className="navbar-user">
          <UserCircle size={21} />
          <span>{user?.name || 'My Profile'}</span>
        </Link>

        <button
          className="navbar-logout"
          onClick={handleLogout}
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
