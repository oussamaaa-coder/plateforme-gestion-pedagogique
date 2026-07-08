import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { deleteStudent, listStudents, getStudent } from '../../../api/students';
import { listFilieres } from '../../../api/filieres';
import { listGroupes } from '../../../api/groupes';
import { extractApiError } from '../../../api/http';
import { Filter, PlusCircle, EllipsisVertical, Pencil, Trash2, Search, ChevronRight, X, Eye } from 'lucide-react';
import ConfirmModal from '../../../components/admin/ConfirmModal';
import { getInitials } from '../../../../core';

const StudentsList = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showFilter, setShowFilter] = useState(false);
    const [filieres, setFilieres] = useState([]);
    const [groupes, setGroupes] = useState([]);
    const [selectedFiliere, setSelectedFiliere] = useState('');
    const [selectedGroupe, setSelectedGroupe] = useState('');
    const [openActionId, setOpenActionId] = useState(null);
    const [confirmDeleteId, setConfirmDeleteId] = useState(null);
    const [deletingId, setDeletingId] = useState(null);
    const [viewStudent, setViewStudent] = useState(null);
    const [loadingDetails, setLoadingDetails] = useState(false);
    const [activeTab, setActiveTab] = useState('profile');
    const menuRef = useRef(null);

    const handleViewStudent = async (id) => {
        try {
            setLoadingDetails(true);
            setViewStudent({ id });
            setActiveTab('profile');
            const resp = await getStudent(id);
            setViewStudent(resp?.data);
        } catch (e) {
            toast.error(extractApiError(e));
            setViewStudent(null);
        } finally {
            setLoadingDetails(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchTerm);
        }, 300);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    const queryParams = useMemo(() => ({
        search: debouncedSearch || undefined,
        filiere_id: selectedFiliere || undefined,
        groupe_id: selectedGroupe || undefined,
        per_page: 50,
    }), [debouncedSearch, selectedFiliere, selectedGroupe]);

    useEffect(() => {
        (async () => {
            try {
                const [fResp, gResp] = await Promise.all([
                    listFilieres({ per_page: 200 }),
                    listGroupes({ per_page: 200 })
                ]);
                setFilieres(fResp?.data?.data || []);
                setGroupes(gResp?.data?.data || []);
            } catch (e) {
                console.error("Failed to load filter options", e);
            }
        })();
    }, []);

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                setLoading(true);
                const resp = await listStudents(queryParams);
                if (!mounted) return;
                const raw = resp?.data?.data;
                setStudents(Array.isArray(raw) ? raw : (raw?.data ? raw.data : []));
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
        setSelectedGroupe('');
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
            await deleteStudent(id);
            setStudents(prev => prev.filter((s) => Number(s.id) !== Number(id)));
            toast.success("Étudiant supprimé avec succès !");
            setConfirmDeleteId(null);
        } catch (e) {
            toast.error(extractApiError(e));
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div>
            {/* Page Header */}
            <div className="page-header">
                <div className="page-header-left">
                    <h1>Gestion des Étudiants</h1>
                    <div className="breadcrumb">
                        <Link to="/admin">Dashboard</Link>
                        <ChevronRight size={14} className="breadcrumb-separator" />
                        <span>Étudiants</span>
                    </div>
                </div>
                <div className="page-header-right">
                    <div className="search-container">
                        <Search size={18} className="search-icon" />
                        <input 
                            type="text" 
                            placeholder="Rechercher..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button 
                        className={`btn ${showFilter ? 'btn-primary' : 'btn-secondary'}`} 
                        onClick={() => setShowFilter(!showFilter)}
                    >
                        <Filter size={18} />
                        Filtre
                    </button>
                    <Link className="btn btn-primary" to="/admin/students/add">
                        <PlusCircle size={18} />
                        Ajouter Étudiant
                    </Link>
                </div>
            </div>

            {/* Filter Card */}
            {showFilter && (
                <div className="filter-card animate__animated animate__fadeInDown">
                    <div className="filter-toggle">
                        <span>Options de filtrage</span>
                        <X 
                            size={18} 
                            style={{ cursor: 'pointer', color: 'var(--admin-text-muted)' }} 
                            onClick={() => setShowFilter(false)}
                        />
                    </div>
                    <div className="filter-body">
                        <div className="form-grid-2">
                            <div className="form-group">
                                <label>Filière</label>
                                <select 
                                    value={selectedFiliere}
                                    onChange={(e) => {
                                        setSelectedFiliere(e.target.value);
                                        setSelectedGroupe('');
                                    }}
                                >
                                    <option value="">Toutes les filières</option>
                                    {filieres.map(f => (
                                        <option key={f.id} value={f.id}>{f.nom}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Groupe</label>
                                <select 
                                    value={selectedGroupe}
                                    onChange={(e) => setSelectedGroupe(e.target.value)}
                                >
                                    <option value="">Tous les groupes</option>
                                    {groupes
                                        .filter(g => !selectedFiliere || String(g.filiere_id) === String(selectedFiliere))
                                        .map(g => (
                                            <option key={g.id} value={g.id}>{g.nom}</option>
                                        ))}
                                </select>
                            </div>
                        </div>
                        <div className="filter-actions">
                            <button className="btn btn-secondary" onClick={handleReset}>
                                Réinitialiser
                            </button>
                            <button className="btn btn-primary" onClick={() => setShowFilter(false)}>
                                Appliquer
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
            <div className="table-card">
                <div className="table-wrapper">
                    <table className="table">
                        <thead>
                            <tr>
                                <th style={{ width: '50px' }}>#</th>
                                <th>Étudiant</th>
                                <th>CIN</th>
                                <th>Filière</th>
                                <th>Groupe</th>
                                <th style={{ width: '80px', textAlign: 'center' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="6" style={{ textAlign: 'center', padding: '40px' }}>
                                        <div style={{ color: 'var(--admin-text-muted)' }}>Chargement des données...</div>
                                    </td>
                                </tr>
                            ) : (students.length > 0 ? students.map((student, index) => (
                                <tr key={student.id}>
                                    <td>{index + 1}</td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <div className="avatar-circle">
                                                {getInitials(student.prenom + ' ' + student.nom)}
                                            </div>
                                            <div className="user-info">
                                                <p className="cell-name">{student.prenom} {student.nom}</p>
                                                <p className="cell-sub">{student.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td><code className="cin-code">{student.cin}</code></td>
                                    <td><span className="badge badge-success">{student.filiere?.nom || '-'}</span></td>
                                    <td><span className="badge badge-info">{student.groupe?.nom || '-'}</span></td>
                                    <td style={{ textAlign: 'center' }}>
                                        <div style={{ position: 'relative', display: 'inline-block' }} ref={openActionId === student.id ? menuRef : null}>
                                            <button
                                                className="action-dropdown-btn"
                                                onClick={(e) => { e.stopPropagation(); setOpenActionId(prev => prev === student.id ? null : student.id); }}
                                            >
                                                <EllipsisVertical size={20} />
                                            </button>
                                            
                                            {openActionId === student.id && (
                                                <div className="dropdown-menu">
                                                    <button
                                                        type="button"
                                                        className="dropdown-item"
                                                        onClick={() => {
                                                            handleViewStudent(student.id);
                                                            setOpenActionId(null);
                                                        }}
                                                    >
                                                        <Eye size={14} style={{ marginRight: '8px' }} />
                                                        Voir
                                                    </button>
                                                    <Link
                                                        className="dropdown-item"
                                                        to={`/admin/students/edit/${student.id}`}
                                                        onClick={() => setOpenActionId(null)}
                                                    >
                                                        <Pencil size={14} />
                                                        Modifier
                                                    </Link>
                                                    <button
                                                        type="button"
                                                        className="dropdown-item danger"
                                                        onClick={() => handleDeleteClick(student.id)}
                                                        disabled={deletingId === student.id}
                                                    >
                                                        <Trash2 size={14} />
                                                        {deletingId === student.id ? 'Suppression...' : 'Supprimer'}
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: 'var(--admin-text-muted)' }}>
                                        Aucun étudiant trouvé.
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <ConfirmModal
                show={confirmDeleteId != null}
                title="Supprimer l'étudiant"
                message="Êtes-vous sûr de vouloir supprimer cet étudiant ? Cette action est irréversible."
                onConfirm={handleDeleteConfirm}
                onCancel={() => setConfirmDeleteId(null)}
                confirmLabel="Supprimer"
                cancelLabel="Annuler"
                variant="danger"
                confirmLoading={deletingId === confirmDeleteId}
            />

            {/* View Student Modal */}
            {viewStudent && (
                <div className="modal-overlay animate__animated animate__fadeIn" onClick={() => setViewStudent(null)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div className="modal-card animate__animated animate__zoomIn" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '750px', width: '95%', background: 'var(--admin-card-bg, #ffffff)', padding: '24px', borderRadius: '12px', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
                        
                        {/* Header */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--admin-border-color, #e2e8f0)', paddingBottom: '16px', flexShrink: 0 }}>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'var(--admin-text-title)', margin: 0 }}>
                                Fiche Étudiant
                            </h3>
                            <button 
                                onClick={() => setViewStudent(null)}
                                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--admin-text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            >
                                <X size={20} />
                            </button>
                        </div>
                        
                        {loadingDetails ? (
                            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--admin-text-muted)' }}>
                                Chargement des détails de l'étudiant...
                            </div>
                        ) : (
                            <>
                                {/* Tab Navigation */}
                                <div style={{ display: 'flex', borderBottom: '1px solid var(--admin-border-color, #e2e8f0)', marginBottom: '20px', flexShrink: 0 }}>
                                    <button 
                                        onClick={() => setActiveTab('profile')}
                                        style={{ 
                                            padding: '12px 20px', 
                                            background: 'none', 
                                            border: 'none', 
                                            borderBottom: activeTab === 'profile' ? '2px solid var(--admin-primary-color, #0f172a)' : '2px solid transparent', 
                                            color: activeTab === 'profile' ? 'var(--admin-text-title)' : 'var(--admin-text-muted)',
                                            fontWeight: activeTab === 'profile' ? '600' : '500',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s',
                                            outline: 'none'
                                        }}
                                    >
                                        Profil
                                    </button>
                                    <button 
                                        onClick={() => setActiveTab('grades')}
                                        style={{ 
                                            padding: '12px 20px', 
                                            background: 'none', 
                                            border: 'none', 
                                            borderBottom: activeTab === 'grades' ? '2px solid var(--admin-primary-color, #0f172a)' : '2px solid transparent', 
                                            color: activeTab === 'grades' ? 'var(--admin-text-title)' : 'var(--admin-text-muted)',
                                            fontWeight: activeTab === 'grades' ? '600' : '500',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s',
                                            outline: 'none'
                                        }}
                                    >
                                        Notes ({viewStudent.notes?.length || 0})
                                    </button>
                                    <button 
                                        onClick={() => setActiveTab('absences')}
                                        style={{ 
                                            padding: '12px 20px', 
                                            background: 'none', 
                                            border: 'none', 
                                            borderBottom: activeTab === 'absences' ? '2px solid var(--admin-primary-color, #0f172a)' : '2px solid transparent', 
                                            color: activeTab === 'absences' ? 'var(--admin-text-title)' : 'var(--admin-text-muted)',
                                            fontWeight: activeTab === 'absences' ? '600' : '500',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s',
                                            outline: 'none'
                                        }}
                                    >
                                        Absences ({viewStudent.absences?.length || 0})
                                    </button>
                                </div>

                                {/* Content Area with Custom Scrollbar */}
                                <div style={{ overflowY: 'auto', paddingRight: '4px', flexGrow: 1, marginBottom: '16px' }}>
                                    
                                    {/* Tab 1: Profile */}
                                    {activeTab === 'profile' && (
                                        <div>
                                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '24px', textAlign: 'center' }}>
                                                <div className="avatar-circle" style={{ width: '90px', height: '90px', fontSize: '2.25rem', marginBottom: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    {getInitials(viewStudent.prenom + ' ' + viewStudent.nom)}
                                                </div>
                                                <h4 style={{ fontSize: '1.4rem', fontWeight: '700', color: 'var(--admin-text-title)', margin: '0 0 6px 0' }}>
                                                    {viewStudent.prenom} {viewStudent.nom}
                                                </h4>
                                                <div style={{ display: 'flex', gap: '8px' }}>
                                                    <span className="badge badge-success" style={{ padding: '6px 12px', fontSize: '0.85rem' }}>
                                                        N° Liste : {viewStudent.numero_liste || 'Non assigné'}
                                                    </span>
                                                    <span className="badge badge-info" style={{ padding: '6px 12px', fontSize: '0.85rem' }}>
                                                        {viewStudent.groupe?.nom || 'Sans Groupe'}
                                                    </span>
                                                </div>
                                            </div>

                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px 24px', padding: '0 16px' }}>
                                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                    <span style={{ fontSize: '0.8rem', color: 'var(--admin-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email</span>
                                                    <span style={{ fontSize: '0.95rem', fontWeight: '500', color: 'var(--admin-text-title)', marginTop: '4px', wordBreak: 'break-all' }}>{viewStudent.email}</span>
                                                </div>
                                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                    <span style={{ fontSize: '0.8rem', color: 'var(--admin-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>CIN</span>
                                                    <span style={{ fontSize: '0.95rem', fontWeight: '500', color: 'var(--admin-text-title)', marginTop: '4px' }}><code>{viewStudent.cin || '-'}</code></span>
                                                </div>
                                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                    <span style={{ fontSize: '0.8rem', color: 'var(--admin-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Date de Naissance</span>
                                                    <span style={{ fontSize: '0.95rem', fontWeight: '500', color: 'var(--admin-text-title)', marginTop: '4px' }}>
                                                        {viewStudent.date_naissance ? new Date(viewStudent.date_naissance).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'}
                                                    </span>
                                                </div>
                                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                    <span style={{ fontSize: '0.8rem', color: 'var(--admin-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Année Scolaire</span>
                                                    <span style={{ fontSize: '0.95rem', fontWeight: '500', color: 'var(--admin-text-title)', marginTop: '4px' }}>{viewStudent.annee_scolaire || '-'}</span>
                                                </div>
                                                <div style={{ display: 'flex', flexDirection: 'column', gridColumn: 'span 2' }}>
                                                    <span style={{ fontSize: '0.8rem', color: 'var(--admin-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Filière</span>
                                                    <span style={{ fontSize: '0.95rem', fontWeight: '500', color: 'var(--admin-text-title)', marginTop: '4px' }}>
                                                        {viewStudent.filiere?.nom || '-'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Tab 2: Grades */}
                                    {activeTab === 'grades' && (
                                        <div style={{ padding: '0 8px' }}>
                                            {viewStudent.notes?.length > 0 ? (
                                                <div style={{ border: '1px solid var(--admin-border-color, #e2e8f0)', borderRadius: '8px', overflow: 'hidden' }}>
                                                    <table className="table" style={{ margin: 0, width: '100%' }}>
                                                        <thead>
                                                            <tr style={{ background: 'var(--admin-border-color, #f8fafc)' }}>
                                                                <th style={{ padding: '12px' }}>Module</th>
                                                                <th style={{ padding: '12px' }}>Type</th>
                                                                <th style={{ padding: '12px', textAlign: 'center' }}>Note</th>
                                                                <th style={{ padding: '12px' }}>Remarque / Formateur</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {viewStudent.notes.map((note) => (
                                                                <tr key={note.id} style={{ borderBottom: '1px solid var(--admin-border-color, #e2e8f0)' }}>
                                                                    <td style={{ padding: '12px', fontWeight: '500', color: 'var(--admin-text-title)' }}>{note.module?.nom || 'Module inconnu'}</td>
                                                                    <td style={{ padding: '12px' }}><span className="badge badge-info">{note.type_controle}</span></td>
                                                                    <td style={{ padding: '12px', textAlign: 'center', fontWeight: 'bold', fontSize: '1rem', color: Number(note.note) >= 10 ? '#10b981' : '#ef4444' }}>
                                                                        {note.note} / 20
                                                                    </td>
                                                                    <td style={{ padding: '12px', fontSize: '0.85rem' }}>
                                                                        <div style={{ fontWeight: '500', color: 'var(--admin-text-title)' }}>{note.remarque || 'Pas de remarque'}</div>
                                                                        <div style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)' }}>Par: {note.formateur?.name || 'Formateur'}</div>
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            ) : (
                                                <div style={{ textAlign: 'center', padding: '30px', color: 'var(--admin-text-muted)' }}>
                                                    Aucune note enregistrée pour cet étudiant.
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Tab 3: Absences */}
                                    {activeTab === 'absences' && (
                                        <div style={{ padding: '0 8px' }}>
                                            {viewStudent.absences?.length > 0 ? (
                                                <div style={{ border: '1px solid var(--admin-border-color, #e2e8f0)', borderRadius: '8px', overflow: 'hidden' }}>
                                                    <table className="table" style={{ margin: 0, width: '100%' }}>
                                                        <thead>
                                                            <tr style={{ background: 'var(--admin-border-color, #f8fafc)' }}>
                                                                <th style={{ padding: '12px' }}>Date</th>
                                                                <th style={{ padding: '12px' }}>Durée</th>
                                                                <th style={{ padding: '12px' }}>Module</th>
                                                                <th style={{ padding: '12px', textAlign: 'center' }}>Statut</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {viewStudent.absences.map((abs) => (
                                                                <tr key={abs.id} style={{ borderBottom: '1px solid var(--admin-border-color, #e2e8f0)' }}>
                                                                    <td style={{ padding: '12px', color: 'var(--admin-text-title)' }}>{abs.date ? new Date(abs.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}</td>
                                                                    <td style={{ padding: '12px', fontWeight: '500', color: 'var(--admin-text-title)' }}>{abs.nombre_heures} h</td>
                                                                    <td style={{ padding: '12px', color: 'var(--admin-text-title)' }}>{abs.module?.nom || '-'}</td>
                                                                    <td style={{ padding: '12px', textAlign: 'center' }}>
                                                                        <span className={`badge ${abs.justifie ? 'badge-success' : 'badge-danger'}`} style={{ minWidth: '80px', display: 'inline-block' }}>
                                                                            {abs.justifie ? 'Justifiée' : 'Non justifiée'}
                                                                        </span>
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            ) : (
                                                <div style={{ textAlign: 'center', padding: '30px', color: 'var(--admin-text-muted)', fontSize: '0.95rem' }}>
                                                    Aucune absence enregistrée. Élève très assidu ! 🌟
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </>
                        )}

                        {/* Footer */}
                        <div style={{ borderTop: '1px solid var(--admin-border-color, #e2e8f0)', paddingTop: '16px', display: 'flex', justifyContent: 'flex-end', flexShrink: 0 }}>
                            <button className="btn btn-secondary" onClick={() => setViewStudent(null)}>
                                Fermer
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentsList;
