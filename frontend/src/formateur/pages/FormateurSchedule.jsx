import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { Calendar as CalendarIcon } from 'lucide-react';
import { useAuth } from '../../admin/context/AuthContext';
import { listSchedule } from '../../admin/api/schedule';
import WeeklyTimetable from '../../core/components/ui/WeeklyTimetable';

export default function FormateurSchedule() {
  const { user } = useAuth();
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadSchedule = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const response = await listSchedule({ formateur_id: user.id, per_page: 100 });
      setSchedule(response.data || []);
    } catch (error) {
      toast.error("Erreur lors du chargement de l'emploi du temps.");
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    loadSchedule();
  }, [loadSchedule]);

  if (loading) {
    return <div className="fm-spinner" style={{ margin: '100px auto' }} />;
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', color: 'var(--fm-text-primary)' }}>
        <CalendarIcon size={24} color="var(--fm-accent)" />
        <h2 style={{ fontSize: '20px', fontWeight: '800', margin: 0 }}>Mon Emploi du Temps</h2>
      </div>
      
      <WeeklyTimetable 
        schedule={schedule} 
        viewMode="formateur" 
        entityName={`${user?.prenom} ${user?.nom}`} 
      />
    </div>
  );
}
