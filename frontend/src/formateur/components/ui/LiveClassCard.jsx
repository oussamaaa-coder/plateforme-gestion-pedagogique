import React from 'react';
import { motion } from 'framer-motion';
import { Video, Clock, MonitorPlay, Users } from 'lucide-react';
import styles from './LiveClassCard.module.css';

export default function LiveClassCard({ session }) {
  if (!session) {
    return (
      <div className={styles.empty}>
        <div className={styles.emptyIcon}>
          <Video size={32} />
        </div>
        <p className={styles.emptyText}>Aucune séance en direct</p>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className={styles.card}
    >
      <div className={styles.header}>
        <div className={styles.liveBadge}>
          <div className={styles.dot} />
          <span className={styles.liveLabel}>En Direct</span>
        </div>
        <div className={styles.platform}>
          <MonitorPlay size={14} color="var(--fm-text-muted)" />
          <span className={styles.platformText}>Virtual Room</span>
        </div>
      </div>

      <div className={styles.body}>
        <p className={styles.moduleLabel}>Cours en cours</p>
        <h3 className={styles.moduleName}>{session.module?.nom}</h3>
      </div>

      <div className={styles.footer}>
        <div className={styles.statItem}>
          <div className={styles.statHeader}>
            <Users size={14} />
            <span className={styles.statLabel}>Groupe</span>
          </div>
          <p className={styles.statValue}>{session.groupe?.nom || 'N/A'}</p>
        </div>
        
        <div className={styles.statItem}>
          <div className={styles.statHeader}>
            <Clock size={14} />
            <span className={styles.statLabel}>Horaire</span>
          </div>
          <p className={styles.statValue}>{session.heure_debut} - {session.heure_fin}</p>
        </div>
      </div>

      <div className={styles.accentBg} />
    </motion.div>
  );
}
