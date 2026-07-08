import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Check, Clock, Trash2, ExternalLink, Info } from 'lucide-react';
import { getNotifications, getUnreadCount, markAsRead, markAllAsRead } from '../../../admin/api/notifications';
import Skeleton from '../../../core/components/ui/Skeleton';

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const [notifsResp, unreadResp] = await Promise.all([
        getNotifications({ per_page: 5 }),
        getUnreadCount()
      ]);
      setNotifications(notifsResp?.data?.data || notifsResp?.data || []);
      setUnreadCount(unreadResp?.unread_count || 0);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Poll every 1 minute
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      await markAsRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read_at: new Date() } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, read_at: new Date() })));
      setUnreadCount(0);
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`p-2 rounded-full relative transition-all duration-200 ${isOpen ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500 hover:bg-slate-100'}`}
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-500 text-white text-[10px] font-black rounded-full border-2 border-white flex items-center justify-center animate-in zoom-in">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 mt-3 w-80 md:w-96 bg-white rounded-[2rem] border border-slate-200 shadow-2xl shadow-slate-200/50 z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">Notifications</h3>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 bg-indigo-100 text-indigo-600 text-[10px] font-black rounded-full">
                    {unreadCount} NOUVEAU
                  </span>
                )}
              </div>
              {unreadCount > 0 && (
                <button 
                  onClick={handleMarkAllAsRead}
                  className="text-[10px] font-bold text-indigo-600 hover:text-indigo-700 uppercase tracking-widest transition-colors"
                >
                  Tout marquer comme lu
                </button>
              )}
            </div>

            {/* List */}
            <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
              {loading && notifications.length === 0 ? (
                <div className="p-4 space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="flex gap-3">
                      <Skeleton className="w-10 h-10 rounded-xl flex-shrink-0" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="w-full h-3" />
                        <Skeleton className="w-1/2 h-2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : notifications.length === 0 ? (
                <div className="p-12 text-center flex flex-col items-center">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-4">
                    <Bell size={32} />
                  </div>
                  <p className="text-sm font-bold text-slate-900 uppercase tracking-tight">Aucune notification</p>
                  <p className="text-xs text-slate-400 mt-1">Vous êtes à jour !</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-50">
                  {notifications.map((notif) => (
                    <div 
                      key={notif.id}
                      className={`p-4 flex gap-4 transition-colors hover:bg-slate-50 cursor-pointer relative group ${!notif.read_at ? 'bg-indigo-50/30' : ''}`}
                      onClick={() => !notif.read_at && handleMarkAsRead(notif.id)}
                    >
                      {!notif.read_at && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-600"></div>
                      )}
                      
                      <div className={`w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center ${!notif.read_at ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-slate-100 text-slate-400'}`}>
                        <Info size={18} />
                      </div>

                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center justify-between">
                          <p className={`text-sm leading-tight ${!notif.read_at ? 'font-bold text-slate-900' : 'font-medium text-slate-600'}`}>
                            {notif.title || notif.data?.title || 'Notification'}
                          </p>
                          <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                            <Clock size={10} />
                            {new Date(notif.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                          {notif.message || notif.data?.message || 'Pas de contenu.'}
                        </p>
                        
                        <div className="flex items-center gap-3 pt-1">
                           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                             {new Date(notif.created_at).toLocaleDateString()}
                           </p>
                           {!notif.read_at && (
                             <div className="flex items-center gap-1 text-[10px] font-black text-indigo-600 uppercase tracking-tighter">
                               <Check size={10} /> Nouveau
                             </div>
                           )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50/30 text-center">
               <button className="text-[11px] font-black text-slate-500 hover:text-indigo-600 uppercase tracking-[0.2em] transition-colors flex items-center justify-center gap-2 mx-auto">
                 <span>Voir tout l'historique</span>
                 <ExternalLink size={12} />
               </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
