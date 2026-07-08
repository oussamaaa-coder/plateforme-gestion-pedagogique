import React from 'react';
import { motion } from 'framer-motion';

/**
 * core/components/ui/LoadingSpinner.jsx
 * Adapts to the current module scope (admin, formateur, or student)
 */
export default function LoadingSpinner({ message = "Chargement...", fullPage = false }) {
  // We detect the scope via a CSS class on the body or a parent, 
  // but here we can just use the generic spinner class which is theme-aware if we set it up.
  // Actually, let's just use the current scope's spinner.
  
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      gap: '24px',
      padding: fullPage ? '0' : '60px 0',
      position: fullPage ? 'fixed' : 'relative',
      inset: fullPage ? '0' : 'auto',
      zIndex: fullPage ? 1000 : 1,
      background: fullPage ? 'rgba(0,0,0,0.5)' : 'transparent',
      backdropFilter: fullPage ? 'blur(10px)' : 'none'
    }}>
      <div className="fm-spinner st-spinner" /> {/* Will use whichever is defined in scope */}
      
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{ 
          fontSize: '11px', 
          fontWeight: '800', 
          textTransform: 'uppercase', 
          letterSpacing: '0.2em',
          color: 'var(--fm-text-muted, var(--st-text-muted))'
        }}
      >
        {message}
      </motion.p>
    </div>
  );
}
