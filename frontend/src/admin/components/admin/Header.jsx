import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getNotifications, getUnreadCount, markAsRead, markAllAsRead } from '../../api/notifications';

// --- Header SVG Icons (Inlined) ---
const iconStyle = (size) => ({ width: `${size}px`, height: `${size}px`, minWidth: `${size}px`, minHeight: `${size}px` });

const Bell = ({ size = 24 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={iconStyle(size)}><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></svg>
);
const LogOut = ({ size = 24, className = "" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={iconStyle(size)}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
);
const MenuIcon = ({ size = 24 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={iconStyle(size)}><line x1="4" y1="12" x2="20" y2="12" /><line x1="4" y1="6" x2="20" y2="6" /><line x1="4" y1="18" x2="20" y2="18" /></svg>
);
const CheckAll = ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={iconStyle(size)}><path d="M18 6 7 17l-5-5"/><path d="m22 10-9.5 9.5L10 17"/></svg>
);

// Notification type icons
const InfoIcon = ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={iconStyle(size)}><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
);
const WarningIcon = ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={iconStyle(size)}><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
);
const SuccessIcon = ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={iconStyle(size)}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
);
const AbsenceIcon = ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={iconStyle(size)}><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
);
const NoteIcon = ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={iconStyle(size)}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
);
const SystemIcon = ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={iconStyle(size)}><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.1a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
);
const EmptyBellIcon = ({ size = 48 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ ...iconStyle(size), opacity: 0.35 }}><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
);
const TrashIcon = ({ size = 16, className = "" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={iconStyle(size)}><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
);

const NOTIF_TYPE_CONFIG = {
    info:    { icon: InfoIcon,    bg: '#eff6ff', color: '#3b82f6', border: '#bfdbfe' },
    warning: { icon: WarningIcon, bg: '#fffbeb', color: '#f59e0b', border: '#fde68a' },
    success: { icon: SuccessIcon, bg: '#f0fdf4', color: '#22c55e', border: '#bbf7d0' },
    absence: { icon: AbsenceIcon, bg: '#fef2f2', color: '#ef4444', border: '#fecaca' },
    note:    { icon: NoteIcon,    bg: '#f5f3ff', color: '#8b5cf6', border: '#ddd6fe' },
    system:  { icon: SystemIcon,  bg: '#f8fafc', color: '#64748b', border: '#e2e8f0' },
};

function timeAgo(dateStr) {
    const now = new Date();
    const date = new Date(dateStr);
    const diff = Math.floor((now - date) / 1000);
    if (diff < 60) return "À l'instant";
    if (diff < 3600) return `Il y a ${Math.floor(diff / 60)} min`;
    if (diff < 86400) return `Il y a ${Math.floor(diff / 3600)}h`;
    if (diff < 604800) return `Il y a ${Math.floor(diff / 86400)}j`;
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
}

const Header = () => {
    const { logout, user } = useAuth();
    const navigate = useNavigate();

    // Notification state
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loadingNotifs, setLoadingNotifs] = useState(false);
    const [dismissedIds, setDismissedIds] = useState(new Set());
    const dropdownRef = useRef(null);

    // Fetch unread count on mount + poll
    const fetchUnreadCount = useCallback(async () => {
        try {
            const resp = await getUnreadCount();
            setUnreadCount(resp?.data?.count || 0);
        } catch { /* silently fail */ }
    }, []);

    useEffect(() => {
        fetchUnreadCount();
        const interval = setInterval(fetchUnreadCount, 300000); // Poll every 5 minutes
        return () => clearInterval(interval);
    }, [fetchUnreadCount]);

    // Close dropdown on outside click
    useEffect(() => {
        const handler = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    // Fetch notifications when dropdown opens
    const toggleDropdown = async () => {
        const willOpen = !dropdownOpen;
        setDropdownOpen(willOpen);
        if (willOpen) {
            setLoadingNotifs(true);
            try {
                const resp = await getNotifications({ per_page: 15 });
                const fetched = resp?.data?.data || [];
                setNotifications(fetched.filter(n => !dismissedIds.has(n.id)));
            } catch { /* silently fail */ }
            setLoadingNotifs(false);
        }
    };

    const handleMarkRead = async (id) => {
        try {
            await markAsRead(id);
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch { /* silently fail */ }
    };

    const handleMarkAllRead = async () => {
        try {
            await markAllAsRead();
            setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
            setUnreadCount(0);
        } catch { /* silently fail */ }
    };

    const handleDeleteNotification = async (e, id) => {
        e.stopPropagation(); // prevent opening/mark-as-read
        
        // Hide locally from the dropdown box state
        setDismissedIds(prev => {
            const next = new Set(prev);
            next.add(id);
            return next;
        });

        const target = notifications.find(n => n.id === id);
        
        // If it was unread, update count and mark as read so poll doesn't revive badge
        if (target && !target.is_read) {
            setUnreadCount(count => Math.max(0, count - 1));
            markAsRead(id).catch(() => {});
        }

        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    const handleLogout = async (e) => {
        e.preventDefault();
        await logout();
        navigate('/', { replace: true });
    };

    const getInitials = () => {
        if (!user) return "AD";
        const prenom = user.prenom || "";
        const nom = user.nom || "";
        return (prenom[0] || "") + (nom[0] || "").toUpperCase();
    };

    const userName = user ? `${user.prenom || ''} ${user.nom || ''}`.trim().toLowerCase() : 'Utilisateur';
    const userRole = user?.role === 'etudiant' ? 'ÉTUDIANT' : (user?.role === 'formateur' ? 'FORMATEUR' : 'ADMINISTRATEUR');

    return (
        <header className="admin-header">
            <div className="admin-header-left">
                <Link to="#" id="toggle_btn" className="admin-toggle-btn">
                    <MenuIcon size={24} />
                </Link>
            </div>

            <div className="admin-header-right">
                {/* Notifications */}
                <div className="admin-header-action" ref={dropdownRef}>
                    <button className="admin-icon-btn" onClick={toggleDropdown} id="notif-bell-btn">
                        <Bell size={24} />
                        {unreadCount > 0 && (
                            <span className="admin-notification-badge">
                                {unreadCount > 99 ? '99+' : unreadCount}
                            </span>
                        )}
                    </button>

                    {/* Notification Dropdown */}
                    <div className={`notif-dropdown ${dropdownOpen ? 'notif-dropdown--open' : ''}`}>
                        {/* Dropdown Header */}
                        <div className="notif-dropdown__header">
                            <div className="notif-dropdown__title-row">
                                <h4 className="notif-dropdown__title">Notifications</h4>
                                {unreadCount > 0 && (
                                    <span className="notif-dropdown__unread-badge">{unreadCount} nouvelle{unreadCount > 1 ? 's' : ''}</span>
                                )}
                            </div>
                            {unreadCount > 0 && (
                                <button className="notif-dropdown__mark-all" onClick={handleMarkAllRead}>
                                    <CheckAll size={14} />
                                    <span>Tout marquer comme lu</span>
                                </button>
                            )}
                        </div>

                        {/* Dropdown Body */}
                        <div className="notif-dropdown__body">
                            {loadingNotifs ? (
                                <div className="notif-dropdown__loading">
                                    <div className="notif-spinner"></div>
                                    <span>Chargement...</span>
                                </div>
                            ) : notifications.length === 0 ? (
                                <div className="notif-dropdown__empty">
                                    <EmptyBellIcon size={48} />
                                    <p>Aucune notification</p>
                                    <span>Vous êtes à jour !</span>
                                </div>
                            ) : (
                                notifications.map((notif) => {
                                    const config = NOTIF_TYPE_CONFIG[notif.type] || NOTIF_TYPE_CONFIG.info;
                                    const TypeIcon = config.icon;
                                    return (
                                        <div
                                            key={notif.id}
                                            className={`notif-item ${!notif.is_read ? 'notif-item--unread' : ''}`}
                                            onClick={() => !notif.is_read && handleMarkRead(notif.id)}
                                        >
                                            <div className="notif-item__icon" style={{ background: config.bg, color: config.color, border: `1px solid ${config.border}` }}>
                                                <TypeIcon size={18} />
                                            </div>
                                            <div className="notif-item__content">
                                                {notif.title && <p className="notif-item__title">{notif.title}</p>}
                                                <p className="notif-item__message">{notif.message}</p>
                                                <span className="notif-item__time">{timeAgo(notif.created_at)}</span>
                                            </div>
                                            {!notif.is_read && <div className="notif-item__dot"></div>}
                                            <button 
                                                className="notif-item__delete-btn" 
                                                onClick={(e) => handleDeleteNotification(e, notif.id)}
                                                title="Supprimer"
                                            >
                                                <TrashIcon size={14} />
                                            </button>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </div>

                {/* Profile Section */}
                <div className="admin-profile-section">
                    <div className="admin-avatar-circle">
                        {getInitials() || "MT"}
                    </div>
                    <div className="admin-profile-details">
                        <span className="admin-profile-name">{userName}</span>
                        <span className="admin-profile-role">{userRole}</span>
                    </div>
                </div>

                {/* Logout Button */}
                <div className="admin-logout-wrap">
                    <button className="admin-logout-btn" onClick={handleLogout}>
                        <LogOut size={18} />
                        <span>Déconnexion</span>
                    </button>
                </div>
            </div>

            <style>{`
                .admin-header {
                    height: 70px;
                    background: #ffffff;
                    border-bottom: 1px solid #f1f5f9;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 0 24px;
                    position: sticky;
                    top: 0;
                    z-index: 1000;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.02);
                }

                .admin-header-right {
                    display: flex;
                    align-items: center;
                    gap: 28px;
                }

                .admin-header-action {
                    position: relative;
                }

                .admin-icon-btn {
                    background: none;
                    border: none;
                    color: #64748b;
                    position: relative;
                    padding: 8px;
                    border-radius: 10px;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .admin-icon-btn:hover {
                    background: #f8fafc;
                    color: #1e293b;
                }

                .admin-notification-badge {
                    position: absolute;
                    top: 2px;
                    right: 0px;
                    min-width: 18px;
                    height: 18px;
                    padding: 0 5px;
                    background: linear-gradient(135deg, #ef4444, #dc2626);
                    color: #fff;
                    font-size: 10px;
                    font-weight: 700;
                    border-radius: 50px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border: 2px solid #fff;
                    line-height: 1;
                    animation: notifBadgePulse 2s ease-in-out infinite;
                }

                @keyframes notifBadgePulse {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.1); }
                }

                /* ========== NOTIFICATION DROPDOWN ========== */
                .notif-dropdown {
                    position: absolute;
                    top: calc(100% + 12px);
                    right: -60px;
                    width: 380px;
                    max-height: 480px;
                    background: rgba(255, 255, 255, 0.95);
                    backdrop-filter: blur(20px);
                    -webkit-backdrop-filter: blur(20px);
                    border: 1px solid rgba(226, 232, 240, 0.8);
                    border-radius: 16px;
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.12), 0 8px 20px rgba(0, 0, 0, 0.06);
                    opacity: 0;
                    visibility: hidden;
                    transform: translateY(-8px) scale(0.97);
                    transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
                    z-index: 2000;
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                }

                .notif-dropdown--open {
                    opacity: 1;
                    visibility: visible;
                    transform: translateY(0) scale(1);
                }

                /* Arrow */
                .notif-dropdown::before {
                    content: '';
                    position: absolute;
                    top: -6px;
                    right: 72px;
                    width: 12px;
                    height: 12px;
                    background: rgba(255, 255, 255, 0.95);
                    border-top: 1px solid rgba(226, 232, 240, 0.8);
                    border-left: 1px solid rgba(226, 232, 240, 0.8);
                    transform: rotate(45deg);
                    z-index: 1;
                }

                .notif-dropdown__header {
                    padding: 16px 20px 12px;
                    border-bottom: 1px solid #f1f5f9;
                }

                .notif-dropdown__title-row {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-bottom: 8px;
                }

                .notif-dropdown__title {
                    font-size: 16px;
                    font-weight: 700;
                    color: #0f172a;
                    margin: 0;
                }

                .notif-dropdown__unread-badge {
                    background: linear-gradient(135deg, #3b82f6, #0ea5e9);
                    color: #fff;
                    font-size: 11px;
                    font-weight: 600;
                    padding: 3px 10px;
                    border-radius: 50px;
                    letter-spacing: 0.3px;
                }

                .notif-dropdown__mark-all {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    background: none;
                    border: none;
                    color: #3b82f6;
                    font-size: 12px;
                    font-weight: 600;
                    cursor: pointer;
                    padding: 4px 0;
                    transition: color 0.15s;
                }
                .notif-dropdown__mark-all:hover {
                    color: #1d4ed8;
                }

                .notif-dropdown__body {
                    flex: 1;
                    overflow-y: auto;
                    padding: 6px 0;
                    scrollbar-width: thin;
                    scrollbar-color: #e2e8f0 transparent;
                }
                .notif-dropdown__body::-webkit-scrollbar { width: 5px; }
                .notif-dropdown__body::-webkit-scrollbar-track { background: transparent; }
                .notif-dropdown__body::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }

                /* ---- Notification Item ---- */
                .notif-item {
                    display: flex;
                    align-items: flex-start;
                    gap: 12px;
                    padding: 12px 20px;
                    cursor: pointer;
                    transition: background 0.15s;
                    position: relative;
                }
                .notif-item:hover {
                    background: rgba(241, 245, 249, 0.6);
                }
                .notif-item--unread {
                    background: rgba(239, 246, 255, 0.45);
                }
                .notif-item--unread:hover {
                    background: rgba(219, 234, 254, 0.45);
                }

                .notif-item__icon {
                    width: 38px;
                    height: 38px;
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                    margin-top: 2px;
                }

                .notif-item__content {
                    flex: 1;
                    min-width: 0;
                }

                .notif-item__title {
                    font-size: 13px;
                    font-weight: 700;
                    color: #1e293b;
                    margin: 0 0 2px;
                    line-height: 1.3;
                }

                .notif-item__message {
                    font-size: 12.5px;
                    color: #475569;
                    margin: 0 0 4px;
                    line-height: 1.4;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }

                .notif-item__time {
                    font-size: 11px;
                    color: #94a3b8;
                    font-weight: 500;
                }

                .notif-item__dot {
                    width: 8px;
                    height: 8px;
                    background: linear-gradient(135deg, #3b82f6, #0ea5e9);
                    border-radius: 50%;
                    flex-shrink: 0;
                    margin-top: 6px;
                    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
                }

                .notif-item__delete-btn {
                    background: none;
                    border: none;
                    color: #cbd5e1;
                    cursor: pointer;
                    padding: 6px;
                    margin-left: 4px;
                    border-radius: 6px;
                    opacity: 0;
                    transition: all 0.2s;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .notif-item:hover .notif-item__delete-btn {
                    opacity: 1;
                }

                .notif-item__delete-btn:hover {
                    color: #ef4444;
                    background: #fee2e2;
                }

                /* ---- States ---- */
                .notif-dropdown__loading {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 10px;
                    padding: 40px 20px;
                    color: #94a3b8;
                    font-size: 13px;
                }

                .notif-spinner {
                    width: 28px;
                    height: 28px;
                    border: 3px solid #e2e8f0;
                    border-top-color: #3b82f6;
                    border-radius: 50%;
                    animation: notifSpin 0.7s linear infinite;
                }
                @keyframes notifSpin {
                    to { transform: rotate(360deg); }
                }

                .notif-dropdown__empty {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    padding: 40px 20px;
                    text-align: center;
                }
                .notif-dropdown__empty p {
                    font-size: 14px;
                    font-weight: 600;
                    color: #64748b;
                    margin: 12px 0 4px;
                }
                .notif-dropdown__empty span {
                    font-size: 12px;
                    color: #94a3b8;
                }

                /* ---- Existing Header Styles ---- */
                .admin-profile-section {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }

                .admin-avatar-circle {
                    width: 44px;
                    height: 44px;
                    background: linear-gradient(135deg, #3b82f6, #0ea5e9);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-weight: 700;
                    font-size: 15px;
                    letter-spacing: -0.5px;
                    box-shadow: 0 4px 10px rgba(59, 130, 246, 0.25);
                }

                .admin-profile-details {
                    display: flex;
                    flex-direction: column;
                }

                .admin-profile-name {
                    font-size: 15px;
                    font-weight: 700;
                    color: #1e293b;
                    line-height: 1.2;
                }

                .admin-profile-role {
                    font-size: 11px;
                    font-weight: 600;
                    color: #94a3b8;
                    letter-spacing: 0.5px;
                }

                .admin-logout-btn {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 9px 16px;
                    background: #f8fafc;
                    border: 1px solid #e2e8f0;
                    border-radius: 10px;
                    color: #475569;
                    font-size: 14px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .admin-logout-btn:hover {
                    background: #f1f5f9;
                    border-color: #cbd5e1;
                    color: #1e293b;
                }

                .admin-toggle-btn {
                    color: #64748b;
                    padding: 8px;
                    border-radius: 8px;
                    transition: all 0.2s;
                }
                
                .admin-toggle-btn:hover {
                    background: #f8fafc;
                    color: #1e293b;
                }
            `}</style>
        </header>
    );
};

export default Header;
