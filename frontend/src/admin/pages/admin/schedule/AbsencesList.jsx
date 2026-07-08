import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { deleteAbsence, listAbsences } from '../../../api/absences';
import { extractApiError } from '../../../api/http';
import ConfirmModal from '../../../components/admin/ConfirmModal';
import { Filter, PlusCircle, EllipsisVertical, Pencil, Trash2, FileCheck, Clock, CheckCircle2, XCircle } from 'lucide-react';

/* ── Small summary card rendered inline next to the row ── */
function JustifCard({ absence, allAbsences, onClose }) {
    const cardRef = useRef(null);

    const userId = absence.user?.id;
    const name   = absence.user ? `${absence.user.prenom} ${absence.user.nom}` : '—';

    const stats = useMemo(() => {
        const rows        = allAbsences.filter(a => a.user?.id === userId);
        const total       = rows.length;
        const justified   = rows.filter(a => a.justifie).length;
        const unjustified = total - justified;
        const totalHours  = rows.reduce((s, a) => s + (Number(a.nombre_heures) || 0), 0);
        const justifiedHours = rows.filter(a => a.justifie).reduce((s, a) => s + (Number(a.nombre_heures) || 0), 0);
        const pct = total > 0 ? Math.round((justified / total) * 100) : 0;
        return { total, justified, unjustified, totalHours, justifiedHours, pct };
    }, [userId, allAbsences]);

    // Close when clicking outside
    useEffect(() => {
        const handleClick = (e) => {
            if (cardRef.current && !cardRef.current.contains(e.target)) onClose();
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, [onClose]);

    return (
        <div
            ref={cardRef}
            style={{
                position: 'absolute',
                right: 0,
                top: 'calc(100% + 8px)',
                zIndex: 2000,
                width: 252,
                background: '#FFFFFF',
                borderRadius: 10,                                   /* --radius-md */
                boxShadow: '0 10px 15px -3px rgba(0,0,0,.1), 0 4px 6px -2px rgba(0,0,0,.05)',  /* --shadow-lg */
                border: '1px solid #E2E8F0',                        /* --admin-border */
                overflow: 'hidden',
                fontFamily: "'Inter', system-ui, sans-serif",       /* --admin-font-main */
                animation: 'jcFadeIn 0.15s ease',
                textAlign: 'left',
            }}
        >
            <style>{`
                @keyframes jcFadeIn {
                    from { opacity: 0; transform: translateY(-8px) scale(0.97); }
                    to   { opacity: 1; transform: translateY(0) scale(1); }
                }
            `}</style>

            {/* ── Header strip ── */}
            <div style={{
                background: '#2563EB',                              /* --admin-accent */
                padding: '10px 14px',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
            }}>
                <FileCheck size={15} color="rgba(255,255,255,0.9)" />
                <div>
                    <div style={{ color: '#fff', fontWeight: 600, fontSize: 12, lineHeight: 1.3 }}>{name}</div>
                    <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: 10 }}>Récapitulatif des absences</div>
                </div>
            </div>

            {/* ── Stat rows ── */}
            <div style={{ padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 7 }}>

                {/* Total */}
                <div style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '7px 10px', borderRadius: 8,
                    background: '#F8FAFC', border: '1px solid #E2E8F0',
                }}>
                    <div style={{
                        width: 28, height: 28, borderRadius: 7,
                        background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                        <Clock size={14} color="#2563EB" />
                    </div>
                    <div>
                        <div style={{ fontSize: 10, color: '#64748B', fontWeight: 500 }}>Total absences</div>
                        <div style={{ fontSize: 12, fontWeight: 700, color: '#0F172A' }}>
                            {stats.total} séance{stats.total !== 1 ? 's' : ''} —&nbsp;
                            <span style={{ color: '#2563EB' }}>{stats.totalHours}h</span>
                        </div>
                    </div>
                </div>

                {/* Justified */}
                <div style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '7px 10px', borderRadius: 8,
                    background: '#F0FDF4', border: '1px solid #BBF7D0',
                }}>
                    <div style={{
                        width: 28, height: 28, borderRadius: 7,
                        background: '#DCFCE7', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                        <CheckCircle2 size={14} color="#10B981" />
                    </div>
                    <div>
                        <div style={{ fontSize: 10, color: '#64748B', fontWeight: 500 }}>Justifiées</div>
                        <div style={{ fontSize: 12, fontWeight: 700, color: '#10B981' }}>
                            {stats.justified} séance{stats.justified !== 1 ? 's' : ''} — {stats.justifiedHours}h
                        </div>
                    </div>
                </div>

                {/* Unjustified */}
                <div style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '7px 10px', borderRadius: 8,
                    background: '#FFF5F5', border: '1px solid #FED7D7',
                }}>
                    <div style={{
                        width: 28, height: 28, borderRadius: 7,
                        background: '#FEE2E2', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                        <XCircle size={14} color="#EF4444" />
                    </div>
                    <div>
                        <div style={{ fontSize: 10, color: '#64748B', fontWeight: 500 }}>Non justifiées</div>
                        <div style={{ fontSize: 12, fontWeight: 700, color: '#EF4444' }}>
                            {stats.unjustified} séance{stats.unjustified !== 1 ? 's' : ''} — {stats.totalHours - stats.justifiedHours}h
                        </div>
                    </div>
                </div>

                {/* Progress bar */}
                {stats.total > 0 && (
                    <div style={{ paddingTop: 2 }}>
                        <div style={{
                            display: 'flex', justifyContent: 'space-between',
                            fontSize: 10, color: '#94A3B8', marginBottom: 5, fontWeight: 500,
                        }}>
                            <span>Taux de justification</span>
                            <span style={{ color: '#0F172A', fontWeight: 700 }}>{stats.pct}%</span>
                        </div>
                        <div style={{ height: 5, borderRadius: 99, background: '#E2E8F0', overflow: 'hidden' }}>
                            <div style={{
                                height: '100%',
                                width: `${stats.pct}%`,
                                background: '#10B981',
                                borderRadius: 99,
                                transition: 'width 0.35s ease',
                            }} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}


/* ═══════════════════════════════════════════════════════════ */

const AbsencesList = ({ role }) => {
    const [searchTerm, setSearchTerm]           = useState('');
    const [absences, setAbsences]               = useState([]);
    const [loading, setLoading]                 = useState(false);
    const [openActionId, setOpenActionId]       = useState(null);
    const [confirmDeleteId, setConfirmDeleteId] = useState(null);
    const [deletingId, setDeletingId]           = useState(null);
    const [justifRowId, setJustifRowId]         = useState(null); // which row's card is open
    const menuRef = useRef(null);

    const title         = role === 'formateur' ? 'Absences Formateurs' : 'Absences Étudiants';
    const addButtonText = role === 'formateur' ? 'Saisir Absence Formateur' : 'Saisir Absence Étudiant';
    const personLabel   = role === 'formateur' ? 'Formateur' : 'Étudiant';
    const listPath      = role === 'formateur' ? '/admin/absences/trainers' : '/admin/absences/students';

    const queryParams = useMemo(() => ({
        search: searchTerm || undefined,
        role: role,
        per_page: 200,
    }), [searchTerm, role]);

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                setLoading(true);
                const resp = await listAbsences(queryParams);
                if (!mounted) return;
                const raw = resp?.data?.data;
                setAbsences(Array.isArray(raw) ? raw : (raw?.data ? raw.data : []));
            } catch (e) {
                toast.error(extractApiError(e));
            } finally {
                if (mounted) setLoading(false);
            }
        })();
        return () => { mounted = false; };
    }, [queryParams]);

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
            await deleteAbsence(id);
            setAbsences(prev => prev.filter((a) => Number(a.id) !== Number(id)));
            toast.success("Absence supprimée avec succès !");
            setConfirmDeleteId(null);
        } catch (e) {
            toast.error(extractApiError(e));
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div>
            <div className="mb-4" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '16px' }}>
                <h4 className="mb-0 fw-bold text-dark">{title}</h4>
                
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
                    {/* Search Bar */}
                    <div className="search-container" style={{ margin: 0 }}>
                        <svg 
                            className="search-icon"
                            xmlns="http://www.w3.org/2000/svg" 
                            width="18" height="18" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            stroke="currentColor" 
                            strokeWidth="2.5" 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                        >
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                        <input
                            type="text"
                            placeholder={`Rechercher ${personLabel.toLowerCase()}...`}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {/* Filter Button */}
                    <button type="button" className="btn btn-secondary">
                        <Filter size={18} />
                        Filtre
                    </button>

                    {/* Add Button */}
                    <Link className="btn btn-primary" to={`${listPath}/add`}>
                        <PlusCircle size={18} />
                        {addButtonText}
                    </Link>
                </div>
            </div>

            <div className="row">
                <div className="col-sm-12">
                    <div className="card-table">
                        <div className="card-body">
                            <div className="table-responsive" style={{ overflow: 'visible', minHeight: '300px' }}>
                                <table className="table table-center table-hover datatable">
                                    <thead className="thead-light">
                                        <tr>
                                            <th>#</th>
                                            <th>{personLabel}</th>
                                            {role === 'etudiant' && <th>Groupe</th>}
                                            <th>Module</th>
                                            <th>Date</th>
                                            <th>Heures</th>
                                            <th>Justifiée</th>
                                            <th style={{ minWidth: 120 }} className="text-end">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {loading ? (
                                            <tr>
                                                <td colSpan={role === 'etudiant' ? 8 : 7} className="text-center">Chargement...</td>
                                            </tr>
                                        ) : absences.length > 0 ? absences.map((absence, index) => (
                                            <tr key={absence.id}>
                                                <td>{index + 1}</td>
                                                <td>{absence.user ? `${absence.user.prenom} ${absence.user.nom}` : '-'}</td>
                                                {role === 'etudiant' && <td>{absence.user?.groupe?.nom || '-'}</td>}
                                                <td>{absence.module?.nom || '-'}</td>
                                                <td>{absence.date ? new Date(absence.date).toLocaleDateString('fr-FR') : '-'}</td>
                                                <td>{absence.nombre_heures}h</td>
                                                <td>
                                                    {absence.justifie ?
                                                        <span className="badge bg-success-light">Oui</span> :
                                                        <span className="badge bg-danger-light">Non</span>
                                                    }
                                                </td>
                                                <td className="text-end" style={{ minWidth: 130, position: 'relative', overflow: 'visible' }}>

                                                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, justifyContent: 'flex-end' }}>

                                                        {/* 📋 Justifications button & popover wrapper */}
                                                        <div style={{ position: 'relative', display: 'inline-block' }}>
                                                            {justifRowId === absence.id && (
                                                                <JustifCard
                                                                    absence={absence}
                                                                    allAbsences={absences}
                                                                    onClose={() => setJustifRowId(null)}
                                                                />
                                                            )}
                                                            <button
                                                            type="button"
                                                            title="Voir les justifications"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setJustifRowId(prev => prev === absence.id ? null : absence.id);
                                                                setOpenActionId(null);
                                                            }}
                                                            style={{
                                                                width: 30, height: 30,
                                                                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                                                                borderRadius: 8,
                                                                border: '1px solid #BFDBFE',
                                                                background: justifRowId === absence.id ? '#2563EB' : '#EFF6FF',
                                                                color: justifRowId === absence.id ? '#fff' : '#2563EB',
                                                                cursor: 'pointer',
                                                                transition: 'all 0.15s ease',
                                                                padding: 0,
                                                                flexShrink: 0,
                                                            }}
                                                        >
                                                            <FileCheck size={14} />
                                                        </button>
                                                        </div>

                                                        {/* ⋮ menu */}
                                                        <div ref={openActionId === absence.id ? menuRef : null} style={{ position: 'relative', display: 'inline-block' }}>
                                                            <button
                                                                type="button"
                                                                title="Actions"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setJustifRowId(null);
                                                                    setOpenActionId(prev => prev === absence.id ? null : absence.id);
                                                                }}
                                                                style={{
                                                                    width: 30, height: 30,
                                                                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                                                                    borderRadius: 8,
                                                                    border: '1px solid #E2E8F0',
                                                                    background: '#F8FAFC',
                                                                    color: '#0F172A',
                                                                    cursor: 'pointer',
                                                                    padding: 0,
                                                                    flexShrink: 0,
                                                                }}
                                                            >
                                                                <EllipsisVertical size={16} strokeWidth={2.5} />
                                                            </button>
                                                            {openActionId === absence.id && (
                                                                <div
                                                                    className="dropdown-menu show position-absolute shadow-sm"
                                                                    style={{ right: 0, left: 'auto', top: '100%', zIndex: 1050, minWidth: 160 }}
                                                                >
                                                                    <Link
                                                                        className="dropdown-item py-2 d-flex align-items-center"
                                                                        to={`${listPath}/edit/${absence.id}`}
                                                                        onClick={() => setOpenActionId(null)}
                                                                    >
                                                                        <Pencil size={15} className="me-2" />Modifier
                                                                    </Link>
                                                                    <button
                                                                        type="button"
                                                                        className="dropdown-item py-2 border-0 bg-transparent text-start w-100 d-flex align-items-center text-danger"
                                                                        onClick={() => handleDeleteClick(absence.id)}
                                                                        disabled={deletingId === absence.id}
                                                                    >
                                                                        <Trash2 size={15} className="me-2" />
                                                                        {deletingId === absence.id ? 'Suppression...' : 'Supprimer'}
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr>
                                                <td colSpan={role === 'etudiant' ? 8 : 7} className="text-center">Aucune absence trouvée</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <ConfirmModal
                show={confirmDeleteId != null}
                title="Supprimer l'absence"
                message="Êtes-vous sûr de vouloir supprimer cette absence ? Cette action est irréversible."
                onConfirm={handleDeleteConfirm}
                onCancel={() => setConfirmDeleteId(null)}
                confirmLabel="Supprimer"
                cancelLabel="Annuler"
                variant="danger"
                confirmLoading={deletingId === confirmDeleteId}
            />
        </div>
    );
};

export default AbsencesList;
