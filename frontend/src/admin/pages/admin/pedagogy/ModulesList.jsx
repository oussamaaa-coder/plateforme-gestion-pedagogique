import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { deleteModule, listModules } from '../../../api/modules';
import { listFilieres } from '../../../api/filieres';
import { extractApiError } from '../../../api/http';
import ConfirmModal from '../../../components/admin/ConfirmModal';
import { 
    PlusCircle, 
    EllipsisVertical, 
    Pencil, 
    Trash2,
    RefreshCw
} from 'lucide-react';

const ModulesList = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedFiliere, setSelectedFiliere] = useState('');
    const [selectedAnnee, setSelectedAnnee] = useState('');
    const [modules, setModules] = useState([]);
    const [filieres, setFilieres] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showFilter, setShowFilter] = useState(false);
    const [openActionId, setOpenActionId] = useState(null);
    const [confirmDeleteId, setConfirmDeleteId] = useState(null);
    const [deletingId, setDeletingId] = useState(null);
    const menuRef = useRef(null);

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
                const fResp = await listFilieres({ per_page: 200 });
                if (!mounted) return;
                setFilieres(fResp?.data?.data || []);
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
                const resp = await listModules(queryParams);
                if (!mounted) return;
                const raw = resp?.data?.data;
                setModules(Array.isArray(raw) ? raw : (raw?.data ? raw.data : []));
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
            await deleteModule(id);
            setModules(prev => prev.filter((m) => Number(m.id) !== Number(id)));
            toast.success("Module supprimé avec succès !");
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
                    <h1>Gestion des Modules</h1>
                    <div className="breadcrumb">
                        <span>Administration</span>
                        <span className="breadcrumb-separator">/</span>
                        <span>Pédagogie</span>
                        <span className="breadcrumb-separator">/</span>
                        <span className="text-primary">Modules</span>
                    </div>
                </div>
                <div className="page-header-right">
                    <div className="search-container me-2">
                        <svg className="search-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" x1="21" x2="16.65" y2="16.65"></line></svg>
                        <input 
                            type="text" 
                            placeholder="Rechercher un module..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Link className="btn btn-primary" to="/admin/modules/add">
                        <PlusCircle size={18} />
                        Ajouter Module
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
                                <th>Nom du Module</th>
                                <th style={{ width: '120px' }}>Coefficient</th>
                                <th>Année</th>
                                <th>Filière</th>
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
                            ) : modules.length > 0 ? modules.map((module) => (
                                <tr key={module.id}>
                                    <td><span className="text-muted">#{module.id}</span></td>
                                    <td>
                                        <div className="cell-name">{module.nom}</div>
                                    </td>
                                    <td>
                                        <span className="badge badge-info px-3">Coef: {module.coefficient}</span>
                                    </td>
                                    <td>
                                        <div className="cell-sub">
                                            {module.annee ? (module.annee === 1 ? '1ère année' : '2ème année') : 'N/A'}
                                        </div>
                                    </td>
                                    <td>
                                        <span className="badge badge-success">{module.filiere?.nom || 'N/A'}</span>
                                    </td>
                                    <td className="text-center">
                                        <div style={{ position: 'relative', display: 'inline-block' }} ref={openActionId === module.id ? menuRef : null}>
                                            <button
                                                className="action-dropdown-btn"
                                                onClick={(e) => { e.stopPropagation(); setOpenActionId(prev => prev === module.id ? null : module.id); }}
                                            >
                                                <EllipsisVertical size={18} />
                                            </button>
                                            
                                            {openActionId === module.id && (
                                                <div className="dropdown-menu">
                                                    <Link
                                                        className="dropdown-item"
                                                        to={`/admin/modules/edit/${module.id}`}
                                                        onClick={() => setOpenActionId(null)}
                                                    >
                                                        <Pencil size={14} />
                                                        Modifier
                                                    </Link>
                                                    <button
                                                        type="button"
                                                        className="dropdown-item danger"
                                                        onClick={() => handleDeleteClick(module.id)}
                                                        disabled={deletingId === module.id}
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
                                        Aucun module trouvé.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <ConfirmModal
                show={confirmDeleteId != null}
                title="Supprimer le module"
                message="Êtes-vous sûr de vouloir supprimer ce module ? Cette action est irréversible."
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

export default ModulesList;
