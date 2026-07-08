import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Clock, Check, Trash2, Search, Info, AlertCircle } from 'lucide-react';
import { getNotifications, markAsRead, markAllAsRead, deleteNotification } from '../../admin/api/notifications';
import Skeleton from '../../core/components/ui/Skeleton';
import { toast } from 'react-toastify';
import useDebounce from '../../core/hooks/useDebounce';

export default function StudentNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, unread, read
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const resp = await getNotifications({ per_page: 100 });
      setNotifications(resp?.data?.data || resp?.data || []);
    } catch (error) {
      toast.error("Erreur lors du chargement des notifications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      await markAsRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read_at: new Date() } : n));
    } catch (e) {
      toast.error("Erreur lors de l'opération");
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, read_at: new Date() })));
      toast.success("Toutes les notifications sont marquées comme lues");
    } catch (e) {
      toast.error("Erreur lors de l'opération");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer cette notification ?")) return;
    try {
      await deleteNotification(id);
      setNotifications(prev => prev.filter(n => n.id !== id));
      toast.info("Notification supprimée");
    } catch (e) {
      toast.error("Erreur lors de la suppression");
    }
  };

  const filteredNotifs = useMemo(() => {
    return notifications.filter(n => {
      const matchesFilter = filter === 'all' || (filter === 'unread' ? !n.read_at : !!n.read_at);
      const text = (n.title || n.data?.title || '') + (n.message || n.data?.message || '');
      const matchesSearch = text.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [notifications, filter, debouncedSearchTerm]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl mx-auto space-y-8 pb-12"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 shadow-sm">
              <Bell size={24} />
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Historique des Notifications</h1>
          </div>
          <p className="text-sm font-semibold text-slate-500">
            Retrouvez tous les messages et alertes envoyés par l'administration et vos formateurs.
          </p>
        </div>

        <button 
          onClick={handleMarkAllRead}
          className="px-6 py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm"
        >
          <Check size={16} />
          Tout marquer comme lu
        </button>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-[1.5rem] border border-slate-200/60 shadow-sm flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text"
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500/10 transition-all"
            placeholder="Rechercher une notification..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex items-center p-1 bg-slate-100 rounded-xl">
           {[
             { id: 'all', label: 'Tout' },
             { id: 'unread', label: 'Non lus' },
             { id: 'read', label: 'Lus' }
           ].map(opt => (
             <button
               key={opt.id}
               onClick={() => setFilter(opt.id)}
               className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${filter === opt.id ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
             >
               {opt.label}
             </button>
           ))}
        </div>
      </div>

      {/* Content */}
      <div className="space-y-4">
        {loading ? (
          Array(5).fill(0).map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-[1.5rem] border border-slate-100 flex gap-4">
              <Skeleton className="w-12 h-12 rounded-xl flex-shrink-0" />
              <div className="flex-1 space-y-3">
                <Skeleton className="w-1/3 h-4" />
                <Skeleton className="w-full h-3" />
                <Skeleton className="w-1/2 h-2" />
              </div>
            </div>
          ))
        ) : filteredNotifs.length === 0 ? (
          <div className="py-24 text-center bg-white border border-dashed border-slate-200 rounded-[2.5rem]">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mx-auto mb-6">
               <Bell size={40} />
            </div>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Aucune notification trouvée</p>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {filteredNotifs.map((notif) => (
              <motion.div
                key={notif.id}
                layout
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className={`group p-6 rounded-[2rem] border transition-all duration-300 flex flex-col md:flex-row gap-6 relative overflow-hidden ${!notif.read_at ? 'bg-white border-indigo-200 shadow-lg shadow-indigo-100/20' : 'bg-white/60 border-slate-200 opacity-80 hover:opacity-100 hover:bg-white'}`}
              >
                {!notif.read_at && <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-indigo-600"></div>}
                
                <div className={`w-14 h-14 rounded-2xl flex-shrink-0 flex items-center justify-center ${!notif.read_at ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-200' : 'bg-slate-100 text-slate-400'}`}>
                   {notif.type?.includes('alert') ? <AlertCircle size={28} /> : <Info size={28} />}
                </div>

                <div className="flex-1 space-y-2">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <h3 className={`text-lg leading-tight ${!notif.read_at ? 'font-black text-slate-900' : 'font-bold text-slate-600'}`}>
                      {notif.title || notif.data?.title || 'Notification'}
                    </h3>
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-1 rounded-md">
                        <Clock size={12} />
                        {new Date(notif.created_at).toLocaleDateString()} à {new Date(notif.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                  
                  <p className={`text-sm leading-relaxed ${!notif.read_at ? 'text-slate-600 font-medium' : 'text-slate-500'}`}>
                    {notif.message || notif.data?.message || 'Pas de contenu.'}
                  </p>

                  <div className="flex items-center gap-4 pt-2">
                    {!notif.read_at && (
                      <button 
                        onClick={() => handleMarkAsRead(notif.id)}
                        className="text-[10px] font-black text-indigo-600 uppercase tracking-widest flex items-center gap-1 hover:text-indigo-700 transition-colors"
                      >
                        <Check size={14} />
                        Marquer comme lu
                      </button>
                    )}
                    <button 
                      onClick={() => handleDelete(notif.id)}
                      className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1 hover:text-rose-600 transition-colors ml-auto md:ml-0"
                    >
                      <Trash2 size={14} />
                      Supprimer
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </motion.div>
  );
}
