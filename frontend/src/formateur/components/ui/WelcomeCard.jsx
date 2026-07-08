import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import styles from './WelcomeCard.module.css';

export default function WelcomeCard({ user }) {
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bonjour';
    if (hour < 18) return 'Bon après-midi';
    return 'Bonsoir';
  }, []);

  const name = user?.prenom || 'Formateur';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className={styles.card}
    >
      <div className={styles.ambient} />
      
      <div className={styles.content}>
        <div className={styles.badge}>
          <span className={styles.pulse} />
          Espace Formateur
        </div>
        
        <h2 className={styles.title}>
          {greeting}, <span className={styles.accent}>{name}</span>
        </h2>
        
        <p className={styles.subtitle}>
          Heureux de vous revoir. Votre emploi du temps et vos ressources pédagogiques sont prêts pour aujourd'hui.
        </p>
      </div>

      <div className={styles.timeContainer}>
        <div className={styles.time}>
          {new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
        </div>
        <div className={styles.date}>
          {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
        </div>
      </div>
    </motion.div>
  );
}
