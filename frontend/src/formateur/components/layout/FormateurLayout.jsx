import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import FormateurSidebar from './FormateurSidebar';
import FormateurHeader from './FormateurHeader';
import styles from './FormateurLayout.module.css';

// Import Formateur Scoped Theme
import '../../styles/theme.css';

/**
 * FormateurLayout Shell
 * SaaS Architecture
 */
export default function FormateurLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  return (
    <div className={`formateur-scope ${styles.shell}`}>
      {/* Sidebar - Desktop is fixed, Mobile is drawer */}
      <div className={`${styles.sidebarSlot} ${sidebarOpen ? styles.sidebarOpen : ''}`}>
        <FormateurSidebar />
      </div>

      {/* Mobile Backdrop */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={styles.backdrop}
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      <div className={styles.contentArea}>
        <FormateurHeader toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        
        <main className={styles.main}>
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className={styles.fullHeight}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>

      </div>
    </div>
  );
}
