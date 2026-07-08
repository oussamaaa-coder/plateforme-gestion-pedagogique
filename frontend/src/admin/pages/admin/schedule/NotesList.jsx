import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { deleteNote, listNotes } from '../../../api/notes';
import { listFilieres } from '../../../api/filieres';
import { listGroupes } from '../../../api/groupes';
import { listModules } from '../../../api/modules';
import { extractApiError } from '../../../api/http';
import { PlusCircle, EllipsisVertical, Pencil, Trash2, RefreshCw, Eye, X } from 'lucide-react';

const TYPE_LABELS = {
    CC: 'CC',
    EFM: 'EFM',
    EFM_Regional: 'EFM Régional',
    EFF: 'EFF',
};

const NotesList = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [notes, setNotes] = useState([]);
    const [filieres, setFilieres] = useState([]);
    const [groupes, setGroupes] = useState([]);
    const [modules, setModules] = useState([]);
    const [loading, setLoading] = useState(false);

    // Filtres
    const [filterFiliere, setFilterFiliere] = useState('');
    const [filterGroupe, setFilterGroupe] = useState('');
    const [filterModule, setFilterModule] = useState('');
    const [filterAnnee, setFilterAnnee] = useState('');
    const [filterType, setFilterType] = useState('');

    const [openActionId, setOpenActionId] = useState(null);
    const [selectedNoteForDetail, setSelectedNoteForDetail] = useState(null);
    const menuRef = useRef(null);

    // Clic en dehors pour fermer le dropdown
    useEffect(() => {
        const handleOutsideClick = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setOpenActionId(null);
            }
        };
        document.addEventListener('mousedown', handleOutsideClick);
        return () => document.removeEventListener('mousedown', handleOutsideClick);
    }, []);

    // Charger les filières au montage
    useEffect(() => {
        (async () => {
            try {
                const resp = await listFilieres({ per_page: 200 });
                setFilieres(resp?.data?.data || []);
            } catch (e) {
                // Silencieux
            }
        })();
    }, []);

    // Charger les groupes filtrés par filière
    useEffect(() => {
        (async () => {
            try {
                const resp = await listGroupes({ 
                    filiere_id: filterFiliere || undefined, 
                    per_page: 200 
                });
                setGroupes(resp?.data?.data || []);
            } catch (e) {
                // Silencieux
            }
        })();
    }, [filterFiliere]);

    // Charger les modules filtrés par filière et/ou année
    useEffect(() => {
        (async () => {
            try {
                const resp = await listModules({ 
                    filiere_id: filterFiliere || undefined, 
                    annee: filterAnnee || undefined,
                    per_page: 200 
                });
                setModules(resp?.data?.data || []);
            } catch (e) {
                // Silencieux
            }
        })();
    }, [filterFiliere, filterAnnee]);

    const queryParams = useMemo(() => ({
        search: searchTerm || undefined,
        filiere_id: filterFiliere || undefined,
        groupe_id: filterGroupe || undefined,
        module_id: filterModule || undefined,
        annee: filterAnnee || undefined,
        type_controle: filterType || undefined,
        per_page: 50,
    }), [searchTerm, filterFiliere, filterGroupe, filterModule, filterAnnee, filterType]);

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                setLoading(true);
                const resp = await listNotes(queryParams);
                if (!mounted) return;
                setNotes(resp?.data?.data || []);
            } catch (e) {
                toast.error(extractApiError(e));
            } finally {
                if (mounted) setLoading(false);
            }
        })();
        return () => { mounted = false; };
    }, [queryParams]);

    const handleDelete = (id) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer cette note ?")) {
            (async () => {
                try {
                    await deleteNote(id);
                    setNotes(prev => prev.filter(n => n.id !== id));
                    toast.success("Note supprimée avec succès !");
                } catch (e) {
                    toast.error(extractApiError(e));
                }
            })();
        }
    };

    return (
        <div className="admin-scope">
            <div className="page-header">
                <div className="page-header-left">
                    <h1>Notes & Résultats</h1>
                    <div className="breadcrumb">
                        <span>Administration</span>
                        <span className="breadcrumb-separator">/</span>
                        <span>Scolarité</span>
                        <span className="breadcrumb-separator">/</span>
                        <span className="text-primary">Notes</span>
                    </div>
                </div>
                <div className="page-header-right">
                    <div className="search-container me-2">
                        <svg className="search-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                        <input 
                            type="text" 
                            placeholder="Rechercher par étudiant ou module..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Link className="btn btn-primary" to="/admin/notes/add">
                        <PlusCircle size={18} />
                        Saisir Note
                    </Link>
                </div>
            </div>

            {/* ── Barre de filtres ────────────────────────────── */}
            <div className="filter-card mb-4">
                <div className="row align-items-end g-3">
                    <div className="col-12 col-md-6 col-lg-3">
                        <div className="form-group mb-0">
                            <label className="mb-2">Filière</label>
                            <select value={filterFiliere} onChange={e => { setFilterFiliere(e.target.value); setFilterGroupe(''); setFilterModule(''); }}>
                                <option value="">Toutes les filières</option>
                                {filieres.map(f => <option key={f.id} value={f.id}>{f.nom}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className="col-12 col-md-6 col-lg-2">
                        <div className="form-group mb-0">
                            <label className="mb-2">Groupe</label>
                            <select value={filterGroupe} onChange={e => setFilterGroupe(e.target.value)}>
                                <option value="">Tous les groupes</option>
                                {groupes.map(g => <option key={g.id} value={g.id}>{g.nom}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className="col-12 col-md-6 col-lg-3">
                        <div className="form-group mb-0">
                            <label className="mb-2">Module</label>
                            <select value={filterModule} onChange={e => setFilterModule(e.target.value)}>
                                <option value="">Tous les modules</option>
                                {modules.map(m => <option key={m.id} value={m.id}>{m.nom}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className="col-12 col-md-3 col-lg-2">
                        <div className="form-group mb-0">
                            <label className="mb-2">Année</label>
                            <select value={filterAnnee} onChange={e => { setFilterAnnee(e.target.value); setFilterModule(''); }}>
                                <option value="">Toutes</option>
                                <option value="1">1ère année</option>
                                <option value="2">2ème année</option>
                            </select>
                        </div>
                    </div>
                    <div className="col-12 col-md-3 col-lg-2">
                        <div className="form-group mb-0">
                            <label className="mb-2">Type de Contrôle</label>
                            <select value={filterType} onChange={e => setFilterType(e.target.value)}>
                                <option value="">Tous les types</option>
                                <option value="CC">CC — Contrôle Continu</option>
                                <option value="EFM">EFM — Examen Fin de Module</option>
                                <option value="EFM_Regional">EFM Régional</option>
                                <option value="EFF">EFF — Examen Fin de Formation</option>
                            </select>
                        </div>
                    </div>
                    <div className="col-12 d-flex justify-content-end mt-3">
                        <button 
                            className="btn btn-secondary" 
                            onClick={() => { 
                                setFilterFiliere(''); 
                                setFilterGroupe(''); 
                                setFilterModule(''); 
                                setFilterAnnee(''); 
                                setFilterType(''); 
                                setSearchTerm(''); 
                            }}
                            style={{ height: '42px' }}
                        >
                            <RefreshCw size={16} />
                            Réinitialiser
                        </button>
                    </div>
                </div>
            </div>
            
            <div className="table-card">
                <div className="table-wrapper">
                    <table className="table">
                        <thead>
                            <tr>
                                <th style={{ width: '50px' }}>#</th>
                                <th>Étudiant</th>
                                <th>Groupe</th>
                                <th>Module</th>
                                <th>Filière</th>
                                <th>Type</th>
                                <th className="text-center">Note</th>
                                <th className="text-center">Coeff.</th>
                                <th style={{ width: '100px', textAlign: 'center' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="9" className="text-center py-5">
                                        <div className="spinner-border text-primary spinner-border-sm me-2" role="status"></div>
                                        Chargement des notes...
                                    </td>
                                </tr>
                            ) : notes.length > 0 ? notes.map((note, index) => (
                                <tr key={note.id}>
                                    <td><span className="text-muted fw-bold">{index + 1}</span></td>
                                    <td>
                                        <div className="d-flex align-items-center">
                                            <div className="avatar-circle me-2" style={{ width: 32, height: 32, fontSize: 11 }}>
                                                {note.user?.prenom?.[0]}{note.user?.nom?.[0]}
                                            </div>
                                            <div>
                                                <p className="cell-name">{note.user?.prenom} {note.user?.nom}</p>
                                                <p className="cell-sub">ID: #{note.user?.id}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <span className="fw-semibold text-primary">{note.user?.groupe?.nom || '—'}</span>
                                    </td>
                                    <td>
                                        <p className="cell-name text-truncate" style={{ maxWidth: '200px' }}>{note.module?.nom}</p>
                                    </td>
                                    <td>
                                        <span className="text-muted small">{note.module?.filiere?.nom || '—'}</span>
                                    </td>
                                    <td>
                                        <span className={`badge ${
                                            note.type_controle === 'CC' ? 'badge-info' :
                                            note.type_controle === 'EFM' ? 'badge-success' :
                                            note.type_controle === 'EFM_Regional' ? 'badge-warning' :
                                            'badge-danger'
                                        }`}>
                                            {TYPE_LABELS[note.type_controle] || note.type_controle}
                                        </span>
                                    </td>
                                    <td className="text-center">
                                        {(() => {
                                            const isEfm = note.type_controle === 'EFM' || note.type_controle === 'EFM_Regional';
                                            const maxNote = isEfm ? 40 : 20;
                                            const isPassed = isEfm ? note.note >= 20 : note.note >= 10;
                                            return (
                                                <span className={`badge ${isPassed ? 'badge-success' : 'badge-danger'}`} style={{ fontSize: '13px', padding: '4px 12px' }}>
                                                    {note.note} / {maxNote}
                                                </span>
                                            );
                                        })()}
                                    </td>
                                    <td className="text-center">
                                        <span className="fw-medium text-muted">x{note.coefficient}</span>
                                    </td>
                                    <td style={{ textAlign: 'center' }}>
                                        <div style={{ position: 'relative', display: 'inline-block' }} ref={openActionId === note.id ? menuRef : null}>
                                            <button
                                                type="button"
                                                className="action-dropdown-btn"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setOpenActionId(prev => prev === note.id ? null : note.id);
                                                }}
                                            >
                                                <EllipsisVertical size={18} />
                                            </button>
                                            
                                            {openActionId === note.id && (
                                                <div className="dropdown-menu dropdown-menu-end show" style={{ display: 'block', position: 'absolute', right: 0, top: '100%', zIndex: 100, minWidth: '150px' }}>
                                                    <button 
                                                        type="button"
                                                        className="dropdown-item" 
                                                        onClick={() => {
                                                            setOpenActionId(null);
                                                            setSelectedNoteForDetail(note);
                                                        }}
                                                    >
                                                        <Eye size={14} /> Voir détails
                                                    </button>
                                                    <Link 
                                                        className="dropdown-item" 
                                                        to={`/admin/notes/edit/${note.id}`}
                                                        onClick={() => setOpenActionId(null)}
                                                    >
                                                        <Pencil size={14} /> Modifier
                                                    </Link>
                                                    <button 
                                                        className="dropdown-item danger" 
                                                        onClick={() => {
                                                            setOpenActionId(null);
                                                            handleDelete(note.id);
                                                        }}
                                                    >
                                                        <Trash2 size={14} /> Supprimer
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="9" className="text-center py-5">
                                        <div className="text-muted">
                                            <RefreshCw size={32} className="mb-2 opacity-25" />
                                            <p>Aucune note trouvée pour ces critères</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {selectedNoteForDetail && (
                <div className="modal-overlay animate__animated animate__fadeIn" onClick={() => setSelectedNoteForDetail(null)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div className="modal-card animate__animated animate__zoomIn" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px', width: '95%', background: '#ffffff', padding: '24px', borderRadius: '12px', maxHeight: '90vh', display: 'flex', flexDirection: 'column', borderTop: '4px solid var(--admin-accent)' }}>
                        
                        {/* Header */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--admin-border, #e2e8f0)', paddingBottom: '16px', flexShrink: 0 }}>
                            <div>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'var(--admin-text-main)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Eye size={20} className="text-primary" />
                                    Détails de la Note
                                </h3>
                                <p style={{ fontSize: '0.85rem', color: 'var(--admin-text-muted)', margin: '4px 0 0 0' }}>
                                    Saisie par : {selectedNoteForDetail.formateur ? `${selectedNoteForDetail.formateur.prenom} ${selectedNoteForDetail.formateur.nom}` : 'Administration'}
                                </p>
                            </div>
                            <button 
                                onClick={() => setSelectedNoteForDetail(null)}
                                className="action-dropdown-btn"
                                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            >
                                <X size={20} />
                            </button>
                        </div>
                        
                        {/* Body */}
                        <div style={{ overflowY: 'auto', flexGrow: 1, padding: '20px 0' }}>
                            {/* Score Display Box */}
                            <div style={{ background: '#f8fafc', borderRadius: '8px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', border: '1px solid #e2e8f0' }}>
                                <div>
                                    <span style={{ fontSize: '0.85rem', textTransform: 'uppercase', tracking: '0.05em', color: 'var(--admin-text-muted)', fontWeight: '600' }}>Note Finale</span>
                                    <h4 style={{ margin: '4px 0 0 0', fontSize: '1.8rem', fontWeight: '800', color: selectedNoteForDetail.note >= 10 ? '#10b981' : '#ef4444' }}>
                                        {selectedNoteForDetail.note} <span style={{ fontSize: '1rem', fontWeight: '500', color: '#64748b' }}>/ 20</span>
                                    </h4>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <span style={{ fontSize: '0.85rem', textTransform: 'uppercase', tracking: '0.05em', color: 'var(--admin-text-muted)', fontWeight: '600' }}>Type d'évaluation</span>
                                    <div style={{ marginTop: '4px' }}>
                                        <span className={`badge ${
                                            selectedNoteForDetail.type_controle === 'CC' ? 'badge-info' :
                                            selectedNoteForDetail.type_controle === 'EFM' ? 'badge-success' :
                                            selectedNoteForDetail.type_controle === 'EFM_Regional' ? 'badge-warning' :
                                            'badge-danger'
                                        }`} style={{ fontSize: '0.9rem', padding: '4px 10px' }}>
                                            {TYPE_LABELS[selectedNoteForDetail.type_controle] || selectedNoteForDetail.type_controle}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Two-Column Info Grid */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                                {/* Étudiant Block */}
                                <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '14px' }}>
                                    <h5 style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--admin-text-main)', margin: '0 0 10px 0', borderBottom: '1px solid #f1f5f9', paddingBottom: '6px' }}>Étudiant</h5>
                                    <p style={{ margin: '0 0 4px 0', fontSize: '0.9rem', fontWeight: '600' }}>
                                        {selectedNoteForDetail.user?.prenom} {selectedNoteForDetail.user?.nom}
                                    </p>
                                    <p style={{ margin: '0 0 4px 0', fontSize: '0.8rem', color: 'var(--admin-text-muted)' }}>
                                        Email: {selectedNoteForDetail.user?.email || '—'}
                                    </p>
                                    <p style={{ margin: '0 0 4px 0', fontSize: '0.8rem', color: 'var(--admin-text-muted)' }}>
                                        CIN: {selectedNoteForDetail.user?.cin || '—'}
                                    </p>
                                    <p style={{ margin: 0, fontSize: '0.8rem' }}>
                                        Groupe: <span className="fw-semibold text-primary">{selectedNoteForDetail.user?.groupe?.nom || '—'}</span>
                                    </p>
                                </div>

                                {/* Module Block */}
                                <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '14px' }}>
                                    <h5 style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--admin-text-main)', margin: '0 0 10px 0', borderBottom: '1px solid #f1f5f9', paddingBottom: '6px' }}>Module & Filière</h5>
                                    <p style={{ margin: '0 0 4px 0', fontSize: '0.9rem', fontWeight: '600' }} className="text-truncate">
                                        {selectedNoteForDetail.module?.nom}
                                    </p>
                                    <p style={{ margin: '0 0 4px 0', fontSize: '0.8rem', color: 'var(--admin-text-muted)' }}>
                                        Filière: {selectedNoteForDetail.module?.filiere?.nom || '—'}
                                    </p>
                                    <p style={{ margin: '0 0 4px 0', fontSize: '0.8rem', color: 'var(--admin-text-muted)' }}>
                                        Année: {selectedNoteForDetail.module?.annee} {selectedNoteForDetail.module?.annee === 1 ? 'ère' : 'ème'} année
                                    </p>
                                    <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--admin-text-muted)' }}>
                                        Coefficient: <span className="fw-semibold">x{selectedNoteForDetail.coefficient}</span>
                                    </p>
                                </div>
                            </div>

                            {/* Remarque */}
                            <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '14px' }}>
                                <h5 style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--admin-text-main)', margin: '0 0 8px 0' }}>Observations / Remarque</h5>
                                <p style={{ margin: 0, fontSize: '0.9rem', color: selectedNoteForDetail.remarque ? 'var(--admin-text-main)' : 'var(--admin-text-muted)', fontStyle: selectedNoteForDetail.remarque ? 'normal' : 'italic' }}>
                                    {selectedNoteForDetail.remarque || "Aucune remarque saisie pour cette note."}
                                </p>
                            </div>
                        </div>
                        
                        {/* Footer */}
                        <div style={{ borderTop: '1px solid var(--admin-border, #e2e8f0)', paddingTop: '16px', display: 'flex', justifyContent: 'flex-end', flexShrink: 0, gap: '10px' }}>
                            <Link className="btn btn-primary" to={`/admin/notes/edit/${selectedNoteForDetail.id}`} onClick={() => setSelectedNoteForDetail(null)}>
                                <Pencil size={14} style={{ marginRight: '6px' }} />
                                Modifier
                            </Link>
                            <button className="btn btn-secondary" onClick={() => setSelectedNoteForDetail(null)}>
                                Fermer
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotesList;

