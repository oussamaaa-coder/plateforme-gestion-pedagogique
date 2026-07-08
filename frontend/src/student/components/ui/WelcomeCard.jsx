import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

const WelcomeCard = React.memo(({ user }) => {
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bonjour';
    if (hour < 18) return 'Bon après-midi';
    return 'Bonsoir';
  }, []);

  const name = user?.prenom || 'Étudiant';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-[2rem] bg-white border border-slate-200/60 p-8 lg:p-12 shadow-sm"
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50/50 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-50/30 rounded-full blur-2xl -ml-24 -mb-24 pointer-events-none"></div>
      
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider">Session Active</span>
          </div>
          
          <div className="space-y-2">
            <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
              {greeting}, <span className="text-indigo-600">{name}</span>
            </h2>
            <p className="text-slate-500 max-w-md leading-relaxed">
              Heureux de vous revoir ! Voici ce qui se passe aujourd'hui dans votre parcours d'apprentissage.
            </p>
          </div>
        </div>

        <div className="flex flex-col md:items-end">
          <div className="text-4xl font-black text-slate-900 tabular-nums">
            {new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
          </div>
          <div className="text-xs font-bold text-indigo-500 uppercase tracking-[0.2em] mt-1">
            {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
          </div>
        </div>
      </div>
    </motion.div>
  );
});

export default WelcomeCard;
