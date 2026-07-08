import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import styles from './CustomSelect.module.css';

/**
 * CustomSelect - A premium styled dropdown component
 * @param {Object} props
 * @param {Array} props.options - [{ value, label }]
 * @param {string} props.value - Current value
 * @param {function} props.onChange - Handler
 * @param {string} props.placeholder - Default label
 * @param {React.ReactNode} props.icon - Leading icon
 */
export default function CustomSelect({ options, value, onChange, placeholder = "Sélectionner...", icon }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  const selectedOption = options.find(opt => String(opt.value) === String(value));

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (val) => {
    onChange(val);
    setIsOpen(false);
  };

  return (
    <div className={styles.container} ref={containerRef}>
      <button 
        type="button"
        className={`${styles.trigger} ${isOpen ? styles.triggerActive : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className={styles.triggerLeft}>
          {icon && <span className={styles.icon}>{icon}</span>}
          <span className={styles.label}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </div>
        <ChevronDown size={16} className={`${styles.chevron} ${isOpen ? styles.chevronRotated : ''}`} />
      </button>

      {isOpen && (
        <div className={styles.menu}>
          {options.length === 0 ? (
            <div className={styles.empty}>Aucune option</div>
          ) : (
            <div className={styles.optionsList}>
              {options.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  className={`${styles.option} ${String(opt.value) === String(value) ? styles.optionSelected : ''}`}
                  onClick={() => handleSelect(opt.value)}
                >
                  <span className={styles.optionLabel}>{opt.label}</span>
                  {String(opt.value) === String(value) && <Check size={14} className={styles.checkIcon} />}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
