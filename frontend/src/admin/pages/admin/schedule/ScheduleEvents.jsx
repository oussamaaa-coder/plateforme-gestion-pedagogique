import React, { useState, useEffect, useMemo, useCallback } from 'react';

import { listGroupes } from '../../../api/groupes';
import { listTrainers, listAssignments } from '../../../api/trainers';
import { listSchedule, createSchedule, updateSchedule, deleteSchedule, generateSchedule } from '../../../api/schedule';
import { listModules } from '../../../api/modules';
import { listSalles } from '../../../api/salles';
import { toast } from 'react-toastify';
import { Plus, Printer, Calendar, X, Trash2 } from 'lucide-react';
import SearchableSelect from '../../../components/SearchableSelect';
import './Schedule.css';

const ScheduleEvents = () => {
    const [viewMode, setViewMode] = useState(null); // 'groupe' or 'formateur'
    const [loading, setLoading] = useState(false);
    const [items, setItems] = useState([]);
    const [groups, setGroups] = useState([]);
    const [selectedId, setSelectedId] = useState('');
    const [schedule, setSchedule] = useState([]);
    const [modules, setModules] = useState([]);
    const [trainers, setTrainers] = useState([]);
    const [currentEntityName, setCurrentEntityName] = useState('');
    const [assignments, setAssignments] = useState([]);
    const [salles, setSalles] = useState([]);

    // Modal State
    const [showModal, setShowModal] = useState(false);
    const [editingEvent, setEditingEvent] = useState(null);
    const [formData, setFormData] = useState({
        groupe_id: '',
        module_id: '',
        formateur_id: '',
        jour: 'Lundi',
        heure_debut: '08:30',
        heure_fin: '10:30',
        salle: ''
    });

    // Generation State
    const [showGenerateModal, setShowGenerateModal] = useState(false);
    const [genData, setGenData] = useState({
        groupe_ids: [],
        formateur_ids: [],
        salles: [],
        clear_existing: true
    });

    const daysOfWeek = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
    const hoursOptions = Array.from({ length: 22 }, (_, i) => {
        const hour = Math.floor(i / 2) + 8;
        const minute = i % 2 === 0 ? '00' : '30';
        return `${hour.toString().padStart(2, '0')}:${minute}`;
    });

    // Time slots in 30-min increments from 08:30 to 18:30
    const startTime = 8.5; // 08:30
    const timeHeaders = [
        "08:30 09:00", "09:00 09:30", "09:30 10:00", "10:00 10:30", "10:30 11:00",
        "11:00 11:30", "11:30 12:00", "12:00 12:30", "12:30 13:00", "13:00 13:30",
        "13:30 14:00", "14:00 14:30", "14:30 15:00", "15:00 15:30", "15:30 16:00",
        "16:00 16:30", "16:30 17:00", "17:00 17:30", "17:30 18:00", "18:00 18:30"
    ];


    const loadItems = useCallback(async () => {
        setLoading(true);
        try {
            let response;
            if (viewMode === 'groupe') {
                response = await listGroupes({ per_page: 100 });
            } else {
                response = await listTrainers({ per_page: 100 });
            }
            setItems(response.data?.data || []);
        } catch (error) {
            toast.error("Erreur lors du chargement des données.");
        } finally {
            setLoading(false);
        }
    }, [viewMode]);

    const loadModules = useCallback(async () => {
        try {
            const response = await listModules({ per_page: 100 });
            setModules(response.data?.data || []);
        } catch (err) {
            console.error("Failed to load modules", err);
        }
    }, []);

    const loadGroups = useCallback(async () => {
        try {
            const response = await listGroupes({ per_page: 100 });
            setGroups(response.data?.data || []);
        } catch (err) {
            console.error("Failed to load groupes", err);
        }
    }, []);

    const loadTrainers = useCallback(async () => {
        try {
            const response = await listTrainers({ per_page: 100 });
            setTrainers(response.data?.data || []);
        } catch (err) {
            console.error("Failed to load trainers", err);
        }
    }, []);

    const loadSalles = useCallback(async () => {
        try {
            const response = await listSalles();
            // The API may return a flat array or a wrapper object
            if (Array.isArray(response)) {
                setSalles(response);
            } else if (Array.isArray(response?.data)) {
                setSalles(response.data);
            } else {
                setSalles([]);
            }
        } catch (err) {
            console.error("Failed to load salles", err);
        }
    }, []);

    useEffect(() => {
        if (viewMode) {
            loadItems();
            loadGroups();
            loadModules();
            loadTrainers();
            loadSalles();
            setSelectedId('');
            setSchedule([]);
            setCurrentEntityName('');
        }
    }, [viewMode, loadItems, loadGroups, loadModules, loadTrainers, loadSalles]);

    // Pre-load reference data on mount so the generation modal always has data
    useEffect(() => {
        loadGroups();
        loadTrainers();
        loadSalles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Options formatées pour le SearchableSelect
    const itemOptions = useMemo(() =>
        items.map((item) => ({
            value: String(item.id),
            label: viewMode === 'groupe' ? item.nom : `${item.prenom} ${item.nom}`,
            subtitle: item.email || ''
        })),
    [items, viewMode]);

    const selectedGroup = useMemo(() => {
        const groupId = viewMode === 'groupe' ? selectedId : formData.groupe_id;
        if (!groupId) return null;
        return groups.find(g => String(g.id) === String(groupId)) || null;
    }, [viewMode, selectedId, formData.groupe_id, groups]);

    const filteredModules = useMemo(() => {
        if (!selectedGroup) return modules;

        let targetYear = String(selectedGroup.annee || '');
        // Normaliser l'année : on garde juste '1' ou '2' si c'est formaté comme '1ère année'
        if (targetYear.includes('1')) targetYear = '1';
        else if (targetYear.includes('2')) targetYear = '2';

        const filiereId = selectedGroup.filiere_id;

        return modules.filter((m) => {
            const mYear = String(m.annee || '');
            if (targetYear && mYear !== targetYear) return false;
            if (filiereId && String(m.filiere_id) !== String(filiereId)) return false;
            return true;
        });
    }, [modules, selectedGroup]);

    const moduleOptions = useMemo(() => {
        const gid = viewMode === 'groupe' ? selectedId : formData.groupe_id;
        const tid = viewMode === 'formateur' ? selectedId : formData.formateur_id;
        
        let pool = filteredModules;
        if (gid && tid && assignments.length > 0) {
            const allowedIds = assignments
                .filter(a => String(a.groupe_id) === String(gid) && String(a.formateur_id) === String(tid))
                .map(a => a.module_id);
            pool = pool.filter(m => allowedIds.includes(m.id));
        }

        return pool.map((m) => ({
            value: String(m.id),
            label: m.nom,
        }));
    }, [filteredModules, assignments, formData.formateur_id, formData.groupe_id, selectedId, viewMode]);

    const trainerOptions = useMemo(() => {
        const gid = viewMode === 'groupe' ? selectedId : formData.groupe_id;
        const mid = formData.module_id;

        let pool = trainers;
        if (gid && mid && assignments.length > 0) {
            const allowedIds = assignments
                .filter(a => String(a.groupe_id) === String(gid) && String(a.module_id) === String(mid))
                .map(a => a.formateur_id);
            pool = pool.filter(t => allowedIds.includes(t.id));
        }

        return pool.map(t => ({
            value: String(t.id),
            label: `${t.prenom} ${t.nom}`,
            subtitle: t.email || ''
        }));
    }, [trainers, assignments, formData.module_id, formData.groupe_id, selectedId, viewMode]);

    const salleOptions = useMemo(() => {
        return salles.map(s => ({
            value: s.nom, // We store the name in the DB as a string for now as per migration
            label: s.nom,
            subtitle: s.type || ''
        }));
    }, [salles]);

    const handleItemChange = (val) => {
        setSelectedId(val);
        const item = items.find(i => i.id === parseInt(val));
        if (item) {
            const name = viewMode === 'groupe' ? item.nom : `${item.prenom} ${item.nom}`;
            setCurrentEntityName(name);
            loadSchedule(val);
        } else {
            setSchedule([]);
            setCurrentEntityName('');
        }
    };

    useEffect(() => {
        // If the selected group changes, ensure the module selection is still valid.
        if (formData.module_id && !filteredModules.some(m => String(m.id) === String(formData.module_id))) {
            setFormData(prev => ({ ...prev, module_id: '' }));
        }
    }, [filteredModules, formData.module_id]);

    // Charger les assignations et s'assurer que les listes sont pleines quand on ouvre le modal
    useEffect(() => {
        if (!showModal && !showGenerateModal) return;
        (async () => {
            try {
                // Pour le modal d'ajout/edition
                if (showModal) {
                    const params = {};
                    if (viewMode === 'groupe' && selectedId) params.groupe_id = selectedId;
                    else if (viewMode === 'formateur' && selectedId) params.formateur_id = selectedId;
                    const resp = await listAssignments(params);
                    setAssignments(resp?.data || []);
                }

                // Pour les deux modals : s'assurer que tout est chargé
                if (groups.length === 0) loadGroups();
                if (trainers.length === 0) loadTrainers();
                if (salles.length === 0) loadSalles();
            } catch (err) {
                console.error("Erreur chargement données modal", err);
            }
        })();
    }, [showModal, showGenerateModal, selectedId, viewMode, groups.length, trainers.length, salles.length, loadGroups, loadTrainers, loadSalles]);

    const loadSchedule = async (id) => {
        setLoading(true);
        try {
            const params = viewMode === 'groupe' ? { groupe_id: id } : { formateur_id: id };
            const response = await listSchedule({ ...params, per_page: 100 });
            setSchedule(response.data?.data || []);
        } catch (error) {
            toast.error("Erreur lors du chargement de l'emploi du temps.");
        } finally {
            setLoading(false);
        }
    };

    const timeToValue = (timeStr) => {
        if (!timeStr) return 0;
        const [h, m] = timeStr.split(':').map(Number);
        return h + m / 60;
    };

    const calculateGridStyle = (session) => {
        const start = timeToValue(session.heure_debut);
        const end = timeToValue(session.heure_fin);
        
        // Start column (1st col is for day name, so we add 2)
        const startCol = Math.round((start - startTime) * 2) + 2;
        const span = Math.round((end - start) * 2);
        
        return {
            gridColumn: `${startCol} / span ${span}`
        };
    };

    const handleOpenAddModal = (day = 'Lundi') => {
        setEditingEvent(null);
        setFormData({
            groupe_id: viewMode === 'groupe' ? selectedId : '',
            module_id: '',
            formateur_id: viewMode === 'formateur' ? selectedId : '',
            jour: day,
            heure_debut: '08:30',
            heure_fin: '10:30',
            salle: ''
        });
        setShowModal(true);
    };

    const handleEditEvent = (event) => {
        setEditingEvent(event);
        setFormData({
            groupe_id: event.groupe_id,
            module_id: event.module_id,
            formateur_id: event.formateur_id || '',
            jour: event.jour,
            heure_debut: event.heure_debut.substring(0, 5),
            heure_fin: event.heure_fin.substring(0, 5),
            salle: event.salle || ''
        });
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                groupe_id: formData.groupe_id ? Number(formData.groupe_id) : null,
                module_id: formData.module_id ? Number(formData.module_id) : null,
                formateur_id: formData.formateur_id ? Number(formData.formateur_id) : null,
            };

            if (editingEvent) {
                await updateSchedule(editingEvent.id, payload);
                toast.success("Évènement mis à jour.");
            } else {
                await createSchedule(payload);
                toast.success("Évènement créé.");
            }
            setShowModal(false);
            loadSchedule(selectedId);
        } catch (err) {
            const message = err.response?.data?.message || "Erreur lors de l'enregistrement.";
            toast.error(message);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm("Supprimer cet évènement ?")) return;
        try {
            await deleteSchedule(editingEvent.id);
            toast.success("Évènement supprimé.");
            setShowModal(false);
            loadSchedule(selectedId);
        } catch (err) {
            toast.error("Erreur lors de la suppression.");
        }
    };

    const handleGenerate = async (e) => {
        e.preventDefault();
        if (genData.groupe_ids.length === 0 || genData.salles.length === 0) {
            toast.warning("Veuillez sélectionner au moins un groupe et une salle.");
            return;
        }

        setLoading(true);
        try {
            const resp = await generateSchedule({
                ...genData,
                formateur_ids: genData.formateur_ids.length > 0 
                    ? genData.formateur_ids 
                    : trainers.map(t => t.id) // Fallback to all trainers if none selected
            });
            toast.success(resp.message || "Génération terminée.");
            setShowGenerateModal(false);
            if (selectedId) loadSchedule(selectedId);
        } catch (err) {
            toast.error(err.response?.data?.message || "Erreur lors de la génération.");
        } finally {
            setLoading(false);
        }
    };

    const toggleSelection = (listName, id) => {
        setGenData(prev => {
            const list = prev[listName];
            const newList = list.includes(id) 
                ? list.filter(item => item !== id)
                : [...list, id];
            return { ...prev, [listName]: newList };
        });
    };

    const renderTimetable = () => {
        if (!selectedId) return null;

        const totalHours = schedule.reduce((sum, s) => {
            const duration = timeToValue(s.heure_fin) - timeToValue(s.heure_debut);
            return sum + duration;
        }, 0);

        return (
            <div className="animate__animated animate__fadeIn">
                <div className="timetable-top-header">
                    <div className="school-name">ISTANTIC Sidi Youssef Ben Ali Marrakech</div>
                    <div className="page-main-title">EMPLOI DU TEMPS</div>
                    <div className="year-info">Année: 2024/2025</div>
                </div>
                
                <div className="timetable-sub-header">
                    <div>{viewMode === 'groupe' ? 'Groupe:' : 'Formateur:'} {currentEntityName}</div>
                    <div className="no-print">
                        <button className="btn btn-sm btn-success me-2 d-flex align-items-center" onClick={() => handleOpenAddModal()}>
                            <Plus size={14} className="me-1" /> Ajouter
                        </button>
                    </div>
                    <div>Dernière modification le: {new Date().toLocaleDateString('fr-FR')}</div>
                </div>

                <div className="timetable-wrapper">
                    <div className="timetable-grid">
                        {/* Time Headers */}
                        <div className="grid-row-header" style={{backgroundColor: '#0f172a'}}></div>
                        {timeHeaders.map(h => {
                            const [start, end] = h.split(' ');
                            return (
                                <div key={h} className="grid-header">
                                    <span>{start}</span>
                                    <span>{end}</span>
                                </div>
                            );
                        })}

                        {/* Rows for each day */}
                        {daysOfWeek.map((day, dayIdx) => {
                            const daySessions = schedule.filter(s => s.jour === day);
                            const rowIndex = dayIdx + 2; // +1 for header, +1 for 1-based indexing
                            return (
                                <React.Fragment key={day}>
                                    {/* Sidebar day label */}
                                    <div className="day-row-header" style={{ gridRow: rowIndex }}>{day}</div>
                                    
                                    {/* Background slots (visual helpers) */}
                                    {timeHeaders.map((_, idx) => (
                                        <div 
                                            key={idx} 
                                            className={`grid-slot-cell ${Math.floor(idx/2) % 2 === 0 ? 'even-hour' : ''}`}
                                            onClick={() => handleOpenAddModal(day)}
                                            style={{ cursor: 'cell', gridRow: rowIndex, gridColumn: idx + 2 }}
                                        ></div>
                                    ))}

                                    {/* Sessions mapped on top of the grid */}
                                    {daySessions.map(session => (
                                        <div 
                                            key={session.id} 
                                            className="session-block" 
                                            onClick={() => handleEditEvent(session)}
                                            style={{ 
                                                ...calculateGridStyle(session),
                                                gridRow: rowIndex,
                                                cursor: 'pointer'
                                            }}
                                        >
                                            <div className="s-module">{session.module?.nom}</div>
                                            <div className="s-trainer">
                                                {viewMode === 'groupe' 
                                                    ? (session.formateur ? `M. ${session.formateur.prenom} ${session.formateur.nom}` : 'N/A')
                                                    : (session.groupe?.nom || 'N/A')}
                                            </div>
                                            <div className="s-room">{session.salle || 'A distance'}</div>
                                        </div>
                                    ))}
                                </React.Fragment>
                            );
                        })}
                    </div>
                </div>

                <div className="timetable-footer">
                    <div className="ramadan-note">Horaire du Ramadan</div>
                    <div className="total-hours">Nombre d'heures hebdomadaires: {totalHours.toFixed(1)}h</div>
                </div>
            </div>
        );
    };

    return (
        <div className="schedule-container">
            <div className="card-body p-0">
                <div className="mb-4 d-flex gap-4 align-items-end no-print">
                    <div>
                        <label className="form-label fw-bold text-muted small text-uppercase mb-2 d-block">Consulter Par :</label>
                        <div className="button-group-premium">
                            <button 
                                type="button" 
                                className={`btn-group-item ${viewMode === 'groupe' ? 'active' : ''}`}
                                onClick={() => setViewMode('groupe')}
                            >
                                GROUPE
                            </button>
                            <button 
                                type="button" 
                                className={`btn-group-item ${viewMode === 'formateur' ? 'active' : ''}`}
                                onClick={() => setViewMode('formateur')}
                            >
                                FORMATEUR
                            </button>
                        </div>
                    </div>

                    {viewMode && (
                        <div style={{minWidth: 300}}>
                            <label className="form-label fw-bold text-muted small">
                                SÉLECTIONNER {viewMode === 'groupe' ? 'LE GROUPE' : 'LE FORMATEUR'}
                            </label>
                            <SearchableSelect
                                options={itemOptions}
                                value={selectedId}
                                onChange={handleItemChange}
                                placeholder={viewMode === 'groupe' ? 'Rechercher un groupe...' : 'Rechercher un formateur...'}
                                disabled={loading}
                                selectSize={4}
                            />
                        </div>
                    )}
                    
                    <div className="ms-auto d-flex align-items-center" style={{ marginTop: '1rem' }}>
                        <button className="btn btn-dark btn-sm d-flex align-items-center me-3" onClick={() => window.print()} disabled={!selectedId}>
                            <Printer size={16} className="me-2" />Imprimer le Planning Officiel
                        </button>
                        
                        <button className="btn btn-primary btn-sm d-flex align-items-center" onClick={() => setShowGenerateModal(true)}>
                            <Calendar size={16} className="me-2" />Génération Automatique
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-5">
                        <div className="spinner-border text-primary" role="status"></div>
                    </div>
                ) : (
                    renderTimetable()
                )}

                {!viewMode && !loading && (
                    <div className="text-center py-5 border rounded-3 bg-light">
                        <Calendar size={48} className="text-muted mb-3 mx-auto" strokeWidth={1} />
                        <p className="text-muted">Sélectionnez une option pour afficher l'emploi du temps officiel.</p>
                    </div>
                )}
            </div>

            {/* Event Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-card animate__animated animate__zoomIn animate__faster" style={{ maxWidth: '1100px', width: '95vw' }} onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2 className="d-flex align-items-center gap-2">
                                <Calendar size={20} className="text-primary" />
                                {editingEvent ? 'Modifier le cours' : 'Ajouter un cours'}
                            </h2>
                            <button type="button" className="action-dropdown-btn" onClick={() => setShowModal(false)}>
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="modal-body">
                                <div className="row g-4">
                                    {/* Column 1: Module */}
                                    <div className="col-md-4 border-end">
                                        <div className="mb-3">
                                            <label className="form-label fw-bold small text-uppercase text-muted">1. Module</label>
                                            <SearchableSelect
                                                options={moduleOptions}
                                                value={formData.module_id}
                                                onChange={(val) => setFormData({...formData, module_id: val})}
                                                placeholder="Rechercher un module..."
                                                required
                                                compact
                                                selectSize={6}
                                            />
                                            {selectedGroup && (
                                                <div className="mt-2 p-2 bg-light rounded border small">
                                                    <strong>Groupe:</strong> {selectedGroup.nom}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Column 2: Formateur & Groupe */}
                                    <div className="col-md-4 border-end">
                                        <div className="mb-3">
                                            <label className="form-label fw-bold small text-uppercase text-muted">2. Intervenant / Groupe</label>
                                            <div className="mb-3">
                                                <SearchableSelect
                                                    options={trainerOptions}
                                                    value={formData.formateur_id}
                                                    onChange={(val) => setFormData({...formData, formateur_id: val})}
                                                    placeholder="Choisir le formateur..."
                                                    compact
                                                    selectSize={4}
                                                />
                                            </div>

                                            {viewMode === 'formateur' && (
                                                <div className="pt-2 border-top">
                                                    <SearchableSelect
                                                        options={groups.map(g => ({ value: String(g.id), label: g.nom }))}
                                                        value={formData.groupe_id}
                                                        onChange={(val) => setFormData({...formData, groupe_id: val})}
                                                        placeholder="Choisir le groupe..."
                                                        compact
                                                        selectSize={3}
                                                    />
                                                </div>
                                            )}
                                            
                                            {assignments.length > 0 && formData.module_id && trainerOptions.length === 0 && (
                                                <div className="alert alert-warning py-1 small mt-2 mb-0">
                                                    Aucun formateur assigné.
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Column 3: Planning Details */}
                                    <div className="col-md-4">
                                        <label className="form-label fw-bold small text-uppercase text-muted">3. Date & Lieu</label>
                                        
                                        <div className="row g-2 mb-3">
                                            <div className="col-7">
                                                <select 
                                                    className="form-control form-control-sm"
                                                    required
                                                    value={formData.jour}
                                                    onChange={e => setFormData({...formData, jour: e.target.value})}
                                                >
                                                    {daysOfWeek.map(d => <option key={d} value={d}>{d}</option>)}
                                                </select>
                                            </div>
                                            <div className="col-5">
                                                <SearchableSelect
                                                    options={salleOptions}
                                                    value={formData.salle}
                                                    onChange={(val) => setFormData({...formData, salle: val})}
                                                    placeholder="Salle"
                                                    compact
                                                    selectSize={4}
                                                />
                                            </div>
                                        </div>

                                        <div className="p-3 rounded bg-light border">
                                            <div className="row g-2">
                                                <div className="col-6">
                                                    <label className="small fw-bold text-muted mb-1">Début</label>
                                                    <select 
                                                        className="form-control form-control-sm"
                                                        required
                                                        value={formData.heure_debut}
                                                        onChange={e => setFormData({...formData, heure_debut: e.target.value})}
                                                    >
                                                        {hoursOptions.map(h => <option key={h} value={h}>{h}</option>)}
                                                    </select>
                                                </div>
                                                <div className="col-6">
                                                    <label className="small fw-bold text-muted mb-1">Fin</label>
                                                    <select 
                                                        className="form-control form-control-sm"
                                                        required
                                                        value={formData.heure_fin}
                                                        onChange={e => setFormData({...formData, heure_fin: e.target.value})}
                                                    >
                                                        {hoursOptions.map(h => <option key={h} value={h}>{h}</option>)}
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                {editingEvent && (
                                    <button type="button" className="btn btn-danger me-auto" onClick={handleDelete}>
                                        <Trash2 size={16} /> Supprimer
                                    </button>
                                )}
                                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Annuler</button>
                                <button type="submit" className="btn btn-primary px-4">
                                    {editingEvent ? 'Mettre à jour' : 'Enregistrer'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Generation Modal */}
            {showGenerateModal && (
                <div className="modal-overlay" onClick={() => setShowGenerateModal(false)}>
                    <div className="modal-card animate__animated animate__fadeInUp" style={{ maxWidth: '900px' }} onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2 className="d-flex align-items-center gap-2">
                                <Calendar size={20} className="text-primary" />
                                Génération Automatique de l'Emploi
                            </h2>
                            <button type="button" className="action-dropdown-btn" onClick={() => setShowGenerateModal(false)}>
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleGenerate}>
                            <div className="modal-body">
                                <p className="text-muted small mb-4">
                                    Cet outil va remplir automatiquement les créneaux vides en optimisant l'occupation des salles.
                                </p>
                                
                                <div className="gen-modal-grid">
                                    {/* Groups */}
                                    <div className="gen-modal-column">
                                        <label className="gen-label">1. Groupes Concernés</label>
                                        <div className="gen-list-container">
                                            {groups.length === 0 && <div className="p-3 text-center small text-muted">Chargement...</div>}
                                            {groups.map(g => (
                                                <label key={g.id} className="gen-item">
                                                    <input 
                                                        type="checkbox" 
                                                        checked={genData.groupe_ids.includes(g.id)}
                                                        onChange={() => toggleSelection('groupe_ids', g.id)}
                                                    />
                                                    <span>{g.nom}</span>
                                                </label>
                                            ))}
                                        </div>
                                        <button type="button" className="gen-select-all" onClick={() => setGenData({...genData, groupe_ids: genData.groupe_ids.length === groups.length ? [] : groups.map(g => g.id)})}>
                                            {genData.groupe_ids.length === groups.length ? 'Tout désélectionner' : 'Tout sélectionner'}
                                        </button>
                                    </div>

                                    {/* Salles */}
                                    <div className="gen-modal-column">
                                        <label className="gen-label">2. Salles à Utiliser</label>
                                        <div className="gen-list-container">
                                            {salles.length === 0 && <div className="p-3 text-center small text-muted">Chargement...</div>}
                                            {salles.map(s => (
                                                <label key={s.id} className="gen-item">
                                                    <input 
                                                        type="checkbox" 
                                                        checked={genData.salles.includes(s.nom)}
                                                        onChange={() => toggleSelection('salles', s.nom)}
                                                    />
                                                    <span>{s.nom}</span>
                                                </label>
                                            ))}
                                        </div>
                                        <button type="button" className="gen-select-all" onClick={() => setGenData({...genData, salles: genData.salles.length === salles.length ? [] : salles.map(s => s.nom)})}>
                                            {genData.salles.length === salles.length ? 'Tout désélectionner' : 'Tout sélectionner'}
                                        </button>
                                    </div>

                                    {/* Trainers */}
                                    <div className="gen-modal-column">
                                        <label className="gen-label">3. Formateurs à Inclure</label>
                                        <div className="gen-list-container">
                                            {trainers.length === 0 && <div className="p-3 text-center small text-muted">Chargement...</div>}
                                            {trainers.map(t => (
                                                <label key={t.id} className="gen-item">
                                                    <input 
                                                        type="checkbox" 
                                                        checked={genData.formateur_ids.includes(t.id)}
                                                        onChange={() => toggleSelection('formateur_ids', t.id)}
                                                    />
                                                    <span>{t.prenom} {t.nom}</span>
                                                </label>
                                            ))}
                                        </div>
                                        <button type="button" className="gen-select-all" onClick={() => setGenData({...genData, formateur_ids: genData.formateur_ids.length === trainers.length ? [] : trainers.map(t => t.id)})}>
                                            {genData.formateur_ids.length === trainers.length ? 'Tout désélectionner' : 'Tout sélectionner'}
                                        </button>
                                    </div>
                                </div>

                                <div className="gen-modal-footer-options">
                                    <label className="gen-checkbox-wrapper">
                                        <input 
                                            type="checkbox" 
                                            checked={genData.clear_existing}
                                            onChange={e => setGenData({...genData, clear_existing: e.target.checked})}
                                        />
                                        <span className="small fw-bold">
                                            Effacer l'emploi existant pour ces groupes avant la génération
                                        </span>
                                    </label>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowGenerateModal(false)}>Annuler</button>
                                <button type="submit" className="btn btn-primary px-4" disabled={loading}>
                                    {loading ? 'Génération en cours...' : 'Lancer la Génération'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};


export default ScheduleEvents;
