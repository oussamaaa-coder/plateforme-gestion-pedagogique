import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import styles from './PageHeader.module.css';

/**
 * PageHeader - Ultra-Modern SaaS Dashboard Header
 * @param {Object} props
 * @param {Array} props.breadcrumb - Array of { label, path }
 * @param {string} props.title - Main title
 * @param {string} props.subtitle - Optional description
 * @param {React.ReactNode} props.icon - Optional icon component
 * @param {React.ReactNode} props.actions - Optional action buttons (right side)
 * @param {React.ReactNode} props.tabs - Optional navigation tabs (bottom side)
 */
export default function PageHeader({ breadcrumb, title, subtitle, icon, actions, tabs }) {
  return (
    <div className={styles.headerWrapper}>
      <div className={styles.container}>
        {/* Breadcrumb Row - More discrete and elevated */}
        {breadcrumb && (
          <nav className={styles.breadcrumb}>
            {breadcrumb.map((item, index) => (
              <React.Fragment key={index}>
                {item.path ? (
                  <Link to={item.path} className={styles.breadcrumbLink}>{item.label}</Link>
                ) : (
                  <span className={styles.breadcrumbActive}>{item.label}</span>
                )}
                {index < breadcrumb.length - 1 && (
                  <ChevronRight size={10} className={styles.separator} />
                )}
              </React.Fragment>
            ))}
          </nav>
        )}

        <div className={styles.mainRow}>
          <div className={styles.titleSection}>
            {icon && <div className={styles.iconBox}>{icon}</div>}
            <div className={styles.textStack}>
              <h1 className={styles.title}>{title}</h1>
              {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
            </div>
          </div>

          {actions && (
            <div className={styles.actionsBox}>
              {actions}
            </div>
          )}
        </div>

        {tabs && (
          <div className={styles.tabsSection}>
            {tabs}
          </div>
        )}
      </div>
    </div>
  );
}
