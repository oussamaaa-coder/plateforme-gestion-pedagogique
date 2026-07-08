import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, FolderOpen, BookOpen, ChevronRight } from 'lucide-react';
import styles from './DashboardWidgets.module.css';

export default function ResourcesCard({ resources = [] }) {
  const recent = resources.slice(0, 4);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={styles.card}
    >
      <div className={styles.header}>
        <div className={styles.titleArea}>
          <div className={styles.iconBox} style={{ color: 'var(--fm-warning)', background: 'var(--fm-warning-bg)' }}>
            <FolderOpen size={20} />
          </div>
          <div>
            <h3 className={styles.titleLabel}>Ressources</h3>
            <p className={styles.subtitleLabel}>Derniers partages</p>
          </div>
        </div>
        <button className={styles.footerLink} style={{ padding: 0 }}>
          <BookOpen size={18} />
        </button>
      </div>

      <div className={styles.list}>
        {recent.length === 0 ? (
          <div className={styles.empty}>
            <FileText size={32} className={styles.emptyIcon} />
            <p className={styles.emptyText}>Aucun fichier récent</p>
          </div>
        ) : (
          recent.map((res, i) => (
            <motion.div 
              key={res.id || i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className={styles.item}
            >
              <div className={styles.itemIcon} style={{ color: res.type === 'Cours' ? '#3b82f6' : '#ef4444' }}>
                <FileText size={16} />
              </div>
              
              <div className={styles.itemContent}>
                <p className={styles.itemName}>{res.titre}</p>
                <div className={styles.itemMeta}>
                  <span className={styles.metaText}>{res.module?.nom || 'Support'}</span>
                  <span className={styles.metaText}>•</span>
                  <span className={styles.metaText}>PDF / DOCX</span>
                </div>
              </div>

              <a 
                href={res.fichier_url || `http://127.0.0.1:8000/storage/${res.fichier}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className={styles.itemAction}
              >
                <Download size={14} />
              </a>
            </motion.div>
          ))
        )}
      </div>

      <div className={styles.footer}>
        <p className={styles.footerCount}>{resources.length} fichiers partagés</p>
        <button className={styles.footerLink}>
          Explorateur <ChevronRight size={14} />
        </button>
      </div>
    </motion.div>
  );
}
