import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Calendar,
  Search,
  Filter,
  ArrowUpRight,
  UserX
} from 'lucide-react';
import { toast } from 'react-toastify';
import { useAuth } from '../../admin/context/AuthContext';
import { listAbsences } from '../../admin/api/absences';
import Skeleton from '../../core/components/ui/Skeleton';

export default function StudentAttendance() {
  const { user } = useAuth();
  const [absences, setAbsences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!user?.id) return;
    (async () => {
      try {
        const resp = await listAbsences({ user_id: user.id });
        setAbsences(resp?.data?.data || resp?.data || []);
      } catch (e) {
        toast.error("Erreur lors du chargement de l'assiduité.");
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  const filteredAbsences = absences.filter(abs => 
    abs.module?.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    abs.type?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const rate = Math.max(100 - (absences.length * 2), 0);

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
      <div className="relative overflow-hidden rounded-[2.5rem] bg-rose-600 p-8 lg:p-12 text-white shadow-2xl shadow-rose-100">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 border border-white/20 backdrop-blur-md">
              <Activity size={14} className="text-rose-200" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Suivi de Présence</span>
            </div>
            <h1 className="text-3xl lg:text-5xl font-black tracking-tight">Assiduité & Absences</h1>
            <p className="text-rose-100/80 font-medium max-w-md">Consultez l'historique de vos présences et assurez-vous de respecter les quotas académiques.</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-[2rem] text-center min-w-[200px]">
            <p className="text-[10px] font-bold uppercase tracking-widest text-rose-200 mb-1">Taux de Présence</p>
            <p className="text-5xl font-black leading-none mb-2">{rate}%</p>
            <div className="flex items-center justify-center gap-1 text-rose-200">
              <span className="text-[10px] font-bold uppercase">{absences.length} Absence(s)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-[2rem] border border-slate-200/60 shadow-sm flex items-center gap-5">
           <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
             <CheckCircle2 size={24} />
           </div>
           <div>
             <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">État Global</p>
             <p className="text-lg font-black text-slate-900 leading-none">{rate > 80 ? 'Excellent' : 'Attention'}</p>
           </div>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-slate-200/60 shadow-sm flex items-center gap-5">
           <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
             <AlertCircle size={24} />
           </div>
           <div>
             <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Total Absences</p>
             <p className="text-lg font-black text-slate-900 leading-none">{absences.length} sessions</p>
           </div>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-slate-200/60 shadow-sm flex items-center gap-5">
           <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
             <Clock size={24} />
           </div>
           <div>
             <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Justification</p>
             <p className="text-lg font-black text-slate-900 leading-none">
               {absences.filter(a => a.justifie).length} / {absences.length}
             </p>
           </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200/60 rounded-[2rem] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Module</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date / Heure</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Justifié</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              <AnimatePresence mode="popLayout">
                {absences.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-8 py-20 text-center">
                      <div className="flex flex-col items-center opacity-30">
                        <CheckCircle2 size={48} className="mb-4 text-emerald-500" />
                        <p className="text-sm font-bold uppercase tracking-widest text-slate-500">Aucune absence enregistrée</p>
                        <p className="text-xs text-slate-400 mt-1 uppercase font-bold tracking-widest">Félicitations pour votre assiduité !</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  absences.map((abs, i) => (
                    <motion.tr 
                      key={abs.id || i}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="group hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold text-xs">
                            <UserX size={18} />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-900 leading-none mb-1">{abs.module?.nom || 'Module inconnu'}</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{abs.type || 'Absence'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                         <div className="flex items-center gap-2 text-slate-500">
                            <Calendar size={14} className="text-slate-300" />
                            <span className="text-xs font-semibold">{abs.date}</span>
                         </div>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex justify-center">
                          <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${abs.justifie ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                            {abs.justifie ? 'Oui' : 'Non'}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <button className="p-2 text-slate-300 hover:text-indigo-600 hover:bg-white rounded-lg transition-all shadow-sm">
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
