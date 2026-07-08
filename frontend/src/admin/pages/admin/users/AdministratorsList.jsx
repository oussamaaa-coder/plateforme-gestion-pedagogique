import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { deleteAdministrator, listAdministrators } from '../../../api/administrators';
import { extractApiError } from '../../../api/http';
import ConfirmModal from '../../../components/admin/ConfirmModal';
import { PlusCircle, Trash2, Pencil, EllipsisVertical, Search, ChevronRight, Filter, X } from 'lucide-react';
import { getInitials } from '../../../../core';

const AdministratorsList = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [administrators, setAdministrators] = useState([]);
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
                const resp = await listAdministrators(queryParams);
                if (!mounted) return;
                const raw = resp?.data?.data;
                setAdministrators(Array.isArray(raw) ? raw : (raw?.data ? raw.data : []));
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
            await deleteAdministrator(id);
            setAdministrators(prev => prev.filter((a) => Number(a.id) !== Number(id)));
            toast.success("Administrateur supprimé avec succès !");
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
                    <h1>Gestion des Administrateurs</h1>
                    <div className="breadcrumb">
                        <Link to="/admin">Dashboard</Link>
                        <ChevronRight size={14} className="breadcrumb-separator" />
                        <span>Administrateurs</span>
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
                    <Link className="btn btn-primary" to="/admin/administrators/add">
                        <PlusCircle size={18} />
                        Ajouter Administrateur
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
                                    placeholder="Nom, Email..." 
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
                                <th>Administrateur</th>
                                <th>Date Création</th>
                                <th style={{ width: '80px', textAlign: 'center' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="4" style={{ textAlign: 'center', padding: '40px' }}>
                                        <div style={{ color: 'var(--admin-text-muted)' }}>Chargement des données...</div>
                                    </td>
                                </tr>
                            ) : administrators.length > 0 ? administrators.map((admin, index) => (
                                <tr key={admin.id}>
                                    <td>{index + 1}</td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <div className="avatar-circle">
                                                {getInitials(`${admin.prenom} ${admin.nom}`)}
                                            </div>
                                            <div className="user-info">
                                                <p className="cell-name">{admin.prenom} {admin.nom}</p>
                                                <p className="cell-sub">{admin.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <span style={{ fontSize: '13px', color: 'var(--admin-text-muted)' }}>
                                            {admin.created_at ? new Date(admin.created_at).toLocaleDateString('fr-FR') : '-'}
                                        </span>
                                    </td>
                                    <td style={{ textAlign: 'center' }}>
                                        <div style={{ position: 'relative', display: 'inline-block' }} ref={openActionId === admin.id ? menuRef : null}>
                                            <button
                                                className="action-dropdown-btn"
                                                onClick={(e) => { e.stopPropagation(); setOpenActionId(prev => prev === admin.id ? null : admin.id); }}
                                            >
                                                <EllipsisVertical size={20} />
                                            </button>
                                            
                                            {openActionId === admin.id && (
                                                <div className="dropdown-menu">
                                                    <Link
                                                        className="dropdown-item"
                                                        to={`/admin/administrators/edit/${admin.id}`}
                                                        onClick={() => setOpenActionId(null)}
                                                    >
                                                        <Pencil size={14} />
                                                        Modifier
                                                    </Link>
                                                    <button
                                                        type="button"
                                                        className="dropdown-item danger"
                                                        onClick={() => handleDeleteClick(admin.id)}
                                                        disabled={deletingId === admin.id}
                                                    >
                                                        <Trash2 size={14} />
                                                        {deletingId === admin.id ? 'Suppression...' : 'Supprimer'}
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="4" style={{ textAlign: 'center', padding: '40px', color: 'var(--admin-text-muted)' }}>
                                        Aucun administrateur trouvé.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <ConfirmModal
                show={confirmDeleteId != null}
                title="Supprimer l'administrateur"
                message="Êtes-vous sûr de vouloir supprimer cet administrateur ? Cette action est irréversible."
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

export default AdministratorsList;
