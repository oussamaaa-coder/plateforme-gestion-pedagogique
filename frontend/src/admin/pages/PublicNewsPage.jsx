import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPublicNews } from '../api/news';

const PublicNewsPage = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const queryParams = useMemo(() => ({
        search: searchTerm || undefined,
        page: currentPage,
        per_page: 12,
    }), [searchTerm, currentPage]);

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                setLoading(true);
                const resp = await getPublicNews(queryParams);
                if (!mounted) return;
                setNews(resp?.data?.data || []);
                setTotalPages(resp?.data?.last_page || 1);
            } catch (e) {
                console.error('Erreur:', e);
            } finally {
                if (mounted) setLoading(false);
            }
        })();
        return () => { mounted = false; };
    }, [queryParams]);

    const resetFilters = () => {
        setSearchTerm('');
        setCurrentPage(1);
    };

    return (
        <>
            <div style={{ paddingTop: '40px', minHeight: '100vh', background: '#f8f9fa' }}>
                <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
                    {/* Header */}
                    <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                        <h1 style={{
                            fontSize: '2.2rem', fontWeight: '700', marginBottom: '12px',
                            color: '#0d2744', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px'
                        }}>
                             <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 20H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h10l4 4v10a2 2 0 0 1-2 2z"></path><polyline points="14 4 14 8 18 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                             Actualités de l'établissement
                        </h1>
                        <p style={{ fontSize: '1.1rem', color: '#666' }}>
                            Restez informé des dernières nouvelles et événements
                        </p>
                    </div>

                    {/* Search */}
                    <div style={{ display: 'flex', gap: '12px', marginBottom: '30px', maxWidth: '600px', margin: '0 auto 30px' }}>
                        <div style={{
                            flex: 1, display: 'flex', alignItems: 'center',
                            background: 'white', borderRadius: '10px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.08)', padding: '0 16px'
                        }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2">
                                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                            </svg>
                            <input
                                type="text"
                                placeholder="Rechercher une actualité..."
                                value={searchTerm}
                                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                                style={{
                                    border: 'none', outline: 'none', padding: '14px 12px',
                                    width: '100%', fontSize: '1rem', background: 'transparent'
                                }}
                            />
                        </div>
                        {searchTerm && (
                            <button
                                onClick={resetFilters}
                                style={{
                                    background: '#e0e0e0', border: 'none', borderRadius: '10px',
                                    padding: '0 20px', cursor: 'pointer', fontSize: '0.9rem',
                                    color: '#555', transition: 'background 0.2s'
                                }}
                            >
                                Réinitialiser
                            </button>
                        )}
                    </div>

                    {/* News Grid – All same style */}
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '60px 0' }}>
                            <div style={{
                                width: '48px', height: '48px', margin: '0 auto 16px',
                                border: '4px solid #e0e0e0', borderTop: '4px solid #0d2744',
                                borderRadius: '50%', animation: 'spin 0.8s linear infinite'
                            }} />
                            <p style={{ color: '#888' }}>Chargement des actualités...</p>
                            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                        </div>
                    ) : news.length > 0 ? (
                        <>
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                                gap: '24px',
                                marginBottom: '40px'
                            }}>
                                {news.map((item) => (
                                    <div
                                        key={item.id}
                                        onClick={() => navigate(`/news/${item.id}`)}
                                        style={{
                                            background: 'white',
                                            borderRadius: '12px',
                                            overflow: 'hidden',
                                            boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                                            cursor: 'pointer',
                                            transition: 'all 0.3s ease',
                                            display: 'flex',
                                            flexDirection: 'column',
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.transform = 'translateY(-4px)';
                                            e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.transform = 'translateY(0)';
                                            e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.06)';
                                        }}
                                    >
                                        {item.image_url ? (
                                            <img
                                                src={item.image_url}
                                                alt={item.titre?.replace(/<[^>]*>/g, '')}
                                                style={{ height: '200px', objectFit: 'cover', width: '100%' }}
                                                onError={(e) => { e.target.style.display = 'none'; }}
                                            />
                                        ) : (
                                            <div style={{
                                                height: '200px',
                                                background: 'linear-gradient(135deg, #0d2744, #1a4a7a)',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                color: 'white'
                                            }}>
                                                <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 20H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h10l4 4v10a2 2 0 0 1-2 2z"></path><polyline points="14 4 14 8 18 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                                            </div>
                                        )}
                                        <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                            <h3 style={{
                                                fontSize: '1.1rem', fontWeight: '600', color: '#0d2744',
                                                marginBottom: '8px', lineHeight: '1.4'
                                            }}>
                                                {item.titre?.replace(/<[^>]*>/g, '')}
                                            </h3>
                                            <p style={{
                                                fontSize: '0.9rem', color: '#777', lineHeight: '1.5',
                                                flex: 1, marginBottom: '12px'
                                            }}>
                                                {item.resume || item.titre?.replace(/<[^>]*>/g, '')}
                                            </p>
                                            <div style={{
                                                display: 'flex', justifyContent: 'space-between',
                                                fontSize: '0.8rem', color: '#999',
                                                borderTop: '1px solid #f0f0f0', paddingTop: '12px'
                                            }}>
                                                <span>
                                                    {item.auteur?.prenom && item.auteur?.nom 
                                                        ? `${item.auteur.prenom} ${item.auteur.nom}` 
                                                        : ''}
                                                </span>
                                                <span>
                                                    {item.date_publication
                                                        ? new Date(item.date_publication).toLocaleDateString('fr-FR')
                                                        : new Date(item.created_at).toLocaleDateString('fr-FR')
                                                    }
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <nav style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '40px' }}>
                                    <button
                                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                        disabled={currentPage === 1}
                                        style={{
                                            padding: '8px 16px', background: currentPage === 1 ? '#e0e0e0' : 'white',
                                            border: '1px solid #ddd', borderRadius: '8px', cursor: currentPage === 1 ? 'default' : 'pointer',
                                            color: currentPage === 1 ? '#aaa' : '#333'
                                        }}
                                    >
                                        ← Précédent
                                    </button>
                                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                                        const page = currentPage > 2 ? currentPage - 2 + i : i + 1;
                                        return page <= totalPages ? (
                                            <button
                                                key={page}
                                                onClick={() => setCurrentPage(page)}
                                                style={{
                                                    padding: '8px 14px',
                                                    background: currentPage === page ? '#0d2744' : 'white',
                                                    color: currentPage === page ? 'white' : '#333',
                                                    border: '1px solid #ddd', borderRadius: '8px',
                                                    cursor: 'pointer', fontWeight: currentPage === page ? '600' : '400'
                                                }}
                                            >
                                                {page}
                                            </button>
                                        ) : null;
                                    })}
                                    <button
                                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                        disabled={currentPage === totalPages}
                                        style={{
                                            padding: '8px 16px', background: currentPage === totalPages ? '#e0e0e0' : 'white',
                                            border: '1px solid #ddd', borderRadius: '8px', cursor: currentPage === totalPages ? 'default' : 'pointer',
                                            color: currentPage === totalPages ? '#aaa' : '#333'
                                        }}
                                    >
                                        Suivant →
                                    </button>
                                </nav>
                            )}
                        </>
                    ) : (
                        <div style={{
                            textAlign: 'center', padding: '60px 20px',
                            background: 'white', borderRadius: '12px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                        }}>
                             <div style={{ marginBottom: '16px', color: '#0d2744' }}>
                                <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M19 20H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h10l4 4v10a2 2 0 0 1-2 2z"></path><polyline points="14 4 14 8 18 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                             </div>
                            <h3 style={{ color: '#555', marginBottom: '8px' }}>Aucune actualité publiée</h3>
                            <p style={{ color: '#999' }}>Revenez bientôt pour voir les dernières nouvelles</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default PublicNewsPage;
