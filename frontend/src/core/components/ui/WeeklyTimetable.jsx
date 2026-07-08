import React from 'react';
import { Printer, MapPin, History, Clock, BookOpen, User } from 'lucide-react';

const WeeklyTimetable = ({ schedule = [], viewMode = 'groupe', entityName = '' }) => {
    const sessions = Array.isArray(schedule) ? schedule : (schedule?.data || []);
    const daysOfWeek = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
    const startTime = 8.5;

    const timeHeaders = [
        "08:30", "09:30", "10:30", "11:30", "12:30",
        "13:30", "14:30", "15:30", "16:30", "17:30", "18:30"
    ];

    const timeToValue = (timeStr) => {
        if (!timeStr) return 0;
        const [h, m] = timeStr.split(':').map(Number);
        return h + m / 60;
    };

    // Column 1 of the day sub-grid corresponds to the first 30-min slot (08:30)
    const calculateSessionStyle = (session) => {
        const start = timeToValue(session.heure_debut);
        const end = timeToValue(session.heure_fin);
        const startCol = Math.round((start - startTime) * 2) + 1; // 1-indexed within the 20-col sub-grid
        const span = Math.round((end - start) * 2);
        return { gridColumn: `${startCol} / span ${span}` };
    };

    return (
        <div className="space-y-6">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row items-center justify-end gap-4 bg-slate-50/50 p-3 rounded-2xl border border-slate-200/40">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        <History size={14} />
                        {new Date().toLocaleDateString('fr-FR')}
                    </div>
                    <button
                        onClick={() => window.print()}
                        className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-indigo-600 hover:border-indigo-200 transition-all shadow-sm active:scale-95 no-print"
                    >
                        <Printer size={14} strokeWidth={2.5} /> Imprimer
                    </button>
                </div>
            </div>

            {/* Timetable Wrapper */}
            <div className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-xl shadow-slate-200/50">
                <div className="overflow-x-auto custom-scrollbar">
                    <div className="min-w-[1000px]">

                        {/* ── Header Row ── */}
                        <div className="flex">
                            {/* "Horaires" sticky label */}
                            <div
                                className="w-[120px] shrink-0 h-14 flex items-center justify-center bg-indigo-50/50 border-b border-r border-slate-100 text-[11px] font-bold text-indigo-400 tracking-wide sticky left-0 z-20"
                                style={{ backgroundColor: '#f5f5ff' }}
                            >
                                Horaires
                            </div>

                            {/* Time columns — each time-slot header spans 2 sub-columns */}
                            <div className="flex-1 grid border-b border-slate-100" style={{ gridTemplateColumns: 'repeat(20, 1fr)' }}>
                                {timeHeaders.slice(0, -1).map((h, i) => (
                                    <div key={h} className="col-span-2 h-14 flex flex-col items-center justify-center bg-indigo-50/50 border-r border-slate-100 last:border-r-0">
                                        <span className="text-[11px] font-black text-indigo-600 tracking-tighter">{h}</span>
                                        <span className="text-[9px] font-bold text-indigo-300 tracking-widest uppercase">{timeHeaders[i + 1]}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* ── Day Rows ── */}
                        {daysOfWeek.map((day) => {
                            const daySessions = sessions.filter(
                                s => String(s.jour).trim().toLowerCase() === day.trim().toLowerCase()
                            );

                            return (
                                <div key={day} className="flex">
                                    {/* Day label — always anchored left */}
                                    <div
                                        className="w-[120px] shrink-0 h-24 flex items-center justify-center border-b border-r border-slate-100 text-xs font-bold text-slate-500 sticky left-0 z-20"
                                        style={{ backgroundColor: '#ffffff' }}
                                    >
                                        {day}
                                    </div>

                                    {/* Time area: background grid + session overlays */}
                                    <div
                                        className="flex-1 relative h-24 border-b border-slate-100"
                                        style={{ display: 'grid', gridTemplateColumns: 'repeat(20, 1fr)' }}
                                    >
                                        {/* Background cells */}
                                        {Array.from({ length: 20 }).map((_, i) => (
                                            <div
                                                key={i}
                                                className={`border-r border-slate-50 last:border-r-0 ${Math.floor(i / 2) % 2 === 0 ? 'bg-transparent' : 'bg-slate-50/20'}`}
                                            />
                                        ))}

                                        {/* Session cards — overlaid via CSS Grid on the same grid */}
                                        {daySessions.map(session => (
                                            <div
                                                key={session.id}
                                                style={{
                                                    ...calculateSessionStyle(session),
                                                    gridRow: 1,
                                                    alignSelf: 'stretch',
                                                }}
                                                className="p-1 z-10"
                                            >
                                                <div className="h-full w-full bg-indigo-50 border border-indigo-100 rounded-2xl p-3 flex flex-col justify-between hover:scale-[1.02] hover:shadow-lg hover:shadow-indigo-100 hover:z-20 transition-all cursor-default group">
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-1.5">
                                                            <div className="w-1.5 h-4 bg-indigo-500 rounded-full" />
                                                            <span className="text-[10px] font-black text-indigo-900 leading-none uppercase tracking-tight truncate">
                                                                {session.module?.nom || 'Module'}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-1 text-[9px] font-bold text-indigo-400 uppercase tracking-widest">
                                                            <Clock size={10} />
                                                            {session.heure_debut} - {session.heure_fin}
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center justify-between gap-2 mt-auto">
                                                        <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-500 truncate">
                                                            <User size={10} className="text-indigo-400" />
                                                            {viewMode === 'groupe'
                                                                ? (session.formateur ? `${session.formateur.prenom} ${session.formateur.nom}` : 'DIRECTION')
                                                                : (session.groupe?.nom || '---')}
                                                        </div>
                                                        <div className="flex items-center gap-1 px-2 py-0.5 bg-white rounded-lg border border-indigo-100 text-[9px] font-bold text-indigo-600">
                                                            <MapPin size={10} />
                                                            {session.salle || 'S.1'}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Footer Summary */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-white rounded-[2rem] border border-slate-200/60 shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                        <BookOpen size={24} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Charge Hebdomadaire</p>
                        <p className="text-lg font-black text-slate-900 leading-none">
                            {sessions.reduce((sum, s) => sum + (timeToValue(s.heure_fin) - timeToValue(s.heure_debut)), 0).toFixed(1)} Heures
                        </p>
                    </div>
                </div>
                <div className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">
                    ISTA NTIC • {viewMode === 'formateur' ? 'PORTAIL FORMATEUR' : 'PORTAIL ÉTUDIANT'}
                </div>
            </div>
        </div>
    );
};

export default WeeklyTimetable;
