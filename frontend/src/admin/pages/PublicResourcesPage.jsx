import React, { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { listResources } from '../../../api/resources';
import { listFilieres } from '../../../api/filieres';
import { listGroupes } from '../../../api/groupes';
import { extractApiError } from '../../../api/http';
import { CoursIcon, TdIcon, TpIcon, ResourcesIcon } from '../components/ResourceIcons';

const PublicResourcesPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('');
    const [filterFiliere, setFilterFiliere] = useState('');
    const [filterGroupe, setFilterGroupe] = useState('');
    
    const [resources, setResources] = useState([]);
    const [filieres, setFilieres] = useState([]);
    const [groupes, setGroupes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Charger les filtres
    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                const [fResp, gResp] = await Promise.all([
                    listFilieres({ per_page: 200 }),
                    listGroupes({ per_page: 200 })
                ]);
                if (!mounted) return;
                setFilieres(fResp?.data?.data || []);
                setGroupes(gResp?.data?.data || []);
            } catch (e) {
                console.error('Erreur chargement filtres:', e);
            }
        })();
        return () => { mounted = false; };
    }, []);

    // Charger les ressources
    const queryParams = useMemo(() => ({
        search: searchTerm || undefined,
        type: filterType || undefined,
        filiere_id: filterFiliere || undefined,
        groupe_id: filterGroupe || undefined,
        page: currentPage,
        per_page: 12,
    }), [searchTerm, filterType, filterFiliere, filterGroupe, currentPage]);

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
        <div className="min-vh-100 bg-light py-5">
            <div className="container">
                {/* Header */}
                <div className="text-center mb-5">
                    <h1 className="display-5 fw-bold mb-3"><ResourcesIcon size={32} className="me-3" style={{verticalAlign: 'middle'}} />Ressources Pédagogiques</h1>
                    <p className="lead text-muted">Accédez aux cours, TD et TP partagés par vos formateurs</p>
                </div>

                {/* Barre de recherche */}
                <div className="row mb-4">
                    <div className="col-md-8">
                        <div className="input-group input-group-lg shadow-sm">
                            <span className="input-group-text bg-white border-0">
                                <i className="fe fe-search"></i>
                            </span>
                            <input 
                                type="text" 
                                className="form-control border-0 fs-6" 
                                placeholder="Rechercher une ressource..." 
                                value={searchTerm}
                                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                            />
                        </div>
                    </div>
                    <div className="col-md-4">
                        <button 
                            className="btn btn-outline-secondary btn-lg w-100"
                            onClick={resetFilters}
                        >
                            <i className="fe fe-refresh-cw me-2"></i>Réinitialiser
                        </button>
                    </div>
                </div>

                {/* Filtres */}
                <div className="row mb-4 g-3">
                    <div className="col-md-3">
                        <label className="form-label fw-bold d-block mb-2">TYPE</label>
                        <select 
                            className="form-select form-select-lg" 
                            value={filterType}
                            onChange={(e) => { setFilterType(e.target.value); setCurrentPage(1); }}
                        >
                            <option value="">Tous les types</option>
                            <option value="Cours">Cours</option>
                            <option value="TD">TD</option>
                            <option value="TP">TP</option>
                        </select>
                    </div>
                    <div className="col-md-3">
                        <label className="form-label fw-bold d-block mb-2">FILIÈRE</label>
                        <select 
                            className="form-select form-select-lg" 
                            value={filterFiliere}
                            onChange={(e) => { setFilterFiliere(e.target.value); setCurrentPage(1); }}
                        >
                            <option value="">Toutes les filières</option>
                            {filieres.map(f => (
                                <option key={f.id} value={f.id}>{f.nom}</option>
                            ))}
                        </select>
                    </div>
                    <div className="col-md-3">
                        <label className="form-label fw-bold d-block mb-2">GROUPE</label>
                        <select 
                            className="form-select form-select-lg" 
                            value={filterGroupe}
                            onChange={(e) => { setFilterGroupe(e.target.value); setCurrentPage(1); }}
                        >
                            <option value="">Tous les groupes</option>
                            {groupes.map(g => (
                                <option key={g.id} value={g.id}>{g.nom}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Ressources */}
                {loading ? (
                    <div className="text-center py-5">
                        <div className="spinner-border text-primary mb-3" role="status">
                            <span className="visually-hidden">Chargement...</span>
                        </div>
                        <p className="text-muted">Chargement des ressources...</p>
                    </div>
                ) : resources.length > 0 ? (
                    <>
                        <div className="row mb-5">
                            {resources.map((resource) => (
                                <div key={resource.id} className="col-lg-4 col-md-6 col-sm-12 mb-4">
                                    <div className="card h-100 border-0 shadow-sm hover-shadow transition" style={{cursor: 'pointer', transition: 'transform 0.2s'}}>
                                        <div className="card-body d-flex flex-column">
                                            {/* Header avec icône et type */}
                                            <div className="d-flex justify-content-between align-items-start mb-3">
                                                <div className="flex-grow-1">
                                                    <h5 className="card-title mb-2 text-dark" title={resource.titre}>
                                                        {resource.titre.length > 26 ? resource.titre.substring(0, 26) + '...' : resource.titre}
                                                    </h5>
                                                </div>
                                                <span className={`badge ${getTypeBadgeClass(resource.type)} text-white ms-2`} style={{whiteSpace: 'nowrap'}}>
                                                    {getTypeIcon(resource.type)}
                                                </span>
                                            </div>

                                            {/* Info Formateur */}
                                            <div className="border-bottom pb-3 mb-3">
                                                <small className="text-muted d-block">
                                                    <i className="fe fe-user me-1"></i>
                                                    <strong>{resource.formateur?.prenom} {resource.formateur?.nom}</strong>
                                                </small>
                                            </div>

                                            {/* Détails */}
                                            <div className="small text-muted mb-3 flex-grow-1">
                                                <div className="mb-2">
                                                    <i className="fe fe-layers me-1"></i>
                                                    <span className="badge bg-light text-dark">{resource.module?.filiere?.nom}</span>
                                                </div>
                                                <div className="mb-2">
                                                    <i className="fe fe-users me-1"></i>
                                                    <span className="badge bg-light text-dark">{resource.groupe?.nom}</span>
                                                </div>
                                                <div>
                                                    <i className="fe fe-calendar me-1"></i>
                                                    {new Date(resource.created_at).toLocaleDateString('fr-FR')}
                                                </div>
                                            </div>

                                            {/* Type de fichier */}
                                            <div className="alert alert-light py-2 mb-3 small text-center">
                                                <i className={`fe fe-file${resource.file_type === 'PDF' ? '-text text-danger' : ''}`}></i>
                                                <br/>
                                                <strong>{resource.file_type || 'Fichier'}</strong>
                                            </div>

                                            {/* Bouton d'action */}
                                            <button 
                                                className="btn btn-primary btn-lg w-100"
                                                onClick={() => handleDownload(resource)}
                                            >
                                                <i className="fe fe-download me-2"></i>Télécharger
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <nav aria-label="Pagination" className="mb-5">
                                <ul className="pagination justify-content-center">
                                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                        <button className="page-link" onClick={() => setCurrentPage(currentPage - 1)}>
                                            Précédent
                                        </button>
                                    </li>
                                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                                        const page = currentPage > 2 ? currentPage - 2 + i : i + 1;
                                        return page <= totalPages ? (
                                            <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                                                <button className="page-link" onClick={() => setCurrentPage(page)}>
                                                    {page}
                                                </button>
                                            </li>
                                        ) : null;
                                    })}
                                    <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                        <button className="page-link" onClick={() => setCurrentPage(currentPage + 1)}>
                                            Suivant
                                        </button>
                                    </li>
                                </ul>
                            </nav>
                        )}
                    </>
                ) : (
                    <div className="alert alert-info text-center py-5">
                        <i className="fe fe-inbox display-1"></i>
                        <h5 className="mt-3 text-muted">Aucune ressource disponible</h5>
                        <p className="text-muted">Essayez de modifier vos filtres de recherche</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PublicResourcesPage;
