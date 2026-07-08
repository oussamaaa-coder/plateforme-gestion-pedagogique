import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Calendar, 
  FileText, 
  ArrowRight,
  Clock,
  BookOpen,
  ChevronRight,
  UserSquare2,
  LayoutDashboard
} from 'lucide-react';
import { useAuth } from '../../admin/context/AuthContext';
import { getFormateurDashboard } from '../../admin/api/dashboard';
import styles from './FormateurDashboard.module.css';
import PageHeader from '../../core/components/ui/PageHeader';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 }
};

export default function FormateurDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const resp = await getFormateurDashboard();
        if (resp.success) {
          setData(resp.data);
        }
      } catch (err) {
        console.error("Failed to load formateur data", err);
      } finally {
        // Keep loading for at least 600ms for smooth skeleton transition
        setTimeout(() => setLoading(false), 600);
      }
    }
    loadData();
  }, []);

  const stats = [
    { 
      label: 'Mes groupes', 
      value: data?.stats?.my_groups_count ?? (loading ? null : 0), 
      icon: <Users size={22} />, 
      color: '#2563EB', 
      trend: data?.stats?.my_groups_count ? `+${data.stats.my_groups_count} actifs` : '--' 
    },
    { 
      label: 'Total étudiants', 
      value: data?.stats?.total_students ?? (loading ? null : 0), 
      icon: <UserSquare2 size={22} />, 
      color: '#10B981', 
      trend: data?.stats?.total_students ? 'Actifs' : '--' 
    },
    { 
      label: "Séances d'aujourd'hui", 
      value: data?.today_schedule?.length ?? (loading ? null : 0), 
      icon: <Calendar size={22} />, 
      color: '#F59E0B', 
      trend: data?.today_schedule?.length ? `Prochaine à ${data.today_schedule[0].heure_debut}` : '--' 
    },
    { 
      label: 'Ressources partagées', 
      value: data?.recent_resources?.length ?? (loading ? null : 0), 
      icon: <BookOpen size={22} />, 
      color: '#8B5CF6', 
      trend: data?.recent_resources?.length ? 'Documents' : '--' 
    },
  ];

  return (
    <motion.div 
      className={styles.pageWrapper}
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <PageHeader 
        breadcrumb={[{ label: 'Portail' }, { label: 'Tableau de bord' }]}
        title="Tableau de bord"
        subtitle={`Bienvenue, ${user?.prenom || 'Formateur'}. Voici un aperçu de vos activités pédagogiques aujourd'hui.`}
        icon={<LayoutDashboard size={24} />}
      />
      <div className={styles.pageBody}>
        {/* Stats Grid */}
        <div className={styles.statsGrid}>
          {stats.map((stat, idx) => (
            <motion.div key={idx} className={styles.statCard} variants={itemVariants}>
              <div className={styles.statHeader}>
                <div className={styles.statIcon} style={{ color: stat.color, backgroundColor: `${stat.color}10` }}>
                  {stat.icon}
                </div>
                {loading ? (
                  <div className="skeleton w-16 h-5" />
                ) : (
                  <span className={styles.statTrend}>{stat.trend}</span>
                )}
              </div>
              <div className={styles.statBody}>
                {loading ? (
                  <div className="skeleton w-12 h-10 mb-2" />
                ) : (
                  <h3 className={styles.statValue}>{stat.value || (stat.value === 0 ? '0' : '--')}</h3>
                )}
                {loading ? (
                  <div className="skeleton w-24 h-4" />
                ) : (
                  <p className={styles.statLabel}>{stat.label}</p>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        <div className={styles.mainGrid}>
          {/* Today's Schedule */}
          <motion.div className={styles.sectionCard} variants={itemVariants}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionTitle}>
                <Clock size={20} className="text-primary" strokeWidth={2.5} />
                <h2>Emploi du temps d'aujourd'hui</h2>
              </div>
              <button className={styles.viewAll}>Voir tout <ArrowRight size={16} /></button>
            </div>
            <div className={styles.scheduleList}>
              {loading ? (
                [1, 2, 3].map(i => (
                  <div key={i} className={`${styles.scheduleItem} skeleton`}>
                    <div className="h-12 w-full" />
                  </div>
                ))
              ) : data?.today_schedule?.length > 0 ? (
                data.today_schedule.map((session, idx) => (
                  <div key={idx} className={styles.scheduleItem}>
                    <div className={styles.timeSlot}>
                      <span className={styles.startTime}>{session.heure_debut}</span>
                      <span className={styles.endTime}>{session.heure_fin}</span>
                    </div>
                    <div className={styles.sessionInfo}>
                      <h4>{session.module?.nom || 'Module inconnu'}</h4>
                      <p>{session.groupe?.nom} • Salle {session.salle}</p>
                    </div>
                    <div className={styles.sessionStatus}>
                      <span className={styles.statusBadge}>À venir</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className={styles.emptyState}>
                  <Calendar size={48} strokeWidth={1.5} />
                  <p>Aucune séance prévue pour aujourd'hui.</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Recent Resources */}
          <motion.div className={styles.sectionCard} variants={itemVariants}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionTitle}>
                <FileText size={20} className="text-primary" strokeWidth={2.5} />
                <h2>Ressources récentes</h2>
              </div>
              <button className={styles.viewAll}>Gérer <ArrowRight size={16} /></button>
            </div>
            <div className={styles.resourceList}>
              {loading ? (
                [1, 2, 3, 4].map(i => (
                  <div key={i} className="flex items-center gap-4 p-3">
                    <div className="skeleton w-10 h-10 rounded-lg" />
                    <div className="flex-1 space-y-2">
                      <div className="skeleton w-3/4 h-4" />
                      <div className="skeleton w-1/2 h-3" />
                    </div>
                  </div>
                ))
              ) : data?.recent_resources?.length > 0 ? (
                data.recent_resources.map((res, idx) => (
                  <div key={idx} className={styles.resourceItem}>
                    <div className={styles.resourceIcon}>
                      <FileText size={20} strokeWidth={2} />
                    </div>
                    <div className={styles.resourceInfo}>
                      <h4>{res.titre}</h4>
                      <p>{res.type} • {new Date(res.created_at).toLocaleDateString()}</p>
                    </div>
                    <ChevronRight size={16} className={styles.resourceChevron} />
                  </div>
                ))
              ) : (
                <div className={styles.emptyState}>
                  <BookOpen size={48} strokeWidth={1.5} />
                  <p>Aucune ressource partagée récemment.</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Footer Info */}
      <footer className="mt-8 pt-8 border-t border-slate-200 flex justify-center">
        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">
          ISTA NTIC • PORTAIL FORMATEUR
        </p>
      </footer>
    </motion.div>
  );
}
