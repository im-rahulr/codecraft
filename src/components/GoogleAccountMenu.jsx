import React, { useState, useRef, useEffect } from 'react';
import './GoogleAccountMenu.css';

// Simple Google-like account menu for React apps
const GoogleAccountMenu = ({ user, onManage, onSignOut }) => {
  const [open, setOpen] = useState(false);
  const btnRef = useRef(null);
  const menuRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    const onDocClick = (e) => {
      if (open && menuRef.current && !menuRef.current.contains(e.target) && btnRef.current && !btnRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [open]);

  return (
    <div className="ga-account" aria-label="Account menu" role="group">
      <button ref={btnRef} className="ga-avatar" aria-expanded={open} aria-haspopup="true" onClick={() => setOpen((s) => !s)}>
        {user?.initials ?? 'ME'}
      </button>
      <div ref={menuRef} className={`ga-dropdown ${open ? 'open' : ''}`} role="menu" aria-label="Account menu">
        <div className="ga-user" role="none">
          <div className="ga-thumb" aria-label="avatar">{user?.initials ?? 'ME'}</div>
          <div>
            <div className="ga-name">{user?.name ?? 'User'}</div>
            <div className="ga-email">{user?.email ?? ''}</div>
          </div>
        </div>
        <div className="ga-item" role="menuitem" tabIndex={0} onClick={onManage ?? (()=>{})}>
          <span>Manage your Google Account</span>
        </div>
        <div className="ga-item" role="menuitem" tabIndex={0} onClick={onSignOut ?? (()=>{})}>
          <span>Sign out</span>
        </div>
      </div>
    </div>
  );
};

export default GoogleAccountMenu;
