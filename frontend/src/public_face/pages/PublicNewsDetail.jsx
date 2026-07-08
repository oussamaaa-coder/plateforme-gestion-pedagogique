import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPublicNewsById } from '../../admin/api/news';
import '../assets/css/PublicNewsDetail.css';

const PublicNewsDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [news, setNews] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                setLoading(true);
                const resp = await getPublicNewsById(id);
                if (!mounted) return;
                if (!resp?.data) {
                    setError(true);
                } else {
                    setNews(resp.data);
                }
            } catch (e) {
                console.error('Erreur chargement actualité:', e);
                if (mounted) setError(true);
            } finally {
                if (mounted) setLoading(false);
            }
        })();
        return () => { mounted = false; };
    }, [id]);

    if (loading) {
        return (
            <>
                <div className="pnd-loading">
                    <div className="pnd-spinner" />
                    <p>Chargement de l'actualité...</p>
                </div>
            </>
        );
    }

    if (error || !news) {
        return (
            <>
                <div className="pnd-error">
                    <div className="pnd-error-icon">📰</div>
                    <h2>Actualité non trouvée</h2>
                    <p>L'article que vous recherchez n'existe pas ou n'est plus disponible.</p>
                    <button className="pnd-back-btn" onClick={() => navigate('/news')}>
                        ← Voir toutes les actualités
                    </button>
                </div>
            </>
        );
    }

    return (
        <>
            <main className="pnd-main">
                <article className="pnd-article">
                    {/* Breadcrumb */}
                    <nav className="pnd-breadcrumb">
                        <button onClick={() => navigate('/')}>Accueil</button>
                        <span className="pnd-breadcrumb-sep">›</span>
                        <button onClick={() => navigate('/news')}>Actualités</button>
                        <span className="pnd-breadcrumb-sep">›</span>
                        <span className="pnd-breadcrumb-current">
                            {news.titre?.replace(/<[^>]*>/g, '').substring(0, 40)}
                            {news.titre?.length > 40 ? '...' : ''}
                        </span>
                    </nav>

                    {/* Header */}
                    <header className="pnd-header">
                        <h1 className="pnd-title">{news.titre?.replace(/<[^>]*>/g, '')}</h1>
                        <div className="pnd-meta">
                            {news.auteur?.prenom && news.auteur?.nom && (
                                <span className="pnd-meta-item">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                        <circle cx="12" cy="7" r="4" />
                                    </svg>
                                    {news.auteur.prenom} {news.auteur.nom}
                                </span>
                            )}
                            {news.date_publication && (
                                <span className="pnd-meta-item">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                        <line x1="16" y1="2" x2="16" y2="6" />
                                        <line x1="8" y1="2" x2="8" y2="6" />
                                        <line x1="3" y1="10" x2="21" y2="10" />
                                    </svg>
                                    {new Date(news.date_publication).toLocaleDateString('fr-FR', {
                                        year: 'numeric', month: 'long', day: 'numeric'
                                    })}
                                </span>
                            )}
                            {news.vues !== undefined && (
                                <span className="pnd-meta-item">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                        <circle cx="12" cy="12" r="3" />
                                    </svg>
                                    {news.vues} vue{news.vues > 1 ? 's' : ''}
                                </span>
                            )}
                        </div>
                    </header>

                    {/* Image */}
                    {news.image_url && (
                        <div className="pnd-image-wrap">
                            <img 
                                src={news.image_url} 
                                alt={news.titre?.replace(/<[^>]*>/g, '')} 
                                className="pnd-image"
                                onError={(e) => { e.target.style.display = 'none'; }}
                            />
                        </div>
                    )}

                    {/* Resume */}
                    {news.resume && (
                        <div className="pnd-resume">
                            <p>{news.resume}</p>
                        </div>
                    )}

                    {/* Content */}
                    <div className="pnd-content">
                        {news.contenu?.split('\n').map((para, idx) => (
                            para.trim() && <p key={idx}>{para}</p>
                        ))}
                    </div>

                    {/* Actions */}
                    <div className="pnd-actions">
                        <button className="pnd-back-btn" onClick={() => navigate('/news')}>
                            ← Retour aux actualités
                        </button>
                    </div>
                </article>
            </main>
        </>
    );
};

export default PublicNewsDetail;
