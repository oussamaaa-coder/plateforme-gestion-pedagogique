import React, { useEffect, useState, useMemo, Suspense, lazy } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Activity, 
  Zap, 
  Star,
  ArrowUpRight,
  Clock
} from 'lucide-react';
import { useAuth } from '../../admin/context/AuthContext';
import { getStudentDashboard } from '../../admin/api/dashboard';
import { apiCache } from '../../core/utils/apiCache';

import WelcomeCard from '../components/ui/WelcomeCard';
import Skeleton from '../../core/components/ui/Skeleton';
import LiveClassCard from '../components/ui/LiveClassCard';
import AttendanceCard from '../components/ui/AttendanceCard';
import ScheduleCard from '../components/ui/ScheduleCard';
import ResourcesCard from '../components/ui/ResourcesCard';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0 }
};

const StatSkeleton = () => (
  <div className="p-6 bg-white rounded-[1.5rem] border border-slate-200/60 shadow-sm space-y-4">
    <div className="flex items-start justify-between">
      <Skeleton className="w-12 h-12 rounded-2xl" />
      <Skeleton className="w-4 h-4" />
    </div>
    <div className="space-y-2">
      <Skeleton className="w-20 h-3" />
      <Skeleton className="w-12 h-6" />
    </div>
  </div>
);

export default function StudentDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState({
    schedule: [],
    resources: [],
    absences: [],
    notes: [],
    stats: null,
    loading: true
  });

  useEffect(() => {
    if (!user?.id) return;
    
    const cacheKey = `student_dashboard_full_${user.id}`;
    const cached = apiCache.get(cacheKey);

    if (cached) {
      setData({ ...cached, loading: false });
    }

    const fetchData = async () => {
      try {
        const resp = await getStudentDashboard();
        const freshData = resp?.data || {};
        
        const preparedData = {
          schedule: freshData.schedule || [],
          resources: freshData.resources || [],
          absences: freshData.absences || [],
          notes: freshData.notes || [],
          stats: freshData.stats || null
        };

        apiCache.set(cacheKey, preparedData);
        setData({ ...preparedData, loading: false });
      } catch (err) {
        console.error("Dashboard consolidated fetch error:", err);
        setData(prev => ({ ...prev, loading: false }));
      }
    };

    fetchData();
  }, [user]);

  const todaySessions = useMemo(() => {
    const now = new Date();
    const days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
    const todayName = days[now.getDay()];
    return data.schedule.filter(s => String(s.jour).trim().toLowerCase() === todayName.toLowerCase())
      .sort((a, b) => a.heure_debut.localeCompare(b.heure_debut));
  }, [data.schedule]);

  const liveSession = useMemo(() => {
    const now = new Date();
    const currentTime = now.getHours() + now.getMinutes() / 60;
    return todaySessions.find(s => {
      const [sh, sm] = s.heure_debut.split(':').map(Number);
      const [eh, em] = s.heure_fin.split(':').map(Number);
      const start = sh + sm / 60;
      const end = eh + em / 60;
      return currentTime >= start && currentTime <= end;
    });
  }, [todaySessions]);

  const statsList = useMemo(() => {
    if (!data.stats) return [];
    return [
      { label: 'Assiduité', val: `${data.stats.presence_rate}%`, icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
      { label: "Absences", val: data.stats.total_absences, icon: Activity, color: 'text-rose-600', bg: 'bg-rose-50' },
      { label: 'Ressources', val: data.stats.total_resources, icon: Zap, color: 'text-amber-600', bg: 'bg-amber-50' },
      { label: 'Moyenne Actuelle', val: data.stats.average_note, icon: Star, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    ];
  }, [data.stats]);

  return (
    <motion.div 
      className="space-y-8 pb-12"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {/* Hero Section */}
      <motion.div variants={itemVariants}>
        <WelcomeCard user={user} />
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {data.loading && !data.stats ? (
          Array(4).fill(0).map((_, i) => <StatSkeleton key={i} />)
        ) : (
          statsList.map((stat, i) => (
            <motion.div 
              key={i} 
              variants={itemVariants}
              className="group p-6 bg-white rounded-[1.5rem] border border-slate-200/60 hover:border-indigo-200 transition-all duration-300 shadow-sm hover:shadow-md cursor-default"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color}`}>
                  <stat.icon size={22} />
                </div>
                <ArrowUpRight size={18} className="text-slate-300 group-hover:text-indigo-400 transition-colors" />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">{stat.label}</p>
                <h3 className="text-2xl font-black text-slate-900 leading-none">{stat.val}</h3>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-10">
          <section>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="h-6 w-1.5 bg-indigo-600 rounded-full"></div>
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">Focus Quotidien</h2>
              </div>
              <div className="px-3 py-1 bg-slate-100 rounded-full text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                <Clock size={12} />
                {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Suspense fallback={<Skeleton className="h-64 rounded-[2rem]" />}>
                <LiveClassCard session={liveSession} />
              </Suspense>
              <Suspense fallback={<Skeleton className="h-64 rounded-[2rem]" />}>
                <AttendanceCard stats={{ rate: data.stats?.presence_rate || 100 }} />
              </Suspense>
            </div>
          </section>

          <section>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="h-6 w-1.5 bg-amber-500 rounded-full"></div>
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">Ressources & Documents</h2>
              </div>
              <button className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest hover:text-indigo-700 transition-colors">
                Voir tout
              </button>
            </div>
            <Suspense fallback={<Skeleton className="h-80 rounded-[2rem]" />}>
              <ResourcesCard resources={data.resources} />
            </Suspense>
          </section>
        </div>

        <aside className="lg:col-span-4">
          <div className="sticky top-24 space-y-10">
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-6 w-1.5 bg-slate-900 rounded-full"></div>
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">Planning du jour</h2>
              </div>
              <Suspense fallback={<Skeleton className="h-[400px] rounded-[2rem]" />}>
                <ScheduleCard daySessions={todaySessions} />
              </Suspense>
            </section>
          </div>
        </aside>
      </div>
    </motion.div>
  );
}
