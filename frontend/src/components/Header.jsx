import React, { useEffect, useState } from 'react';
import { Search, Sun, Moon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import './Header.css';

const Header = () => {
  const navigate = useNavigate();
  const [greeting, setGreeting] = useState('');
  const [searchVal, setSearchVal] = useState('');

  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');

    // Handle theme initialization
    if (theme === 'dark') {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [theme]);



  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchVal.trim() !== '') {
      navigate(`/directory?search=${encodeURIComponent(searchVal)}`);
      setSearchVal('');
    }
  };

  const toggleTheme = (e) => {
    if (e) e.preventDefault();
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    localStorage.setItem('theme', nextTheme);
    
    if (nextTheme === 'dark') {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  };

  return (
    <header className="header">
      <form className="header-search" onSubmit={handleSearchSubmit}>
        <Search className="search-icon" size={20} onClick={handleSearchSubmit} style={{ cursor: 'pointer' }} />
        <input 
          type="text" 
          placeholder="Search by name, company, graduation..." 
          value={searchVal}
          onChange={(e) => setSearchVal(e.target.value)}
        />
      </form>

      <div className="header-right">
        <button type="button" className="theme-toggle-btn" onClick={toggleTheme} aria-label="Toggle theme">
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>



        <div className="header-user-badge" onClick={() => navigate('/profile')} title="View Profile">
          {user.profileImage ? (
            <img src={user.profileImage} alt="User profile" className="header-avatar" />
          ) : (
            <div className="header-avatar placeholder">{user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}</div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
