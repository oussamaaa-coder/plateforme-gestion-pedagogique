import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, LogOut, Menu, User as UserIcon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getUnreadCount } from '../../api/notifications';
import { fullName, getInitials } from '../../../core';

/**
 * AdminHeader Component
 * Restored to original layout with fixed initials logic.
 */
export default function AdminHeader({ toggleSidebar }) {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchUnreadCount = useCallback(async () => {
    try {
      const resp = await getUnreadCount();
      setUnreadCount(resp?.data?.count || 0);
    } catch (err) {
      console.error("Failed to fetch unread count", err);
    }
  }, []);

  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 300000); 
    return () => clearInterval(interval);
  }, [fetchUnreadCount]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/admin/login', { replace: true });
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  const name = fullName(user) || "Admin";
  const initials = getInitials(name);

  return (
    <>
      <button 
        className="burger-menu-btn" 
        onClick={toggleSidebar}
        id="mobile-burger-btn"
      >
        <Menu size={20} />
      </button>

      <div style={{ flex: 1 }}></div>

      <div className="navbar-right">
        {/* Notifications */}
        <button 
          className="notification-btn" 
          onClick={() => navigate('/admin/notifications')}
        >
          <Bell size={20} />
          {unreadCount > 0 && (
            <span className="badge-danger notification-badge">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>

        {/* User Profile */}
        <div 
          className="user-profile-trigger"
          onClick={() => navigate('/admin/settings')}
        >
          <div className="avatar-circle">
            {initials && initials !== '-' ? initials : <UserIcon size={18} />}
          </div>
          <div className="user-details">
            <span className="user-name">{name}</span>
            <span className="user-role">{user?.role || 'Administrateur'}</span>
          </div>
        </div>

        {/* Logout */}
        <button className="btn-logout" onClick={handleLogout}>
          <LogOut size={16} />
          <span>Déconnexion</span>
        </button>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .burger-menu-btn {
          display: none;
          background: none;
          border: none;
          padding: 8px;
          color: var(--admin-text-main);
          cursor: pointer;
        }

        @media (max-width: 1023px) {
          .burger-menu-btn { display: flex !important; }
        }

        .navbar-right {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .notification-btn {
          position: relative;
          width: 38px;
          height: 38px;
          padding: 0;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: none;
          border: none;
          color: var(--admin-text-main);
          cursor: pointer;
        }

        .notification-btn:hover {
            background: rgba(0,0,0,0.04);
        }

        .notification-badge {
          position: absolute;
          top: 2px;
          right: 2px;
          min-width: 18px;
          height: 18px;
          background: var(--admin-danger);
          color: white;
          border-radius: 50%;
          font-size: 10px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid white;
        }

        .user-profile-trigger {
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
          padding: 4px 8px;
          border-radius: 8px;
          transition: background 0.2s;
        }

        .user-profile-trigger:hover {
          background: rgba(0,0,0,0.04);
        }

        .avatar-circle {
          width: 38px;
          height: 38px;
          background: var(--admin-accent);
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 14px;
        }

        .user-details {
          display: flex;
          flex-direction: column;
          line-height: 1.2;
        }

        .user-name {
          font-weight: 600;
          font-size: 14px;
          color: var(--admin-text-main);
        }

        .user-role {
          font-size: 11px;
          color: var(--admin-text-muted);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .btn-logout {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          border-radius: 8px;
          background: #fef2f2;
          border: 1px solid #fee2e2;
          color: #dc2626;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-logout:hover {
          background: #fee2e2;
        }

        @media (max-width: 768px) {
          .user-details, .btn-logout span { display: none; }
          .navbar-right { gap: 10px; }
        }
      `}} />
    </>
  );
}
