import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { deleteResource, listResources } from '../../../api/resources';
import { listFilieres } from '../../../api/filieres';
import { listGroupes } from '../../../api/groupes';
import { listTrainers } from '../../../api/trainers';
import { extractApiError } from '../../../api/http';
import { CoursIcon, TdIcon, TpIcon, ResourcesIcon } from '../../../components/ResourceIcons';
import { 
    PlusCircle, 
    RefreshCw, 
    User, 
    Layers, 
    Users, 
    Calendar, 
    File, 
    Download, 
    Pencil, 
    Trash2, 
    Inbox 
} from 'lucide-react';

const ResourcesList = () => {
    // États pour les filtres
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('');
    const [filterFiliere, setFilterFiliere] = useState('');
    const [filterGroupe, setFilterGroupe] = useState('');
    const [filterFormateur, setFilterFormateur] = useState('');
    
    // états pour les données
    const [resources, setResources] = useState([]);
    const [filieres, setFilieres] = useState([]);
    const [groupes, setGroupes] = useState([]);
    const [trainers, setTrainers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Charger les options de filtres au montage
    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                const [fResp, gResp, tResp] = await Promise.all([
                    listFilieres({ per_page: 200 }),
                    listGroupes({ per_page: 200 }),
                    listTrainers({ per_page: 200 })
                ]);
                if (!mounted) return;
                setFilieres(fResp?.data?.data || []);
                setGroupes(gResp?.data?.data || []);
                setTrainers(tResp?.data?.data || []);
            } catch (e) {
                console.error('Erreur chargement filtres:', e);
            }
        })();
        return () => { mounted = false; };
    }, []);

    // Charger les ressources avec filtres
    const queryParams = useMemo(() => ({
        search: searchTerm || undefined,
        type: filterType || undefined,
        filiere_id: filterFiliere || undefined,
        groupe_id: filterGroupe || undefined,
        formateur_id: filterFormateur || undefined,
        page: currentPage,
        per_page: 12,
    }), [searchTerm, filterType, filterFiliere, filterGroupe, filterFormateur, currentPage]);

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                setLoading(true);
                const resp = await listResources(queryParams);
                if (!mounted) return;
                setResources(resp?.data?.data || []);
                setTotalPages(resp?.data?.last_page || 1);
            } catch (e) {
                toast.error(extractApiError(e));
            } finally {
                if (mounted) setLoading(false);
            }
        })();
        return () => { mounted = false; };
    }, [queryParams]);

    const handleDelete = (id, titre) => {
        if (window.confirm(`Êtes-vous sûr de vouloir supprimer "${titre}" ?`)) {
            (async () => {
                try {
                    await deleteResource(id);
                    setResources(prev => prev.filter(r => r.id !== id));
                    toast.success('Ressource supprimée avec succès !');
                } catch (e) {
                    toast.error(extractApiError(e));
                }
            })();
        }
    };

    const handleDownload = (resource) => {
        if (!resource.file_url) {
            toast.warning('Le fichier n\'est pas disponible');
            return;
        }

        try {
            // Créer un élément lien pour le téléchargement
            const link = document.createElement('a');
            link.href = resource.file_url;
            link.download = resource.titre || 'ressource';
            link.setAttribute('target', '_blank');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            toast.success(`Téléchargement de "${resource.titre}" en cours...`);
        } catch (error) {
            console.error('Erreur téléchargement:', error);
            toast.error('Erreur lors du téléchargement');
        }
    };

    const resetFilters = () => {
        setSearchTerm('');
        setFilterType('');
        setFilterFiliere('');
        setFilterGroupe('');
        setFilterFormateur('');
        setCurrentPage(1);
    };

    const getTypeIcon = (type) => {
        switch(type) {
            case 'Cours': return <CoursIcon size={16} className="me-1" />;
            case 'TD': return <TdIcon size={16} className="me-1" />;
            case 'TP': return <TpIcon size={16} className="me-1" />;
            default: return null;
        }
    };

    const getTypeBadgeClass = (type) => {
        switch(type) {
            case 'Cours': return 'bg-primary';
            case 'TD': return 'bg-info';
            case 'TP': return 'bg-success';
            default: return 'bg-secondary';
        }
    };

    return (
        <div className="admin-scope">
            <div className="page-header">
                <div className="page-header-left">
                    <h1>Ressources Pédagogiques</h1>
                    <div className="breadcrumb">
                        <span>Administration</span>
                        <span className="breadcrumb-separator">/</span>
                        <span>Contenu</span>
                        <span className="breadcrumb-separator">/</span>
                        <span className="text-primary">Ressources</span>
                    </div>
                </div>
                <div className="page-header-right">
                    <div className="search-container me-2">
                        <svg className="search-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                        <input 
                            type="text" 
                            placeholder="Rechercher par titre..." 
                            value={searchTerm}
                            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                        />
                    </div>
                    <Link className="btn btn-primary" to="/admin/resources/add">
                        <PlusCircle size={18} />
                        Ajouter Ressource
                    </Link>
                </div>
            </div>

            {/* ── Barre de filtres ────────────────────────────── */}
            <div className="filter-card mb-4">
                <div className="row align-items-end g-3">
                    <div className="col-12 col-md-2">
                        <div className="form-group mb-0">
                            <label className="mb-2">Type</label>
                            <select value={filterType} onChange={(e) => { setFilterType(e.target.value); setCurrentPage(1); }}>
                                <option value="">Tous les types</option>
                                <option value="Cours">Cours</option>
                                <option value="TD">TD</option>
                                <option value="TP">TP</option>
                            </select>
                        </div>
                    </div>
                    <div className="col-12 col-md-3">
                        <div className="form-group mb-0">
                            <label className="mb-2">Filière</label>
                            <select value={filterFiliere} onChange={(e) => { setFilterFiliere(e.target.value); setCurrentPage(1); }}>
                                <option value="">Toutes les filières</option>
                                {filieres.map(f => <option key={f.id} value={f.id}>{f.nom}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className="col-12 col-md-3">
                        <div className="form-group mb-0">
                            <label className="mb-2">Groupe</label>
                            <select value={filterGroupe} onChange={(e) => { setFilterGroupe(e.target.value); setCurrentPage(1); }}>
                                <option value="">Tous les groupes</option>
                                {groupes.map(g => <option key={g.id} value={g.id}>{g.nom}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className="col-12 col-md-2">
                        <div className="form-group mb-0">
                            <label className="mb-2">Formateur</label>
                            <select value={filterFormateur} onChange={(e) => { setFilterFormateur(e.target.value); setCurrentPage(1); }}>
                                <option value="">Tous</option>
                                {trainers.map(t => <option key={t.id} value={t.id}>{t.prenom} {t.nom}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className="col-12 col-md-2 d-flex justify-content-md-end">
                        <button className="btn btn-secondary w-100" onClick={resetFilters} style={{ height: '42px' }}>
                            <RefreshCw size={16} />
                            Réinitialiser
                        </button>
                    </div>
                </div>
            </div>

            {/* ── Affichage des ressources ────────────────────── */}
            {loading ? (
                <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status"></div>
                    <p className="mt-2 text-muted">Chargement des ressources...</p>
                </div>
            ) : resources.length > 0 ? (
                <>
                    <div className="row g-4">
                        {resources.map((resource) => (
                            <div key={resource.id} className="col-lg-4 col-md-6">
                                <div className="card h-100 border-0 shadow-sm" style={{ borderRadius: '16px', overflow: 'hidden', border: '1px solid #f1f5f9' }}>
                                    <div className="card-body p-4 d-flex flex-column">
                                        <div className="d-flex justify-content-between align-items-start mb-3">
                                            <div className={`p-2 rounded-3 ${
                                                resource.type === 'Cours' ? 'bg-primary-light text-primary' :
                                                resource.type === 'TD' ? 'bg-info-light text-info' :
                                                'bg-success-light text-success'
                                            }`}>
                                                {getTypeIcon(resource.type)}
                                            </div>
                                            <span className={`badge ${
                                                resource.type === 'Cours' ? 'badge-info' :
                                                resource.type === 'TD' ? 'badge-warning' :
                                                'badge-success'
                                            }`}>
                                                {resource.type}
                                            </span>
                                        </div>

                                        <h6 className="fw-bold mb-2 text-dark" style={{ fontSize: '15px', lineHeight: '1.4' }}>
                                            {resource.titre}
                                        </h6>

                                        <div className="mt-3 mb-4 flex-grow-1">
                                            <div className="d-flex align-items-center mb-2 text-muted small">
                                                <User size={14} className="me-2" />
                                                <span>{resource.formateur?.prenom} {resource.formateur?.nom}</span>
                                            </div>
                                            <div className="d-flex align-items-center mb-2 text-muted small">
                                                <Layers size={14} className="me-2" />
                                                <span className="text-truncate">{resource.module?.filiere?.nom || 'Filière N/A'}</span>
                                            </div>
                                            <div className="d-flex align-items-center mb-2 text-muted small">
                                                <Users size={14} className="me-2" />
                                                <span>{resource.groupe?.nom || 'Groupe N/A'}</span>
                                            </div>
                                            <div className="d-flex align-items-center text-muted small">
                                                <Calendar size={14} className="me-2" />
                                                <span>{new Date(resource.created_at).toLocaleDateString('fr-FR')}</span>
                                            </div>
                                        </div>

                                        <div className="d-flex gap-2 pt-3 border-top">
                                            <button 
                                                className="btn btn-primary flex-grow-1"
                                                onClick={() => handleDownload(resource)}
                                            >
                                                <Download size={16} /> Télécharger
                                            </button>
                                            <Link 
                                                to={`/admin/resources/edit/${resource.id}`}
                                                className="btn btn-secondary px-3"
                                                title="Modifier"
                                            >
                                                <Pencil size={16} />
                                            </Link>
                                            <button 
                                                className="btn btn-ghost text-danger px-3"
                                                onClick={() => handleDelete(resource.id, resource.titre)}
                                                title="Supprimer"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="d-flex justify-content-center mt-5">
                            <div className="pagination-container p-2 bg-white rounded-pill shadow-sm border">
                                <button 
                                    className="btn btn-ghost btn-sm rounded-pill px-3" 
                                    disabled={currentPage === 1}
                                    onClick={() => setCurrentPage(currentPage - 1)}
                                >
                                    Précédent
                                </button>
                                <div className="d-inline-flex gap-1 mx-2">
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                        <button 
                                            key={page} 
                                            className={`btn btn-sm rounded-circle p-0 ${currentPage === page ? 'btn-primary' : 'btn-ghost'}`}
                                            style={{ width: '32px', height: '32px' }}
                                            onClick={() => setCurrentPage(page)}
                                        >
                                            {page}
                                        </button>
                                    ))}
                                </div>
                                <button 
                                    className="btn btn-ghost btn-sm rounded-pill px-3" 
                                    disabled={currentPage === totalPages}
                                    onClick={() => setCurrentPage(currentPage + 1)}
                                >
                                    Suivant
                                </button>
                            </div>
                        </div>
                    )}
                </>
            ) : (
                <div className="no-data-card animate__animated animate__fadeIn">
                    <div className="no-data-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="11" y1="8" x2="11" y2="14"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>
                    </div>
                    <h4>Aucune ressource trouvée</h4>
                    <p>Nous n'avons trouvé aucun document correspondant à vos critères de recherche. Essayez de modifier les filtres ou de réinitialiser la recherche.</p>
                    <button className="btn btn-primary-outline mt-4" onClick={resetFilters}>
                        <RefreshCw size={16} className="me-2" />
                        Réinitialiser tous les filtres
                    </button>
                </div>
            )}
        </div>
    );
};

export default ResourcesList;
