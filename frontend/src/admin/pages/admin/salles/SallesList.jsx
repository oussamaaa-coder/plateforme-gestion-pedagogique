import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { deleteSalle, getSalleOccupancy, listSalles } from '../../../api/salles';
import { extractApiError } from '../../../api/http';
import ConfirmModal from '../../../components/admin/ConfirmModal';
import {
    Filter,
    PlusCircle,
    EllipsisVertical,
    Pencil,
    Trash2,
    Search,
    ChevronRight,
    X,
    Building2,
    Users,
    Clock,
    CalendarDays,
    BookOpen,
    User,
    Loader2,
} from 'lucide-react';

/* ─── Occupancy side-panel ─────────────────────────────────────────────────── */
const OccupancyPanel = ({ salle, onClose }) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                setLoading(true);
                const resp = await getSalleOccupancy(salle.id);
                if (mounted) setData(resp);
            } catch (e) {
                toast.error(extractApiError(e));
            } finally {
                if (mounted) setLoading(false);
            }
        })();
        return () => { mounted = false; };
    }, [salle.id]);

    const dayOrder = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
    const sessionsByDay = useMemo(() => {
        if (!data?.sessions) return {};
        return data.sessions.reduce((acc, s) => {
            const day = s.jour || 'Autre';
            if (!acc[day]) acc[day] = [];
            acc[day].push(s);
            return acc;
        }, {});
    }, [data]);

    const orderedDays = dayOrder.filter(d => sessionsByDay[d]);

    return (
        <>
            {/* Backdrop */}
            <div
                onClick={onClose}
                style={{
                    position: 'fixed', inset: 0, background: 'rgba(15,15,35,0.35)',
                    backdropFilter: 'blur(3px)', zIndex: 999,
                }}
            />

            {/* Drawer */}
            <div style={{
                position: 'fixed', top: 0, right: 0, bottom: 0, width: '420px',
                background: '#fff', boxShadow: '-8px 0 40px rgba(99,102,241,0.12)',
                zIndex: 1000, display: 'flex', flexDirection: 'column',
                borderLeft: '1px solid #e8e8f0',
            }}>
                {/* Header */}
                <div style={{
                    padding: '24px', borderBottom: '1px solid #f0f0fa',
                    background: 'linear-gradient(135deg, #6366f1 0%, #818cf8 100%)',
                    color: '#fff',
                }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                                <Building2 size={20} />
                                <span style={{ fontSize: '18px', fontWeight: '800', letterSpacing: '-0.3px' }}>
                                    {salle.nom}
                                </span>
                            </div>
                            <div style={{ fontSize: '12px', opacity: 0.85, fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                                Occupation de la salle
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            style={{
                                background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '8px',
                                padding: '6px', cursor: 'pointer', color: '#fff', display: 'flex',
                                alignItems: 'center',
                            }}
                        >
                            <X size={18} />
                        </button>
                    </div>

                    {/* Quick stats */}
                    {data && (
                        <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                            <div style={{
                                background: 'rgba(255,255,255,0.18)', borderRadius: '10px',
                                padding: '10px 14px', flex: 1,
                            }}>
                                <div style={{ fontSize: '22px', fontWeight: '900', lineHeight: 1 }}>
                                    {data.groupes?.length ?? 0}
                                </div>
                                <div style={{ fontSize: '10px', fontWeight: '700', opacity: 0.85, textTransform: 'uppercase', letterSpacing: '0.07em', marginTop: '2px' }}>
                                    Groupes
                                </div>
                            </div>
                            <div style={{
                                background: 'rgba(255,255,255,0.18)', borderRadius: '10px',
                                padding: '10px 14px', flex: 1,
                            }}>
                                <div style={{ fontSize: '22px', fontWeight: '900', lineHeight: 1 }}>
                                    {data.sessions?.length ?? 0}
                                </div>
                                <div style={{ fontSize: '10px', fontWeight: '700', opacity: 0.85, textTransform: 'uppercase', letterSpacing: '0.07em', marginTop: '2px' }}>
                                    Séances / sem.
                                </div>
                            </div>
                            <div style={{
                                background: 'rgba(255,255,255,0.18)', borderRadius: '10px',
                                padding: '10px 14px', flex: 1,
                            }}>
                                <div style={{ fontSize: '22px', fontWeight: '900', lineHeight: 1 }}>
                                    {orderedDays.length}
                                </div>
                                <div style={{ fontSize: '10px', fontWeight: '700', opacity: 0.85, textTransform: 'uppercase', letterSpacing: '0.07em', marginTop: '2px' }}>
                                    Jours actifs
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Body */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
                    {loading ? (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '200px', gap: '12px', color: '#6366f1' }}>
                            <Loader2 size={32} style={{ animation: 'spin 1s linear infinite' }} />
                            <span style={{ fontSize: '13px', fontWeight: '600', color: '#94a3b8' }}>Chargement...</span>
                        </div>
                    ) : !data || data.sessions?.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                            <div style={{
                                width: '64px', height: '64px', borderRadius: '20px',
                                background: '#f0f9ff', display: 'flex', alignItems: 'center',
                                justifyContent: 'center', margin: '0 auto 16px', color: '#93c5fd',
                            }}>
                                <CalendarDays size={28} />
                            </div>
                            <p style={{ fontWeight: '700', color: '#94a3b8', fontSize: '14px' }}>
                                Salle non occupée
                            </p>
                            <p style={{ fontSize: '12px', color: '#cbd5e1', marginTop: '4px' }}>
                                Aucune séance n'est planifiée pour cette salle.
                            </p>
                        </div>
                    ) : (
                        <>
                            {/* Groups summary */}
                            <div style={{ marginBottom: '20px' }}>
                                <div style={{ fontSize: '11px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '10px' }}>
                                    Groupes utilisant cette salle
                                </div>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                    {data.groupes.map(g => (
                                        <span key={g.id} style={{
                                            display: 'inline-flex', alignItems: 'center', gap: '6px',
                                            background: '#eef2ff', color: '#6366f1', borderRadius: '8px',
                                            padding: '5px 10px', fontSize: '12px', fontWeight: '700',
                                            border: '1px solid #e0e7ff',
                                        }}>
                                            <Users size={12} />
                                            {g.nom}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Schedule by day */}
                            <div style={{ fontSize: '11px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px' }}>
                                Planning hebdomadaire
                            </div>

                            {orderedDays.map(day => (
                                <div key={day} style={{ marginBottom: '16px' }}>
                                    <div style={{
                                        display: 'flex', alignItems: 'center', gap: '8px',
                                        marginBottom: '8px',
                                    }}>
                                        <div style={{
                                            width: '8px', height: '8px', borderRadius: '50%',
                                            background: '#6366f1', flexShrink: 0,
                                        }} />
                                        <span style={{ fontSize: '13px', fontWeight: '800', color: '#1e293b' }}>
                                            {day}
                                        </span>
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingLeft: '16px' }}>
                                        {sessionsByDay[day].map(session => (
                                            <div key={session.id} style={{
                                                background: '#f8f7ff', border: '1px solid #e8e6ff',
                                                borderRadius: '12px', padding: '12px 14px',
                                                borderLeft: '3px solid #6366f1',
                                            }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                                                    <BookOpen size={12} style={{ color: '#6366f1', flexShrink: 0 }} />
                                                    <span style={{ fontSize: '12px', fontWeight: '800', color: '#3730a3', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                                                        {session.module?.nom || '—'}
                                                    </span>
                                                </div>
                                                <div style={{ display: 'flex', gap: '16px' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#64748b', fontSize: '11px', fontWeight: '600' }}>
                                                        <Clock size={11} />
                                                        {session.heure_debut} – {session.heure_fin}
                                                    </div>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#64748b', fontSize: '11px', fontWeight: '600' }}>
                                                        <Users size={11} />
                                                        {session.groupe?.nom || '—'}
                                                    </div>
                                                    {session.formateur && (
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#64748b', fontSize: '11px', fontWeight: '600' }}>
                                                            <User size={11} />
                                                            {session.formateur.prenom} {session.formateur.nom}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </>
                    )}
                </div>
            </div>

            <style>{`
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            `}</style>
        </>
    );
};

/* ─── Main List ────────────────────────────────────────────────────────────── */
const SallesList = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [salles, setSalles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showFilter, setShowFilter] = useState(false);
    const [openActionId, setOpenActionId] = useState(null);
    const [confirmDeleteId, setConfirmDeleteId] = useState(null);
    const [deletingId, setDeletingId] = useState(null);
    const [occupancySalle, setOccupancySalle] = useState(null);
    const menuRef = useRef(null);

    const queryParams = useMemo(() => ({
        search: searchTerm || undefined,
        per_page: 50,
    }), [searchTerm]);

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                setLoading(true);
                const resp = await listSalles(queryParams);
                if (!mounted) return;
                const raw = resp?.data;
                setSalles(Array.isArray(raw) ? raw : (raw?.data ? raw.data : []));
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
            await deleteSalle(id);
            setSalles(prev => prev.filter((s) => Number(s.id) !== Number(id)));
            toast.success("Salle supprimée avec succès !");
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
                    <h1>Gestion des Salles</h1>
                    <div className="breadcrumb">
                        <Link to="/admin">Dashboard</Link>
                        <ChevronRight size={14} className="breadcrumb-separator" />
                        <span>Salles</span>
                    </div>
                </div>
                <div className="page-header-right">
                    <div className="search-container">
                        <Search size={18} className="search-icon" />
                        <input
                            type="text"
                            placeholder="Rechercher une salle..."
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
                    <Link className="btn btn-primary" to="/admin/salles/add">
                        <PlusCircle size={18} />
                        Ajouter Salle
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
                                <label>Recherche globale</label>
                                <input
                                    type="text"
                                    placeholder="Nom ou type..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="filter-actions">
                            <button className="btn btn-secondary" onClick={() => setSearchTerm('')}>
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
                                <th>Nom de la Salle</th>
                                <th>Type</th>
                                <th>Capacité</th>
                                <th>Occupation</th>
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
                            ) : salles.length > 0 ? salles.map((salle, index) => (
                                <tr key={salle.id}>
                                    <td>{index + 1}</td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <div style={{
                                                width: '32px',
                                                height: '32px',
                                                borderRadius: '8px',
                                                background: 'var(--admin-bg-hover)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: 'var(--admin-primary)',
                                            }}>
                                                <Building2 size={16} />
                                            </div>
                                            <span style={{ fontWeight: '600', color: 'var(--admin-text-main)' }}>{salle.nom}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <span style={{
                                            background: 'var(--admin-bg-hover)',
                                            color: 'var(--admin-primary)',
                                            padding: '4px 8px',
                                            borderRadius: '4px',
                                            fontSize: '11px',
                                            fontWeight: '600',
                                        }}>
                                            {salle.type || 'Non spécifié'}
                                        </span>
                                    </td>
                                    <td>
                                        <span style={{ color: 'var(--admin-text-muted)', fontSize: '13px' }}>
                                            {salle.capacite ? `${salle.capacite} personnes` : 'N/A'}
                                        </span>
                                    </td>

                                    {/* ── Occupancy cell ── */}
                                    <td>
                                        <button
                                            onClick={() => setOccupancySalle(salle)}
                                            title="Voir l'occupation"
                                            style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '6px',
                                                padding: '5px 12px',
                                                borderRadius: '8px',
                                                border: '1px solid',
                                                fontSize: '12px',
                                                fontWeight: '700',
                                                cursor: 'pointer',
                                                transition: 'all 0.15s',
                                                ...(salle.emploi_temps_count > 0
                                                    ? {
                                                        background: '#eef2ff',
                                                        borderColor: '#c7d2fe',
                                                        color: '#6366f1',
                                                    }
                                                    : {
                                                        background: '#f0fdf4',
                                                        borderColor: '#bbf7d0',
                                                        color: '#16a34a',
                                                    }),
                                            }}
                                        >
                                            <Users size={13} />
                                            {salle.emploi_temps_count > 0
                                                ? `${salle.emploi_temps_count} séance(s)`
                                                : 'Libre'}
                                        </button>
                                    </td>

                                    <td style={{ textAlign: 'center' }}>
                                        <div style={{ position: 'relative', display: 'inline-block' }} ref={openActionId === salle.id ? menuRef : null}>
                                            <button
                                                className="action-dropdown-btn"
                                                onClick={(e) => { e.stopPropagation(); setOpenActionId(prev => prev === salle.id ? null : salle.id); }}
                                            >
                                                <EllipsisVertical size={20} />
                                            </button>

                                            {openActionId === salle.id && (
                                                <div className="dropdown-menu">
                                                    <button
                                                        type="button"
                                                        className="dropdown-item"
                                                        onClick={() => { setOpenActionId(null); setOccupancySalle(salle); }}
                                                    >
                                                        <Users size={14} />
                                                        Voir occupation
                                                    </button>
                                                    <Link
                                                        className="dropdown-item"
                                                        to={`/admin/salles/edit/${salle.id}`}
                                                        onClick={() => setOpenActionId(null)}
                                                    >
                                                        <Pencil size={14} />
                                                        Modifier
                                                    </Link>
                                                    <button
                                                        type="button"
                                                        className="dropdown-item danger"
                                                        onClick={() => handleDeleteClick(salle.id)}
                                                        disabled={deletingId === salle.id}
                                                    >
                                                        <Trash2 size={14} />
                                                        {deletingId === salle.id ? 'Suppression...' : 'Supprimer'}
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: 'var(--admin-text-muted)' }}>
                                        Aucune salle trouvée.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <ConfirmModal
                show={confirmDeleteId != null}
                title="Supprimer la salle"
                message="Êtes-vous sûr de vouloir supprimer cette salle ?"
                onConfirm={handleDeleteConfirm}
                onCancel={() => setConfirmDeleteId(null)}
                confirmLabel="Supprimer"
                cancelLabel="Annuler"
                variant="danger"
                confirmLoading={deletingId === confirmDeleteId}
            />

            {/* Occupancy side panel */}
            {occupancySalle && (
                <OccupancyPanel
                    salle={occupancySalle}
                    onClose={() => setOccupancySalle(null)}
                />
            )}
        </div>
    );
};

export default SallesList;
