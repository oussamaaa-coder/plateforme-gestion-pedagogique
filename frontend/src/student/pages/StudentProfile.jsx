import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Mail, 
  Hash, 
  Users as UsersIcon, 
  Calendar, 
  MapPin, 
  ShieldCheck, 
  GraduationCap, 
  ChevronRight,
  Settings as SettingsIcon,
  Bell,
  Lock,
  Award,
  Shield,
  Palette
} from 'lucide-react';
import { useAuth } from '../../admin/context/AuthContext';
import { fullName, getInitials } from '../../core';
import Skeleton from '../../core/components/ui/Skeleton';

export default function StudentProfile() {
  const { user, loading } = useAuth();
  
  const studentData = useMemo(() => ({
    name: fullName(user),
    initials: getInitials(fullName(user)),
    filiere: user?.groupe?.filiere?.nom || 'ISTA NTIC',
    annee: user?.annee_scolaire || '2024-2026',
    cne: user?.cin || 'G00000000',
    email: user?.email || 'email@ista.ma',
    groupe_nom: user?.groupe?.nom || 'Sans groupe',
  }), [user]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto space-y-8 pb-12">
        <Skeleton className="h-64 rounded-[2.5rem]" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-32 rounded-[2rem]" />
          <Skeleton className="h-32 rounded-[2rem]" />
          <Skeleton className="h-32 rounded-[2rem]" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
           <div className="lg:col-span-8">
              <Skeleton className="h-96 rounded-[2rem]" />
           </div>
           <div className="lg:col-span-4">
              <Skeleton className="h-96 rounded-[2rem]" />
           </div>
        </div>
      </div>
    );
  }

  const infoCards = [
    { label: 'CNE / Massar', value: studentData.cne, icon: Hash, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Groupe / Classe', value: studentData.groupe_nom, icon: UsersIcon, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Email Académique', value: studentData.email, icon: Mail, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-[2.5rem] bg-slate-900 p-8 lg:p-12 text-white shadow-2xl shadow-slate-200"
      >
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-[100px] -mr-48 -mt-48 pointer-events-none animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] -ml-32 -mb-32 pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 lg:gap-12 text-center md:text-left">
          <div className="w-32 h-32 lg:w-40 lg:h-40 rounded-[2.5rem] bg-indigo-600 flex items-center justify-center text-4xl lg:text-5xl font-black shadow-2xl shadow-indigo-500/40 border-4 border-indigo-400/30">
            {studentData.initials}
          </div>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 backdrop-blur-md">
                <Shield size={12} className="text-indigo-300" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-100">Profil Étudiant Vérifié</span>
              </div>
              <h1 className="text-3xl lg:text-5xl font-black tracking-tight">{studentData.name}</h1>
            </div>
 
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 lg:gap-6 text-indigo-100/80">
              <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-2xl border border-white/5 backdrop-blur-sm">
                <GraduationCap size={18} className="text-indigo-400" />
                <span className="text-sm font-bold">{studentData.filiere}</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-2xl border border-white/5 backdrop-blur-sm">
                <Calendar size={18} className="text-indigo-400" />
                <span className="text-sm font-bold">{studentData.annee}</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-2xl border border-white/5 backdrop-blur-sm">
                <MapPin size={18} className="text-indigo-400" />
                <span className="text-sm font-bold">ISTA NTIC Centre</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
 
      {/* Info Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {infoCards.map((card, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="group bg-white p-6 rounded-[2rem] border border-slate-200/60 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all cursor-default"
          >
            <div className={`w-12 h-12 rounded-2xl ${card.bg} ${card.color} flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform`}>
              <card.icon size={24} />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none">{card.label}</p>
              <p className="text-lg font-black text-slate-900 leading-tight truncate">{card.value}</p>
            </div>
          </motion.div>
        ))}
      </div>
 
      {/* Bottom Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Settings Grid */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center gap-3">
            <div className="h-6 w-1.5 bg-indigo-600 rounded-full"></div>
            <h3 className="text-xl font-bold text-slate-900">Paramètres & Sécurité</h3>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: 'Informations', sub: 'Données personnelles', icon: SettingsIcon, color: 'text-indigo-600', bg: 'bg-indigo-50' },
              { label: 'Notifications', sub: 'Préférences push', icon: Bell, color: 'text-rose-600', bg: 'bg-rose-50' },
              { label: 'Sécurité', sub: 'Mot de passe & Auth', icon: Lock, color: 'text-amber-600', bg: 'bg-amber-50' },
              { label: 'Apparence', sub: 'Thème & Langue', icon: Palette, color: 'text-emerald-600', bg: 'bg-emerald-50' },
            ].map((item, i) => (
              <button key={i} className="group bg-white p-4 rounded-2xl border border-slate-200/60 hover:border-indigo-200 shadow-sm transition-all flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl ${item.bg} ${item.color} flex items-center justify-center group-hover:scale-105 transition-transform`}>
                    <item.icon size={20} />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-bold text-slate-900">{item.label}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{item.sub}</p>
                  </div>
                </div>
                <ChevronRight size={16} className="text-slate-300 group-hover:text-indigo-500 group-hover:translate-x-0.5 transition-all" />
              </button>
            ))}
          </div>
        </div>
 
        {/* Progression Section */}
        <div className="lg:col-span-4 space-y-6">
          <div className="flex items-center gap-3">
            <div className="h-6 w-1.5 bg-emerald-500 rounded-full"></div>
            <h3 className="text-xl font-bold text-slate-900">Niveau & Rang</h3>
          </div>
 
          <div className="bg-white p-8 rounded-[2rem] border border-slate-200/60 shadow-sm space-y-8 text-center flex flex-col items-center">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-emerald-50 border-4 border-white shadow-xl shadow-emerald-100 flex items-center justify-center group">
                <Award size={48} className="text-emerald-500 group-hover:scale-110 transition-transform" />
              </div>
              <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-indigo-600 text-white rounded-full border-4 border-white flex items-center justify-center font-black text-sm shadow-lg">
                12
              </div>
            </div>
 
            <div className="space-y-1">
              <h4 className="text-2xl font-black text-slate-900">Senior Hunter</h4>
              <p className="text-xs font-bold text-emerald-500 uppercase tracking-[0.2em]">Niveau 4 • Top 5% National</p>
            </div>
 
            <div className="w-full space-y-3">
              <div className="relative h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="absolute inset-y-0 left-0 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.3)]" style={{ width: '65%' }}></div>
              </div>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">850 XP avant le Niveau 13</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
