import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Menu, 
  Bell,
  ChevronDown,
  User as UserIcon,
  Settings,
  LogOut,
  MessageSquare,
  Calendar as CalendarIcon
} from 'lucide-react';
import { useAuth } from '../../../admin/context/AuthContext';
import { fullName, getInitials } from '../../../core';
import { getNotifications, getUnreadCount, markAllAsRead } from '../../../admin/api/notifications';
import styles from './FormateurHeader.module.css';

export default function FormateurHeader({ toggleSidebar }) {
  const { user, logout } = useAuth();
  const [showProfile, setShowProfile] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [loadingNotifs, setLoadingNotifs] = useState(false);
  
  const profileRef = useRef(null);
  const notifRef = useRef(null);

  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000); // Poll every 30s
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) setShowProfile(false);
      if (notifRef.current && !notifRef.current.contains(event.target)) setShowNotifs(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchUnreadCount = async () => {
    try {
      const data = await getUnreadCount();
      setUnreadCount(data?.count || 0);
    } catch (e) {
      console.error("Failed to fetch unread count", e);
    }
  };

  const fetchNotifications = async () => {
    try {
      setLoadingNotifs(true);
      const data = await getNotifications({ per_page: 5 });
      setNotifications(data?.data?.data || data?.data || []);
    } catch (e) {
      console.error("Failed to fetch notifications", e);
    } finally {
      setLoadingNotifs(false);
    }
  };

  const handleToggleNotifs = () => {
    if (!showNotifs) {
      fetchNotifications();
    }
    setShowNotifs(!showNotifs);
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllAsRead();
      setUnreadCount(0);
      setNotifications(notifications.map(n => ({ ...n, read: true })));
    } catch (e) {
      console.error("Failed to mark all as read", e);
    }
  };

  const userFullName = fullName(user) !== '—' ? fullName(user) : 'Formateur';
  const navigate = useNavigate();

  return (
    <header className={styles.header}>
      <div className={styles.leftSide}>
        <button className={styles.menuBtn} onClick={toggleSidebar}>
          <Menu size={24} />
        </button>
      </div>

      <div className={styles.rightSide}>
        <div className={styles.iconBtnWrapper} ref={notifRef}>
          <button className={`${styles.iconBtn} ${showNotifs ? styles.activeBtn : ''}`} onClick={handleToggleNotifs}>
            <Bell size={20} />
            {unreadCount > 0 && <span className={styles.badge}>{unreadCount}</span>}
          </button>

          {showNotifs && (
            <div className={styles.notificationDropdown}>
              <div className={styles.dropdownHeader}>
                <h3>Notifications</h3>
                {unreadCount > 0 && (
                  <button onClick={handleMarkAllRead}>Marquer tout comme lu</button>
                )}
              </div>
              <div className={styles.dropdownList}>
                {loadingNotifs ? (
                  <div className={styles.emptyState}>Chargement...</div>
                ) : notifications.length > 0 ? (
                  notifications.map(n => (
                    <div key={n.id} className={`${styles.notifItem} ${!n.read_at ? styles.unread : ''}`}>
                      <div className={styles.notifIcon}>
                        {n.type?.includes('message') ? <MessageSquare size={16} /> : <CalendarIcon size={16} />}
                      </div>
                      <div className={styles.notifContent}>
                        <p className={styles.notifTitle}>{n.data?.title || 'Notification'}</p>
                        <p className={styles.notifText}>{n.data?.message || n.data?.body || ''}</p>
                        <span className={styles.notifTime}>{new Date(n.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className={styles.emptyState}>Aucune notification</div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className={styles.userMenu} ref={profileRef} onClick={() => setShowProfile(!showProfile)}>
          <div className={styles.userAvatar}>
            {getInitials(userFullName)}
          </div>
          <span className={styles.userName}>{userFullName}</span>
          <ChevronDown size={14} className={`text-slate-400 transition-transform ${showProfile ? 'rotate-180' : ''}`} />
          
          {showProfile && (
            <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-xl py-2 z-[100]">
              <button className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 w-full text-left">
                <UserIcon size={16} /> Mon profil
              </button>
              <button className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 w-full text-left">
                <Settings size={16} /> Paramètres
              </button>
              <div className="border-t border-slate-100 my-2" />
              <button 
                className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                onClick={logout}
              >
                <LogOut size={16} /> Déconnexion
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

