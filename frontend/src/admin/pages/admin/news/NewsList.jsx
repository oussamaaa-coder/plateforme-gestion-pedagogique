import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { deleteNews, listNews } from '../../../api/news';
import { listTrainers } from '../../../api/trainers';
import { extractApiError, STORAGE_URL } from '../../../api/http';
import { 
    PlusCircle, 
    RefreshCw, 
    User, 
    Calendar, 
    Eye, 
    Pencil, 
    Trash2, 
    FileText
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import ConfirmModal from '../../../components/admin/ConfirmModal';

const NewsList = () => {
    const { user } = useAuth();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatut, setFilterStatut] = useState('');
    const [filterAuteur, setFilterAuteur] = useState('');
    
    const [news, setNews] = useState([]);
    const [trainers, setTrainers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [confirmDeleteId, setConfirmDeleteId] = useState(null);
    const [deletingId, setDeletingId] = useState(null);

    // Charger les formateurs
    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                const resp = await listTrainers({ per_page: 200 });
                if (!mounted) return;
                setTrainers(resp?.data?.data || []);
            } catch (e) {
                console.error('Erreur chargement formateurs:', e);
            }
        })();
        return () => { mounted = false; };
    }, []);

    // Charger les actualités
    const queryParams = useMemo(() => ({
        search: searchTerm || undefined,
        statut: filterStatut || undefined,
        auteur_id: filterAuteur || undefined,
        page: currentPage,
        per_page: 12,
    }), [searchTerm, filterStatut, filterAuteur, currentPage]);

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                setLoading(true);
                const resp = await listNews(queryParams);
                if (!mounted) return;
                setNews(resp?.data?.data || []);
                setTotalPages(resp?.data?.last_page || 1);
            } catch (e) {
                toast.error(extractApiError(e));
            } finally {
                if (mounted) setLoading(false);
            }
        })();
        return () => { mounted = false; };
    }, [queryParams]);

    const handleDeleteClick = (id) => {
        setConfirmDeleteId(id);
    };

    const handleDeleteConfirm = async () => {
        const id = confirmDeleteId;
        if (!id) return;
        
        try {
            setDeletingId(id);
            await deleteNews(id);
            setNews(news.filter(n => n.id !== id));
            toast.success('Actualité supprimée avec succès');
            setConfirmDeleteId(null);
        } catch (e) {
            toast.error(extractApiError(e));
        } finally {
            setDeletingId(null);
        }
    };

    const resetFilters = () => {
        setSearchTerm('');
        setFilterStatut('');
        setFilterAuteur('');
        setCurrentPage(1);
    };

    const getStatutBadge = (statut) => {
        switch(statut) {
            case 'brouillon': return 'badge-warning';
            case 'publiee': return 'badge-success';
            case 'archivee': return 'badge-secondary';
            default: return 'badge-light';
        }
    };

    const getStatutLabel = (statut) => {
        switch(statut) {
            case 'brouillon': return 'Brouillon';
            case 'publiee': return 'Publiée';
            case 'archivee': return 'Archivée';
            default: return statut;
        }
    };

    return (
        <div className="admin-scope">
            <div className="page-header">
                <div className="page-header-left">
                    <h1>Gestion des Actualités</h1>
                    <div className="breadcrumb">
                        <span>Administration</span>
                        <span className="breadcrumb-separator">/</span>
                        <span>Contenu</span>
                        <span className="breadcrumb-separator">/</span>
                        <span className="text-primary">Actualités</span>
                    </div>
                </div>
                <div className="page-header-right">
                    <div className="search-container me-2">
                        <svg className="search-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                        <input 
                            type="text" 
                            placeholder="Rechercher une actualité..." 
                            value={searchTerm}
                            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                        />
                    </div>
                    {user?.role === 'admin' && (
                        <Link className="btn btn-primary" to="/admin/news/add">
                            <PlusCircle size={18} />
                            Ajouter Actualité
                        </Link>
                    )}
                </div>
            </div>

            {/* ── Barre de filtres ────────────────────────────── */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                    <div className="md:col-span-4">
                        <div className="mb-0">
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Statut</label>
                            <select 
                                className="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all" 
                                value={filterStatut} 
                                onChange={(e) => { setFilterStatut(e.target.value); setCurrentPage(1); }}
                            >
                                <option value="">Tous les statuts</option>
                                <option value="brouillon">Brouillon</option>
                                <option value="publiee">Publiée</option>
                                <option value="archivee">Archivée</option>
                            </select>
                        </div>
                    </div>
                    <div className="md:col-span-5">
                        <div className="mb-0">
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Auteur</label>
                            <select 
                                className="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all" 
                                value={filterAuteur} 
                                onChange={(e) => { setFilterAuteur(e.target.value); setCurrentPage(1); }}
                            >
                                <option value="">Tous les auteurs</option>
                                {trainers.map(t => (
                                    <option key={t.id} value={t.id}>{t.prenom} {t.nom}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="md:col-span-3 flex justify-end">
                        <button 
                            className="w-full flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2.5 rounded-xl transition-all" 
                            onClick={resetFilters}
                        >
                            <RefreshCw size={18} />
                            Réinitialiser
                        </button>
                    </div>
                </div>
            </div>

            {/* Actualités */}
            {loading ? (
                <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status"></div>
                    <p className="mt-2 text-muted">Chargement des actualités...</p>
                </div>
            ) : news.length > 0 ? (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {news.map((item) => (
                            <div key={item.id} className="flex items-stretch">
                                <div 
                                    className="card w-full border-0 shadow-sm flex flex-col" 
                                    style={{ 
                                        borderRadius: '16px', 
                                        overflow: 'hidden', 
                                        border: '1px solid #f1f5f9',
                                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                        backgroundColor: '#ffffff'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'translateY(-5px)';
                                        e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.06)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = '0 0.125rem 0.25rem rgba(0,0,0,0.075)';
                                    }}
                                >
                                    <div className="relative w-full">
                                        {item.image_url || item.image ? (
                                            <img 
                                                src={item.image_url || `${STORAGE_URL}/${item.image}`} 
                                                className="w-full object-cover" 
                                                alt={item.titre}
                                                style={{ height: '220px' }}
                                            />
                                        ) : (
                                            <div className="w-full flex items-center justify-center" style={{ height: '220px', background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)' }}>
                                                <FileText size={56} className="text-slate-400 opacity-25" />
                                            </div>
                                        )}
                                        <div className="absolute top-4 right-4">
                                            <span 
                                                className={`badge ${getStatutBadge(item.statut)}`} 
                                                style={{ 
                                                    padding: '8px 12px', 
                                                    borderRadius: '8px', 
                                                    fontWeight: '600', 
                                                    fontSize: '12px',
                                                    letterSpacing: '0.5px',
                                                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                                                    backdropFilter: 'blur(4px)'
                                                }}
                                            >
                                                {getStatutLabel(item.statut)}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <div className="p-5 flex flex-col flex-1 bg-white">
                                        <h6 className="font-bold text-slate-800 mb-3" style={{ fontSize: '18px', lineHeight: '1.4', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                            {item.titre.replace(/<[^>]*>/g, '')}
                                        </h6>

                                        {item.resume && (
                                            <p className="text-slate-500 text-sm mb-4" style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: '1.6' }}>
                                                {item.resume}
                                            </p>
                                        )}

                                        <div className="mt-auto pt-4 border-t border-slate-100 flex justify-between items-center">
                                            <div className="flex items-center text-slate-500 text-sm font-medium">
                                                <Calendar size={15} className="mr-2 text-blue-600" />
                                                {new Date(item.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </div>
                                            <div className="flex items-center text-slate-500 text-sm font-medium">
                                                <User size={15} className="mr-2 text-blue-600" />
                                                {item.auteur?.prenom || 'N/A'}
                                            </div>
                                        </div>

                                        <div className="flex gap-2 mt-4 pt-2">
                                            <Link 
                                                to={`/admin/news/${item.id}`}
                                                className="flex-1 flex items-center justify-center gap-2"
                                                style={{ backgroundColor: '#f1f5f9', color: '#475569', fontWeight: '600', borderRadius: '10px', transition: 'all 0.2s', padding: '10px' }}
                                                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#e2e8f0'; e.currentTarget.style.color = '#334155'; }}
                                                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#f1f5f9'; e.currentTarget.style.color = '#475569'; }}
                                            >
                                                <Eye size={18} /> <span className="text-sm">Voir</span>
                                            </Link>
                                            {user?.role === 'admin' && (
                                                <>
                                                    <Link 
                                                        to={`/admin/news/${item.id}/edit`}
                                                        className="px-4 flex items-center justify-center"
                                                        title="Modifier"
                                                        style={{ backgroundColor: 'rgba(55, 131, 230, 0.1)', color: '#3783e6', borderRadius: '10px', transition: 'all 0.2s' }}
                                                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(55, 131, 230, 0.2)'; }}
                                                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'rgba(55, 131, 230, 0.1)'; }}
                                                    >
                                                        <Pencil size={18} />
                                                    </Link>
                                                    <button 
                                                        className="px-4 flex items-center justify-center"
                                                        onClick={() => handleDeleteClick(item.id)}
                                                        disabled={deletingId === item.id}
                                                        title="Supprimer"
                                                        style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', borderRadius: '10px', transition: 'all 0.2s' }}
                                                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.2)'; }}
                                                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)'; }}
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </>
                                            )}
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
                        <FileText size={40} />
                    </div>
                    <h4>Aucune actualité</h4>
                    <p>Nous n'avons trouvé aucune actualité correspondant à vos filtres. Essayez de réinitialiser la recherche.</p>
                    <button className="btn btn-primary-outline mt-4" onClick={resetFilters}>
                        <RefreshCw size={16} className="me-2" />
                        Réinitialiser tous les filtres
                    </button>
                </div>
            )}

            <ConfirmModal
                show={confirmDeleteId != null}
                title="Supprimer l'actualité"
                message="Êtes-vous sûr de vouloir supprimer cette actualité ? Cette action est irréversible."
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

export default NewsList;
