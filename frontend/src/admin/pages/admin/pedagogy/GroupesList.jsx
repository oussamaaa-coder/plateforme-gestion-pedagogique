import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { deleteGroupe, listGroupes } from '../../../api/groupes';
import { listFilieres } from '../../../api/filieres';
import { listStudents } from '../../../api/students';
import { extractApiError } from '../../../api/http';
import ConfirmModal from '../../../components/admin/ConfirmModal';
import {
    PlusCircle,
    EllipsisVertical,
    Pencil,
    Trash2,
    RefreshCw,
    Users,
    X
} from 'lucide-react';

const GroupesList = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedFiliere, setSelectedFiliere] = useState('');
    const [selectedAnnee, setSelectedAnnee] = useState('');
    const [groupes, setGroupes] = useState([]);
    const [filieres, setFilieres] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showFilter, setShowFilter] = useState(false);
    const [openActionId, setOpenActionId] = useState(null);
    const [deletingId, setDeletingId] = useState(null);
    const [confirmDeleteId, setConfirmDeleteId] = useState(null);
    const menuRef = useRef(null);

    const [selectedGroupForStudents, setSelectedGroupForStudents] = useState(null);
    const [students, setStudents] = useState([]);
    const [studentsLoading, setStudentsLoading] = useState(false);

    const getInitials = (name) => {
        if (!name) return '';
        const parts = name.trim().split(/\s+/);
        if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
        return (parts[0][0] + (parts[parts.length - 1]?.[0] || '')).toUpperCase();
    };

    useEffect(() => {
        if (!selectedGroupForStudents) {
            setStudents([]);
            return;
        }

        let mounted = true;
        (async () => {
            try {
                setStudentsLoading(true);
                const resp = await listStudents({
                    groupe_id: selectedGroupForStudents.id,
                    per_page: 100
                });
                if (!mounted) return;
                const raw = resp?.data?.data;
                setStudents(Array.isArray(raw) ? raw : (raw?.data ? raw.data : []));
            } catch (e) {
                toast.error(extractApiError(e));
            } finally {
                if (mounted) setStudentsLoading(false);
            }
        })();
        return () => { mounted = false; };
    }, [selectedGroupForStudents]);

    const queryParams = useMemo(() => ({
        search: searchTerm || undefined,
        filiere_id: selectedFiliere || undefined,
        annee: selectedAnnee || undefined,
        per_page: 50,
    }), [searchTerm, selectedFiliere, selectedAnnee]);

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                const resp = await listFilieres({ per_page: 200 });
                if (!mounted) return;
                setFilieres(resp?.data?.data || []);
            } catch (e) {
                console.error(e);
            }
        })();
        return () => { mounted = false; };
    }, []);

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                setLoading(true);
                const resp = await listGroupes(queryParams);
                if (!mounted) return;
                const raw = resp?.data?.data;
                setGroupes(Array.isArray(raw) ? raw : (raw?.data ? raw.data : []));
            } catch (e) {
                toast.error(extractApiError(e));
            } finally {
                if (mounted) setLoading(false);
            }
        })();
        return () => { mounted = false; };
    }, [queryParams]);

    const handleReset = () => {
        setSearchTerm('');
        setSelectedFiliere('');
        setSelectedAnnee('');
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setOpenActionId(null);
            }
        };
        if (openActionId != null) {
            document.addEventListener('click', handleClickOutside);
            return () => document.removeEventListener('click', handleClickOutside);
        }
    }, [openActionId]);

    const handleDeleteClick = (id) => {
        setOpenActionId(null);
        setConfirmDeleteId(id);
    };

    const handleDeleteConfirm = async () => {
        const id = confirmDeleteId;
        if (id == null) return;
        try {
            setDeletingId(id);
            await deleteGroupe(id);
            setGroupes(prev => prev.filter((g) => Number(g.id) !== Number(id)));
            toast.success("Groupe supprimé avec succès !");
            setConfirmDeleteId(null);
        } catch (e) {
            toast.error(extractApiError(e));
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="admin-scope">
            <div className="page-header">
                <div className="page-header-left">
                    <h1>Gestion des Groupes</h1>
                    <div className="breadcrumb">
                        <span>Administration</span>
                        <span className="breadcrumb-separator">/</span>
                        <span>Pédagogie</span>
                        <span className="breadcrumb-separator">/</span>
                        <span className="text-primary">Groupes</span>
                    </div>
                </div>
                <div className="page-header-right">
                    <div className="search-container me-2">
                        <svg className="search-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                        <input
                            type="text"
                            placeholder="Rechercher un groupe..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Link className="btn btn-primary" to="/admin/groupes/add">
                        <PlusCircle size={18} />
                        Ajouter Groupe
                    </Link>
                </div>
            </div>

            {/* ── Barre de filtres ────────────────────────────── */}
            <div className="filter-card mb-4">
                <div className="row align-items-end g-3">
                    <div className="col-12 col-md-5">
                        <div className="form-group mb-0">
                            <label className="mb-2">Filière</label>
                            <select value={selectedFiliere} onChange={(e) => setSelectedFiliere(e.target.value)}>
                                <option value="">Toutes les filières</option>
                                {filieres.map(f => (
                                    <option key={f.id} value={f.id}>{f.nom}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="col-12 col-md-4">
                        <div className="form-group mb-0">
                            <label className="mb-2">Année</label>
                            <select value={selectedAnnee} onChange={(e) => setSelectedAnnee(e.target.value)}>
                                <option value="">Toutes les années</option>
                                <option value="1">1ère année</option>
                                <option value="2">2ème année</option>
                            </select>
                        </div>
                    </div>
                    <div className="col-12 col-md-3 d-flex justify-content-md-end">
                        <button className="btn btn-secondary w-100" onClick={handleReset} style={{ height: '42px' }}>
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
                                <th style={{ width: '80px' }}>ID</th>
                                <th>Nom du Groupe</th>
                                <th>Filière</th>
                                <th>Année</th>
                                <th>Effectif</th>
                                <th style={{ width: '100px', textAlign: 'center' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-5">
                                        <div className="spinner-border spinner-border-sm text-primary me-2"></div>
                                        Chargement...
                                    </td>
                                </tr>
                            ) : groupes.length > 0 ? groupes.map((groupe) => (
                                <tr key={groupe.id}>
                                    <td><span className="text-muted">#{groupe.id}</span></td>
                                    <td>
                                        <div className="cell-name">{groupe.nom}</div>
                                    </td>
                                    <td>
                                        <span className="badge badge-info">{groupe.filiere?.nom || 'N/A'}</span>
                                    </td>
                                    <td>
                                        <div className="cell-sub">{groupe.annee} {groupe.annee === 1 ? 'ère' : 'ème'} année</div>
                                    </td>
                                    <td>
                                        <div className="d-flex align-items-center">
                                            <Users size={14} className="text-muted me-2" />
                                            <span className="fw-medium">{groupe.students_count || 0}</span>
                                        </div>
                                    </td>
                                    <td className="text-center">
                                        <div style={{ position: 'relative', display: 'inline-block' }} ref={openActionId === groupe.id ? menuRef : null}>
                                            <button
                                                className="action-dropdown-btn"
                                                onClick={(e) => { e.stopPropagation(); setOpenActionId(prev => prev === groupe.id ? null : groupe.id); }}
                                            >
                                                <EllipsisVertical size={18} />
                                            </button>

                                            {openActionId === groupe.id && (
                                                <div className="dropdown-menu">
                                                    <button
                                                        type="button"
                                                        className="dropdown-item"
                                                        onClick={() => {
                                                            setOpenActionId(null);
                                                            setSelectedGroupForStudents(groupe);
                                                        }}
                                                    >
                                                        <Users size={14} />
                                                        Voir les étudiants
                                                    </button>
                                                    <Link
                                                        className="dropdown-item"
                                                        to={`/admin/groupes/edit/${groupe.id}`}
                                                        onClick={() => setOpenActionId(null)}
                                                    >
                                                        <Pencil size={14} />
                                                        Modifier
                                                    </Link>
                                                    <button
                                                        type="button"
                                                        className="dropdown-item danger"
                                                        onClick={() => handleDeleteClick(groupe.id)}
                                                        disabled={deletingId === groupe.id}
                                                    >
                                                        <Trash2 size={14} />
                                                        Supprimer
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="6" className="text-center py-5 text-muted">
                                        Aucun groupe trouvé.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <ConfirmModal
                show={confirmDeleteId != null}
                title="Supprimer le groupe"
                message="Êtes-vous sûr de vouloir supprimer ce groupe ? Cette action est irréversible."
                onConfirm={handleDeleteConfirm}
                onCancel={() => setConfirmDeleteId(null)}
                confirmLabel="Supprimer"
                cancelLabel="Annuler"
                variant="danger"
                confirmLoading={deletingId === confirmDeleteId}
            />

            {selectedGroupForStudents && (
                <div className="modal-overlay animate__animated animate__fadeIn" onClick={() => setSelectedGroupForStudents(null)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div className="modal-card animate__animated animate__zoomIn" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '680px', width: '95%', background: '#ffffff', padding: '24px', borderRadius: '12px', maxHeight: '90vh', display: 'flex', flexDirection: 'column', borderTop: '4px solid var(--admin-accent)' }}>

                        {/* Header */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--admin-border, #e2e8f0)', paddingBottom: '16px', flexShrink: 0 }}>
                            <div>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'var(--admin-text-main)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Users size={20} className="text-primary" />
                                    Étudiants du groupe : {selectedGroupForStudents.nom}
                                </h3>
                                <p style={{ fontSize: '0.85rem', color: 'var(--admin-text-muted)', margin: '4px 0 0 0' }}>
                                    Filière : {selectedGroupForStudents.filiere?.nom || 'N/A'} • {selectedGroupForStudents.annee} {selectedGroupForStudents.annee === 1 ? 'ère' : 'ème'} année
                                </p>
                            </div>
                            <button
                                onClick={() => setSelectedGroupForStudents(null)}
                                className="action-dropdown-btn"
                                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Body */}
                        <div style={{ overflowY: 'auto', flexGrow: 1, padding: '16px 0', minHeight: '200px' }}>
                            {studentsLoading ? (
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '200px', color: 'var(--admin-text-muted)' }}>
                                    <div className="spinner-border text-primary mb-3" role="status"></div>
                                    <span>Chargement des étudiants...</span>
                                </div>
                            ) : students.length > 0 ? (
                                <div className="table-wrapper" style={{ border: '1px solid var(--admin-border, #e2e8f0)', borderRadius: '8px', overflow: 'hidden' }}>
                                    <table className="table" style={{ margin: 0, width: '100%' }}>
                                        <thead>
                                            <tr style={{ background: '#F8FAFC' }}>
                                                <th style={{ width: '60px', padding: '10px 16px' }}>N°</th>
                                                <th style={{ padding: '10px 16px' }}>Nom complet</th>
                                                <th style={{ padding: '10px 16px' }}>CIN</th>
                                                <th style={{ padding: '10px 16px' }}>Email</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {students.map((student, idx) => (
                                                <tr key={student.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                                                    <td style={{ padding: '10px 16px' }}>
                                                        <span className="text-muted" style={{ fontWeight: '500' }}>
                                                            {student.numero_liste || (idx + 1)}
                                                        </span>
                                                    </td>
                                                    <td style={{ padding: '10px 16px' }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                            <div className="avatar-circle" style={{ width: '32px', height: '32px', fontSize: '12px' }}>
                                                                {getInitials(student.prenom + ' ' + student.nom)}
                                                            </div>
                                                            <span style={{ fontWeight: '600', color: 'var(--admin-text-main)' }}>
                                                                {student.prenom} {student.nom}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td style={{ padding: '10px 16px' }}>
                                                        <code style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', fontSize: '12px', color: '#334155' }}>
                                                            {student.cin || 'N/A'}
                                                        </code>
                                                    </td>
                                                    <td style={{ padding: '10px 16px', color: 'var(--admin-text-muted)' }}>
                                                        {student.email}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '200px', textAlign: 'center', color: 'var(--admin-text-muted)' }}>
                                    <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '50%', marginBottom: '12px' }}>
                                        <Users size={32} className="text-muted" />
                                    </div>
                                    <p style={{ margin: 0, fontWeight: '500' }}>Aucun étudiant dans ce groupe.</p>
                                    <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem' }}>Vous pouvez ajouter des étudiants depuis la page de gestion des étudiants.</p>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div style={{ borderTop: '1px solid var(--admin-border, #e2e8f0)', paddingTop: '16px', display: 'flex', justifyContent: 'flex-end', flexShrink: 0 }}>
                            <button className="btn btn-secondary" onClick={() => setSelectedGroupForStudents(null)}>
                                Fermer
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GroupesList;
