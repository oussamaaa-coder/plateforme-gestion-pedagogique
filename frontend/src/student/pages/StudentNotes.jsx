import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Star, 
  BookOpen, 
  TrendingUp, 
  FileText, 
  Search,
  Filter,
  ArrowUpRight
} from 'lucide-react';
import { toast } from 'react-toastify';
import { useAuth } from '../../admin/context/AuthContext';
import { listNotes } from '../../admin/api/notes';
import Skeleton from '../../core/components/ui/Skeleton';

import useDebounce from '../../core/hooks/useDebounce';

export default function StudentNotes() {
  const { user } = useAuth();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  useEffect(() => {
    if (!user?.id) return;
    (async () => {
      try {
        const resp = await listNotes({ user_id: user.id });
        setNotes(resp?.data?.data || resp?.data || []);
      } catch (e) {
        toast.error("Erreur lors du chargement des notes.");
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  const filteredNotes = useMemo(() => {
    return notes.filter(n => 
      n.module?.nom.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      n.examen_type?.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    );
  }, [notes, debouncedSearchTerm]);

  const average = notes.length > 0 
    ? (notes.reduce((acc, n) => {
        const isEfm = n.type_controle === 'EFM' || n.type_controle === 'EFM_Regional' || n.examen_type === 'EFM';
        const noteVal = Number(n.note);
        const normalized = isEfm ? noteVal / 2 : noteVal;
        return acc + normalized;
      }, 0) / notes.length).toFixed(2)
    : 'N/A';

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto space-y-8 pb-12">
        <Skeleton className="h-40 rounded-[2.5rem]" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-32 rounded-2xl" />
          <Skeleton className="h-32 rounded-2xl" />
          <Skeleton className="h-32 rounded-2xl" />
        </div>
        <Skeleton className="h-[500px] rounded-[2rem]" />
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-7xl mx-auto space-y-8 pb-12"
    >
      {/* Header / Hero */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-indigo-600 p-8 lg:p-12 text-white shadow-2xl shadow-indigo-100">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 border border-white/20 backdrop-blur-md">
              <Star size={14} className="text-amber-300" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Résultats Académiques</span>
            </div>
            <h1 className="text-3xl lg:text-5xl font-black tracking-tight">Relevé de Notes</h1>
            <p className="text-indigo-100/80 font-medium max-w-md">Consultez vos performances par module et suivez votre progression tout au long de l'année.</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-[2rem] text-center min-w-[200px]">
            <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-200 mb-1">Moyenne Générale</p>
            <p className="text-5xl font-black leading-none mb-2">{average}</p>
            <div className="flex items-center justify-center gap-1 text-emerald-300">
              <TrendingUp size={14} />
              <span className="text-[10px] font-bold uppercase">Stable</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border border-slate-200/60 p-4 rounded-[1.5rem] shadow-sm flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text"
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none placeholder:text-slate-400"
            placeholder="Rechercher par module ou type d'examen..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all active:scale-95 shadow-lg shadow-slate-100">
          <Filter size={18} />
          <span>Filtres</span>
        </button>
      </div>

      {/* Notes Grid/Table */}
      <div className="bg-white border border-slate-200/60 rounded-[2rem] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Module</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Type / Session</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Note</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              <AnimatePresence mode="popLayout">
                {filteredNotes.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-8 py-20 text-center">
                      <div className="flex flex-col items-center opacity-30">
                        <FileText size={48} className="mb-4" />
                        <p className="text-sm font-bold uppercase tracking-widest">Aucune note trouvée</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredNotes.map((note, i) => (
                    <motion.tr 
                      key={note.id || i}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="group hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs">
                            {note.module?.code || 'MOD'}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-900 leading-none mb-1">{note.module?.nom}</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Matière principale</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-black uppercase tracking-wider">
                          {note.examen_type || 'Examen'}
                        </span>
                      </td>
                      <td className="px-8 py-5">
                        {(() => {
                          const isEfm = note.type_controle === 'EFM' || note.type_controle === 'EFM_Regional' || note.examen_type === 'EFM';
                          const maxNote = isEfm ? 40 : 20;
                          const isPassed = isEfm ? Number(note.note) >= 20 : Number(note.note) >= 10;
                          return (
                            <div className="flex flex-col items-center">
                              <span className={`text-lg font-black ${isPassed ? 'text-emerald-600' : 'text-rose-600'}`}>
                                {note.note}
                              </span>
                              <span className="text-[10px] font-bold text-slate-300 uppercase leading-none">/ {maxNote}</span>
                            </div>
                          );
                        })()}
                      </td>
                      <td className="px-8 py-5">
                        <p className="text-xs font-semibold text-slate-500">
                          {note.created_at ? new Date(note.created_at).toLocaleDateString() : 'N/A'}
                        </p>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <button className="p-2 text-slate-300 hover:text-indigo-600 hover:bg-white rounded-lg transition-all shadow-sm group-hover:shadow-indigo-100">
                          <ArrowUpRight size={18} />
                        </button>
                      </td>
                    </motion.tr>
                  ))
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}
