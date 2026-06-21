import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Calendar, Briefcase, User, Settings, LogOut, MessageSquare, Bell, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import './Sidebar.css';

const Sidebar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Directory', path: '/directory', icon: <Users size={20} /> },
    { name: 'Notifications', path: '/notifications', icon: <Bell size={20} /> },
    { name: 'Events', path: '/events', icon: <Calendar size={20} /> },
    { name: 'Jobs', path: '/jobs', icon: <Briefcase size={20} /> },
    { name: 'Profile', path: '/profile', icon: <User size={20} /> },
  ];

  if (user.role === 'admin') {
    navItems.push({ name: 'Admin Panel', path: '/admin', icon: <ShieldCheck size={20} /> });
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-icon">A</div>
        <h2>Alumni Portal</h2>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
          >
            {item.icon}
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <NavLink
          to="/settings"
          className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
        >
          <Settings size={20} />
          <span>Settings</span>
        </NavLink>
        <button className="nav-item logout-btn" onClick={handleLogout}>
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
