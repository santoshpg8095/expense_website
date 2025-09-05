import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        <NavLink 
          to="/dashboard" 
          className={({ isActive }) => isActive ? 'sidebar-link active' : 'sidebar-link'}
        >
          Dashboard
        </NavLink>
        <NavLink 
          to="/expenses" 
          className={({ isActive }) => isActive ? 'sidebar-link active' : 'sidebar-link'}
        >
          Expenses
        </NavLink>
        <NavLink 
          to="/reports" 
          className={({ isActive }) => isActive ? 'sidebar-link active' : 'sidebar-link'}
        >
          Reports
        </NavLink>
        <NavLink 
          to="/categories" 
          className={({ isActive }) => isActive ? 'sidebar-link active' : 'sidebar-link'}
        >
          Categories
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;