import React, { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import styles from './SearchableSelect.module.css';

const SearchableSelect = ({
    options = [],
    value = '',
    onChange,
    placeholder = 'Rechercher...',
    required = false,
    disabled = false,
    selectSize = 5,
    compact = false
}) => {
    const [search, setSearch] = useState('');
    const inputRef = useRef(null);
    const selectRef = useRef(null);

    const normalize = useCallback((str) => {
        return str
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '');
    }, []);

    const filteredOptions = useMemo(() => {
        if (!search.trim()) return options;
        const terms = normalize(search).split(/\s+/).filter(Boolean);
        return options.filter((opt) => {
            const haystack = normalize(`${opt.label} ${opt.subtitle || ''}`);
            return terms.every((term) => haystack.includes(term));
        });
    }, [search, options, normalize]);

    useEffect(() => {
        if (value) {
            const selectedOpt = options.find(opt => opt.value === String(value));
            if (selectedOpt) setSearch(selectedOpt.label);
        } else {
            setSearch('');
        }
    }, [value, options]);

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
        if (value && onChange) onChange('');
    };

    const handleSelectChange = (e) => {
        if (onChange) onChange(e.target.value);
    };

    const clearSearch = () => {
        setSearch('');
        inputRef.current?.focus();
    };

    return (
        <div className={`${styles.wrapper} ${compact ? styles.compact : ''}`}>
            <div className={styles.searchBox}>
                <Search size={14} className={styles.searchIcon} />
                <input
                    ref={inputRef}
                    type="text"
                    className={styles.input}
                    placeholder={placeholder}
                    value={search}
                    onChange={handleSearchChange}
                    disabled={disabled}
                    autoComplete="off"
                />
                {search && (
                    <button type="button" className={styles.clearBtn} onClick={clearSearch}>
                        <X size={14} />
                    </button>
                )}
            </div>

            {!compact && (
                <div className={styles.info}>
                    <span>{value ? "Sélectionné" : (search.trim() ? "Filtrés" : "Tous")}</span>
                    {!value && search.trim() && (
                        <span style={{ color: 'var(--fm-accent, var(--st-accent))' }}>
                            {filteredOptions.length} / {options.length}
                        </span>
                    )}
                </div>
            )}

            {filteredOptions.length === 0 && search.trim() ? (
                <div style={{ fontSize: '11px', padding: '12px', textAlign: 'center', opacity: 0.5 }}>Aucun résultat</div>
            ) : (
                <select
                    ref={selectRef}
                    className={styles.select}
                    value={value}
                    onChange={handleSelectChange}
                    required={required}
                    disabled={disabled}
                    size={compact ? Math.min(selectSize, 3) : selectSize}
                >
                    <option value="">— Choisir —</option>
                    {filteredOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label} {opt.subtitle ? `(${opt.subtitle})` : ''}
                        </option>
                    ))}
                </select>
            )}
        </div>
    );
};

export default SearchableSelect;
