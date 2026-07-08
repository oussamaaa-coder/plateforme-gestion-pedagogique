import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, FolderOpen, BookOpen, ChevronRight, File } from 'lucide-react';

const ResourcesCard = React.memo(({ resources = [] }) => {
  const recent = resources.slice(0, 4);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-[1.5rem] border border-slate-200/60 p-6 shadow-sm flex flex-col hover:shadow-md transition-shadow"
    >
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 shadow-sm shadow-amber-100">
            <FolderOpen size={24} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider leading-none mb-1">Ressources</h3>
            <p className="text-xs text-slate-400 font-medium">Derniers partages</p>
          </div>
        </div>
        <button className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all border border-slate-100">
          <BookOpen size={18} />
        </button>
      </div>

      <div className="space-y-3 flex-1">
        {recent.length === 0 ? (
          <div className="py-10 px-4 text-center bg-slate-50 border border-dashed border-slate-200 rounded-[2rem]">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mx-auto mb-4 text-slate-300">
              <File size={24} />
            </div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">Aucun document</p>
            <p className="text-[10px] text-slate-400">Vos formateurs n'ont pas encore partagé de fichiers.</p>
          </div>
        ) : (
          recent.map((res, i) => (
            <motion.div 
              key={res.id || i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="group flex items-center gap-4 p-3 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all"
            >
              <div className={`
                flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-colors
                ${res.type === 'Cours' ? 'bg-indigo-50 text-indigo-600' : 'bg-rose-50 text-rose-600'}
              `}>
                <FileText size={18} />
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-800 truncate leading-tight mb-1">{res.titre}</p>
                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <span className="truncate max-w-[120px]">{res.module?.nom || 'Support'}</span>
                  <span>•</span>
                  <span>{res.type || 'Fichier'}</span>
                </div>
              </div>

              <a 
                href={res.fichier_url || `http://127.0.0.1:8000/storage/${res.fichier}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:border-indigo-200 shadow-sm transition-all"
              >
                <Download size={14} />
              </a>
            </motion.div>
          ))
        )}
      </div>

      <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{resources.length} documents partagés</span>
        <button className="flex items-center gap-1 text-[11px] font-bold text-indigo-600 hover:text-indigo-700 uppercase tracking-wider transition-colors group">
          Tout voir
          <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </motion.div>
  );
});

export default ResourcesCard;
