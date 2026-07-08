import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, MapPin, ChevronRight, LayoutDashboard } from 'lucide-react';
import styles from './DashboardWidgets.module.css';

export default function ScheduleCard({ daySessions = [] }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={styles.card}
    >
      <div className={styles.header}>
        <div className={styles.titleArea}>
          <div className={styles.iconBox}>
            <Calendar size={20} />
          </div>
          <div>
            <h3 className={styles.titleLabel}>Agenda du Jour</h3>
            <p className={styles.subtitleLabel}>Planning quotidien</p>
          </div>
        </div>
        <button className={styles.footerLink} style={{ padding: 0 }}>
          <LayoutDashboard size={18} />
        </button>
      </div>

      <div className={styles.list}>
        <AnimatePresence mode="popLayout">
          {daySessions.length === 0 ? (
            <div className={styles.empty}>
              <Clock size={32} className={styles.emptyIcon} />
              <p className={styles.emptyText}>Aucune séance prévue</p>
            </div>
          ) : (
            daySessions.map((session, i) => (
              <motion.div 
                key={session.id || i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className={styles.item}
              >
                <div className={styles.itemIcon}>
                  <span style={{ fontSize: '11px', fontWeight: 900 }}>
                    {session.heure_debut.split(':')[0]}h
                  </span>
                </div>
                
                <div className={styles.itemContent}>
                  <p className={styles.itemName}>{session.module?.nom}</p>
                  <div className={styles.itemMeta}>
                    <span className={styles.metaText}>
                      <MapPin size={10} style={{ marginRight: 4 }} />
                      {session.salle || 'À distance'}
                    </span>
                    <span className={styles.metaText}>•</span>
                    <span className={styles.metaText}>
                      {session.heure_debut} - {session.heure_fin}
                    </span>
                  </div>
                </div>

                <div className={styles.itemAction}>
                  <ChevronRight size={16} />
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      <div className={styles.footer}>
        <p className={styles.footerCount}>{daySessions.length} sessions aujourd'hui</p>
        <button className={styles.footerLink}>
          Détails <ChevronRight size={14} />
        </button>
      </div>
    </motion.div>
  );
}
