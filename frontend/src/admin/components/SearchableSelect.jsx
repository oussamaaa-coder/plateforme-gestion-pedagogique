import React, { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import './SearchableSelect.css';

/**
 * SearchableSelect — Un champ texte de recherche au-dessus d'un <select> natif filtré.
 *
 * Usage :
 *   <SearchableSelect
 *       options={[{ value: '1', label: 'Mohamed Ali Takhsoaui', subtitle: 'ali@mail.com' }, ...]}
 *       value={formData.user_id}
 *       onChange={(val) => setFormData(prev => ({ ...prev, user_id: val }))}
 *       placeholder="Rechercher un étudiant..."
 *       required
 *   />
 *
 * Props :
 *   - options    : Array<{ value: string, label: string, subtitle?: string }>
 *   - value      : string (valeur sélectionnée)
 *   - onChange    : (value: string) => void
 *   - placeholder : string (placeholder de l'input de recherche)
 *   - required   : boolean
 *   - disabled   : boolean
 *   - selectSize : number (nombre de lignes visibles dans le select, défaut 5)
 */
const SearchableSelect = ({
    options = [],
    value = '',
    onChange,
    placeholder = 'Rechercher...',
    required = false,
    disabled = false,
    selectSize = 5
}) => {
    const [search, setSearch] = useState('');
    const inputRef = useRef(null);
    const selectRef = useRef(null);

    // ------------------------------------------------------------------
    // Normaliser une chaîne pour la comparaison (minuscules, sans accents)
    // ------------------------------------------------------------------
    const normalize = useCallback((str) => {
        return str
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '');
    }, []);

    // ------------------------------------------------------------------
    // Filtrer les options en fonction du texte saisi
    // ------------------------------------------------------------------
    const filteredOptions = useMemo(() => {
        if (!search.trim()) return options;

        const terms = normalize(search).split(/\s+/).filter(Boolean);

        return options.filter((opt) => {
            const haystack = normalize(
                `${opt.label} ${opt.subtitle || ''}`
            );
            // Toutes les mots saisis doivent apparaître
            return terms.every((term) => haystack.includes(term));
        });
    }, [search, options, normalize]);

    // ------------------------------------------------------------------
    // Synchroniser le champ de recherche avec la valeur sélectionnée
    // ------------------------------------------------------------------
    useEffect(() => {
        if (value) {
            const selectedOpt = options.find(opt => opt.value === String(value));
            if (selectedOpt) {
                setSearch(selectedOpt.label);
            }
        } else {
            setSearch('');
        }
    }, [value, options]);

    // ------------------------------------------------------------------
    // Gestion de la saisie de recherche
    // ------------------------------------------------------------------
    const handleSearchChange = (e) => {
        setSearch(e.target.value);
        // Si l'utilisateur modifie la recherche, on efface la sélection actuelle
        // pour l'obliger à choisir un nouvel élément de la liste filtrée.
        if (value && onChange) {
            onChange('');
        }
    };

    // ------------------------------------------------------------------
    // Gestion de la sélection dans le <select>
    // ------------------------------------------------------------------
    const handleSelectChange = (e) => {
        if (onChange) onChange(e.target.value);
    };

    // ------------------------------------------------------------------
    // Navigation clavier : flèche vers le bas pour focus le select
    // ------------------------------------------------------------------
    const handleInputKeyDown = (e) => {
        if (e.key === 'ArrowDown' && filteredOptions.length > 0) {
            e.preventDefault();
            selectRef.current?.focus();
        }
    };

    // ------------------------------------------------------------------
    // Bouton de réinitialisation de la recherche
    // ------------------------------------------------------------------
    const clearSearch = () => {
        setSearch('');
        inputRef.current?.focus();
    };

    return (
        <div className="searchable-select-wrapper animate__animated animate__fadeIn">
            {/* ---------- Champ de recherche ---------- */}
            <div className="searchable-select-search-box">
                <svg
                    className="search-icon"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>

                <input
                    ref={inputRef}
                    type="text"
                    className="search-input"
                    placeholder={placeholder}
                    value={search}
                    onChange={handleSearchChange}
                    onKeyDown={handleInputKeyDown}
                    disabled={disabled}
                    autoComplete="off"
                />

                {search && (
                    <button
                        type="button"
                        className="clear-btn"
                        onClick={clearSearch}
                        tabIndex={-1}
                        title="Effacer"
                    >
                        ×
                    </button>
                )}
            </div>

            {/* ---------- Header Info / Compteur ---------- */}
            <div className="searchable-select-count">
                <span className="small text-muted">
                    {value ? "Élément sélectionné" : (search.trim() ? "Résultats filtrés" : "Tous les éléments")}
                </span>
                {!value && search.trim() && (
                    <span className="count-highlight ms-2">
                        {filteredOptions.length} / {options.length}
                    </span>
                )}
            </div>

            {/* ---------- Select natif filtré ---------- */}
            {filteredOptions.length === 0 && search.trim() ? (
                <div className="searchable-select-empty">
                    Aucun résultat trouvé pour « {search} »
                </div>
            ) : (
                <select
                    ref={selectRef}
                    className="filtered-select"
                    value={value}
                    onChange={handleSelectChange}
                    required={required}
                    disabled={disabled}
                    size={selectSize}
                >
                    <option value="">— Veuillez choisir —</option>
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
