import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import StudentSidebar from './StudentSidebar';
import StudentHeader from './StudentHeader';

/**
 * StudentLayout Shell
 * Modernized with premium spacing and layout.
 */
export default function StudentLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  return (
    <div className="student-scope min-h-screen bg-[#f8fafc] text-[#1e293b]">
      {/* Mobile Backdrop */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      <div className="flex min-h-screen">
        {/* Sidebar Slot */}
        <div className={`
          fixed inset-y-0 left-0 z-50 w-72 transform bg-white border-r border-slate-200 transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <StudentSidebar />
        </div>

        {/* Main Content */}
        <main className="flex-1 flex flex-col min-w-0 bg-[#f8fafc]">
          <StudentHeader toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
          
          <div className="flex-1 p-4 lg:p-8 max-w-[1600px] mx-auto w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
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

