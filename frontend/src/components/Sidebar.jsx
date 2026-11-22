import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  ListTodo,
  PlusCircle,
  UserCircle,
} from 'lucide-react';
import './Sidebar.css';

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-heading">
        <h3>Menu</h3>
      </div>

      <nav className="sidebar-nav">
        <NavLink to="/dashboard" className="sidebar-link">
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </NavLink>

        <NavLink to="/tasks" className="sidebar-link">
          <ListTodo size={20} />
          <span>All Tasks</span>
        </NavLink>

        <NavLink to="/add-task" className="sidebar-link">
          <PlusCircle size={20} />
          <span>Add Task</span>
        </NavLink>

        <NavLink to="/profile" className="sidebar-link">
          <UserCircle size={20} />
          <span>My Profile</span>
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;
