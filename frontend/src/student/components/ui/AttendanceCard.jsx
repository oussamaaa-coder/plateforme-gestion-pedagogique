import React from 'react';
import { Activity, ChevronRight, TrendingUp } from 'lucide-react';

export default function AttendanceCard({ stats = { rate: 0 } }) {
  return (
    <div className="bg-white rounded-[1.5rem] border border-slate-200/60 p-6 shadow-sm flex flex-col h-full hover:shadow-md transition-shadow">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 shadow-sm shadow-emerald-100">
          <Activity size={24} />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider leading-none mb-1">Assiduité</h3>
          <p className="text-xs text-slate-400 font-medium">Taux de présence mensuel</p>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center space-y-4">
        <div className="flex items-end gap-3">
          <span className="text-4xl font-black text-slate-900 leading-none">{stats.rate}%</span>
          <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full text-[10px] font-bold">
            <TrendingUp size={10} />
            <span>+2.4%</span>
          </div>
        </div>
        
        <div className="relative h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
          <div 
            className="absolute inset-y-0 left-0 bg-emerald-500 rounded-full transition-all duration-1000 ease-out shadow-[0_0_12px_rgba(16,185,129,0.3)]"
            style={{ width: `${stats.rate}%` }}
          />
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between border-t border-slate-50 pt-4">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">14 séances / 16</span>
        <button className="flex items-center gap-1 text-[11px] font-bold text-indigo-600 hover:text-indigo-700 uppercase tracking-wider transition-colors group">
          Détails 
          <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
}

