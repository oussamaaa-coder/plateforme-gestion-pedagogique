import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, MapPin, ChevronRight, LayoutDashboard } from 'lucide-react';

const ScheduleCard = React.memo(({ daySessions = [] }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-[1.5rem] border border-slate-200/60 p-6 shadow-sm flex flex-col hover:shadow-md transition-shadow"
    >
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 shadow-sm shadow-indigo-100">
            <Calendar size={24} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider leading-none mb-1">Agenda</h3>
            <p className="text-xs text-slate-400 font-medium">Planning du jour</p>
          </div>
        </div>
        <button className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all border border-slate-100">
          <LayoutDashboard size={18} />
        </button>
      </div>

      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {daySessions.length === 0 ? (
            <div className="py-10 px-4 text-center bg-slate-50 border border-dashed border-slate-200 rounded-[2rem]">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mx-auto mb-4 text-slate-300">
                <Clock size={24} />
              </div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">Journée Libre</p>
              <p className="text-[10px] text-slate-400">Aucun cours programmé aujourd'hui.</p>
            </div>
          ) : (
            daySessions.map((session, i) => (
              <motion.div 
                key={session.id || i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="group flex items-center gap-4 p-3 rounded-[1.25rem] hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all cursor-pointer"
              >
                <div className={`
                  flex-shrink-0 w-12 h-12 rounded-2xl flex flex-col items-center justify-center transition-colors
                  ${i === 0 ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-slate-100 text-slate-600 group-hover:bg-white border border-transparent group-hover:border-slate-200'}
                `}>
                  <span className="text-xs font-black">{session.heure_debut.split(':')[0]}</span>
                  <span className="text-[8px] font-bold uppercase opacity-80">h</span>
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-800 truncate leading-tight mb-1">{session.module?.nom}</p>
                  <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    <div className="flex items-center gap-1">
                      <MapPin size={10} className="text-indigo-400" />
                      <span>{session.salle || 'À distance'}</span>
                    </div>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <Clock size={10} className="text-slate-300" />
                      <span>{session.heure_debut}</span>
                    </div>
                  </div>
                </div>

                <div className="w-8 h-8 rounded-full flex items-center justify-center text-slate-300 group-hover:text-indigo-500 group-hover:bg-white transition-all">
                  <ChevronRight size={16} />
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{daySessions.length} sessions</span>
        <button className="flex items-center gap-1 text-[11px] font-bold text-indigo-600 hover:text-indigo-700 uppercase tracking-wider transition-colors group">
          Calendrier complet
          <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </motion.div>
  );
});

export default ScheduleCard;
