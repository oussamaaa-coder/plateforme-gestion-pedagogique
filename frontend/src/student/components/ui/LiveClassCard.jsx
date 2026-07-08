import React from 'react';
import { motion } from 'framer-motion';
import { Video, Clock, Users, ExternalLink } from 'lucide-react';

export default function LiveClassCard({ session }) {
  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-slate-50 border border-dashed border-slate-300 rounded-[1.5rem] h-full min-h-[220px]">
        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-4">
          <Video size={24} className="text-slate-400" />
        </div>
        <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Aucune séance en direct</p>
        <p className="text-xs text-slate-400 text-center">Revenez plus tard pour vos prochains cours en direct.</p>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-[1.5rem] border border-slate-200/60 p-6 shadow-sm flex flex-col h-full hover:shadow-md transition-shadow"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
          </span>
          <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest">En Direct</span>
        </div>
        <button className="p-2 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-100 transition-colors">
          <ExternalLink size={16} />
        </button>
      </div>

      <div className="mb-6">
        <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest mb-1">Cours en cours</p>
        <h3 className="text-xl font-black text-slate-900 leading-tight">{session.module?.nom}</h3>
      </div>

      <div className="mt-auto grid grid-cols-2 gap-4">
        <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
          <div className="flex items-center gap-2 text-slate-400 mb-1.5">
            <Users size={12} />
            <span className="text-[9px] font-bold uppercase tracking-wider">Formateur</span>
          </div>
          <p className="text-xs font-bold text-slate-700 truncate">
            {session.formateur ? `${session.formateur.prenom} ${session.formateur.nom}` : 'N/A'}
          </p>
        </div>
        
        <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
          <div className="flex items-center gap-2 text-slate-400 mb-1.5">
            <Clock size={12} />
            <span className="text-[9px] font-bold uppercase tracking-wider">Horaire</span>
          </div>
          <p className="text-xs font-bold text-slate-700">
            {session.heure_debut} - {session.heure_fin}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

