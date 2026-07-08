import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';

// Import Admin Scoped Design System
import '../../styles/theme.css';
import '../../styles/layout.css';
import '../../styles/sidebar.css';
import '../../styles/components.css';

/**
 * AdminLayout Shell
 * Orchestrates the Admin module UI with the new Premium Design System.
 */
export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="admin-scope">
      <div className="admin-layout-container">
        
        {/* Mobile Sidebar Overlay */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="sidebar-overlay"
              onClick={() => setSidebarOpen(false)}
            />
          )}
        </AnimatePresence>

        {/* Sidebar Navigation */}
        <div className={`admin-sidebar-fixed ${sidebarOpen ? 'open' : ''}`}>
          <AdminSidebar />
        </div>

        {/* Main Content Area */}
        <main className="admin-main-wrapper">
          <nav className="admin-navbar">
            <AdminHeader toggleSidebar={toggleSidebar} />
          </nav>
          
          <div className="admin-content-inner">
            {/* Animated Page Transitions */}
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </div>
        </main>

      </div>
    </div>
  );
}
