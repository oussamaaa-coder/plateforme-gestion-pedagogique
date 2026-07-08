import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { deleteFiliere, listFilieres } from '../../../api/filieres';
import { extractApiError } from '../../../api/http';
import ConfirmModal from '../../../components/admin/ConfirmModal';
import { 
    PlusCircle, 
    EllipsisVertical, 
    Pencil, 
    Trash2
} from 'lucide-react';

const FilieresList = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filieres, setFilieres] = useState([]);
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
                const resp = await listFilieres(queryParams);
                if (!mounted) return;
                const raw = resp?.data?.data;
                setFilieres(Array.isArray(raw) ? raw : (raw?.data ? raw.data : []));
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
            await deleteFiliere(id);
            setFilieres(prev => prev.filter((f) => Number(f.id) !== Number(id)));
            toast.success("Filière supprimée avec succès !");
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
                    <h1>Gestion des Filières</h1>
                    <div className="breadcrumb">
                        <span>Administration</span>
                        <span className="breadcrumb-separator">/</span>
                        <span>Pédagogie</span>
                        <span className="breadcrumb-separator">/</span>
                        <span className="text-primary">Filières</span>
                    </div>
                </div>
                <div className="page-header-right">
                    <div className="search-container me-2">
                        <svg className="search-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                        <input 
                            type="text" 
                            placeholder="Rechercher une filière..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Link className="btn btn-primary" to="/admin/filieres/add">
                        <PlusCircle size={18} />
                        Ajouter Filière
                    </Link>
                </div>
            </div>

            <div className="table-card">
                <div className="table-wrapper">
                    <table className="table">
                        <thead>
                            <tr>
                                <th style={{ width: '80px' }}>ID</th>
                                <th>Nom de la Filière</th>
                                <th>Description</th>
                                <th style={{ width: '100px', textAlign: 'center' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="4" className="text-center py-5">
                                        <div className="spinner-border spinner-border-sm text-primary me-2"></div>
                                        Chargement...
                                    </td>
                                </tr>
                            ) : filieres.length > 0 ? filieres.map((filiere, index) => (
                                <tr key={filiere.id}>
                                    <td><span className="text-muted">#{filiere.id}</span></td>
                                    <td>
                                        <div className="cell-name">{filiere.nom}</div>
                                        <div className="cell-sub">{filiere.code || 'CODE-N/A'}</div>
                                    </td>
                                    <td>
                                        <div className="text-truncate" style={{ maxWidth: '300px' }}>
                                            {filiere.description || <span className="text-muted italic">Aucune description</span>}
                                        </div>
                                    </td>
                                    <td className="text-center">
                                        <div style={{ position: 'relative', display: 'inline-block' }} ref={openActionId === filiere.id ? menuRef : null}>
                                            <button
                                                className="action-dropdown-btn"
                                                onClick={(e) => { e.stopPropagation(); setOpenActionId(prev => prev === filiere.id ? null : filiere.id); }}
                                            >
                                                <EllipsisVertical size={18} />
                                            </button>
                                            
                                            {openActionId === filiere.id && (
                                                <div className="dropdown-menu">
                                                    <Link
                                                        className="dropdown-item"
                                                        to={`/admin/filieres/edit/${filiere.id}`}
                                                        onClick={() => setOpenActionId(null)}
                                                    >
                                                        <Pencil size={14} />
                                                        Modifier
                                                    </Link>
                                                    <button
                                                        type="button"
                                                        className="dropdown-item danger"
                                                        onClick={() => handleDeleteClick(filiere.id)}
                                                        disabled={deletingId === filiere.id}
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
                                    <td colSpan="4" className="text-center py-5 text-muted">
                                        Aucune filière trouvée.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <ConfirmModal
                show={confirmDeleteId != null}
                title="Supprimer la filière"
                message="Êtes-vous sûr de vouloir supprimer cette filière ? Cette action est irréversible."
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

export default FilieresList;
