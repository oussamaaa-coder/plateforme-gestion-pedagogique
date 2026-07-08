import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { deleteTrainer, listTrainers } from '../../../api/trainers';
import { extractApiError } from '../../../api/http';
import ConfirmModal from '../../../components/admin/ConfirmModal';
import { getInitials } from '../../../../core';
import { 
    Filter, 
    PlusCircle, 
    EllipsisVertical, 
    Pencil, 
    List, 
    Trash2,
    Search,
    ChevronRight,
    X
} from 'lucide-react';

const TrainersList = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [trainers, setTrainers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showFilter, setShowFilter] = useState(false);
    const [openActionId, setOpenActionId] = useState(null);
    const [confirmDeleteId, setConfirmDeleteId] = useState(null);
    const [deletingId, setDeletingId] = useState(null);
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
                const resp = await listTrainers(queryParams);
                if (!mounted) return;
                const raw = resp?.data?.data;
                setTrainers(Array.isArray(raw) ? raw : (raw?.data ? raw.data : []));
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
            await deleteTrainer(id);
            setTrainers(prev => prev.filter((t) => Number(t.id) !== Number(id)));
            toast.success("Formateur supprimé avec succès !");
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
                    <h1>Gestion des Formateurs</h1>
                    <div className="breadcrumb">
                        <Link to="/admin">Dashboard</Link>
                        <ChevronRight size={14} className="breadcrumb-separator" />
                        <span>Formateurs</span>
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
                    <Link className="btn btn-primary" to="/admin/trainers/add">
                        <PlusCircle size={18} />
                        Ajouter Formateur
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
                                <label>Recherche rapide</label>
                                <input 
                                    type="text" 
                                    placeholder="Nom, CIN, Email..." 
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
                                <th>Formateur</th>
                                <th>Spécialité</th>
                                <th>Groupes</th>
                                <th style={{ width: '80px', textAlign: 'center' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="5" style={{ textAlign: 'center', padding: '40px' }}>
                                        <div style={{ color: 'var(--admin-text-muted)' }}>Chargement des données...</div>
                                    </td>
                                </tr>
                            ) : (trainers.length > 0 ? trainers.map((trainer, index) => (
                                <tr key={trainer.id}>
                                    <td>{index + 1}</td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <div className="avatar-circle">
                                                {getInitials(`${trainer.prenom} ${trainer.nom}`)}
                                            </div>
                                            <div className="user-info">
                                                <p className="cell-name">{trainer.prenom} {trainer.nom}</p>
                                                <p className="cell-sub">{trainer.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <span className="badge badge-info">{trainer.specialite || 'Non définie'}</span>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                                            {trainer.groupes_assignes && trainer.groupes_assignes.length > 0 ? (
                                                trainer.groupes_assignes.map(g => (
                                                    <span key={g.id} className="badge badge-success" style={{ fontSize: '10px' }}>
                                                        {g.nom}
                                                    </span>
                                                ))
                                            ) : (
                                                <span style={{ color: 'var(--admin-text-label)', fontSize: '12px' }}>Aucun groupe</span>
                                            )}
                                        </div>
                                    </td>
                                    <td style={{ textAlign: 'center' }}>
                                        <div style={{ position: 'relative', display: 'inline-block' }} ref={openActionId === trainer.id ? menuRef : null}>
                                            <button
                                                className="action-dropdown-btn"
                                                onClick={(e) => { e.stopPropagation(); setOpenActionId(prev => prev === trainer.id ? null : trainer.id); }}
                                            >
                                                <EllipsisVertical size={20} />
                                            </button>
                                            
                                            {openActionId === trainer.id && (
                                                <div className="dropdown-menu">
                                                    <Link
                                                        className="dropdown-item"
                                                        to={`/admin/trainers/edit/${trainer.id}`}
                                                        onClick={() => setOpenActionId(null)}
                                                    >
                                                        <Pencil size={14} />
                                                        Modifier
                                                    </Link>
                                                    <Link
                                                        className="dropdown-item"
                                                        to={`/admin/trainers/${trainer.id}/assignments`}
                                                        onClick={() => setOpenActionId(null)}
                                                    >
                                                        <List size={14} />
                                                        Affectations
                                                    </Link>
                                                    <button
                                                        type="button"
                                                        className="dropdown-item danger"
                                                        onClick={() => handleDeleteClick(trainer.id)}
                                                        disabled={deletingId === trainer.id}
                                                    >
                                                        <Trash2 size={14} />
                                                        {deletingId === trainer.id ? 'Suppression...' : 'Supprimer'}
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="5" style={{ textAlign: 'center', padding: '40px', color: 'var(--admin-text-muted)' }}>
                                        Aucun formateur trouvé.
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <ConfirmModal
                show={confirmDeleteId != null}
                title="Supprimer le formateur"
                message="Êtes-vous sûr de vouloir supprimer ce formateur ? Cette action est irréversible."
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

export default TrainersList;
