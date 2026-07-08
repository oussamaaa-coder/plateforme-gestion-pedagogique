import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { Calendar as CalendarIcon, Info } from 'lucide-react';
import { useAuth } from '../../admin/context/AuthContext';
import { listSchedule } from '../../admin/api/schedule';
import WeeklyTimetable from '../../core/components/ui/WeeklyTimetable';
import Skeleton from '../../core/components/ui/Skeleton';

export default function StudentSchedule() {
  const { user } = useAuth();
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadSchedule = useCallback(async () => {
    if (!user?.groupe_id) return;
    setLoading(true);
    try {
      const resp = await listSchedule({ groupe_id: user.groupe_id, per_page: 100 });
      const schedData = resp?.data?.data || resp?.data || resp || [];
      setSchedule(Array.isArray(schedData) ? schedData : []);
    } catch (error) {
      toast.error("Erreur lors du chargement de l'emploi du temps.");
    } finally {
      setLoading(false);
    }
  }, [user?.groupe_id]);

  useEffect(() => {
    loadSchedule();
  }, [loadSchedule]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-4">
            <Skeleton className="w-64 h-10 rounded-2xl" />
            <Skeleton className="w-96 h-4 rounded-lg" />
          </div>
          <Skeleton className="w-48 h-16 rounded-2xl" />
        </div>
        <Skeleton className="w-full h-[600px] rounded-[2.5rem]" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 shadow-sm shadow-indigo-100">
              <CalendarIcon size={24} />
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Emploi du Temps</h2>
              <div className="px-3 py-1 bg-indigo-50 border border-indigo-100 rounded-full text-[10px] font-black text-indigo-600 uppercase tracking-widest flex items-center gap-1.5 shadow-sm shadow-indigo-100/50">
                 <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse"></div>
                 {user?.groupe?.nom || 'N/A'}
              </div>
            </div>
          </div>
          <p className="text-sm font-semibold text-slate-500 max-w-md">
            Visualisez votre planning hebdomadaire. Restez informé de vos prochains cours et sessions.
          </p>
        </div>
      </div>

      {/* Timetable Section */}
      <div className="bg-white border border-slate-200/60 rounded-[2rem] p-6 lg:p-8 shadow-sm">
        <WeeklyTimetable 
          schedule={schedule} 
          viewMode="groupe" 
          entityName={user?.groupe?.nom || 'Votre groupe'} 
        />
      </div>

      {/* Info Card */}
      <div className="bg-amber-50 border border-amber-100 p-6 rounded-[1.5rem] flex items-center gap-5 shadow-sm">
        <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-amber-500 shadow-sm shadow-amber-100">
          <Info size={24} />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-bold text-amber-900">Note Administrative</p>
          <p className="text-xs font-semibold text-amber-700/80 uppercase tracking-wider">
            Les horaires sont susceptibles d'être modifiés. Veuillez consulter régulièrement votre espace.
          </p>
        </div>
      </div>
    </div>
  );
}
