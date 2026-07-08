import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getPublicNews } from '../../../admin/api/news';
import actualitesData from './actualites.json';
import '../../assets/css/Actualite.css';

// Fallback images
import image1 from '../../assets/images/actualité/image1.png';
import image2 from '../../assets/images/actualité/image2.jpg';
import image3 from '../../assets/images/actualité/image3.jpg';
import image4 from '../../assets/images/actualité/image4.jpg';
import image5 from '../../assets/images/actualité/image5.jpg';

const fallbackImagesMap = {
    image1,
    image2,
    image3,
    image4,
    image5
};

const Actualite = () => {
    const navigate = useNavigate();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedNews, setSelectedNews] = useState(null);
    const [visibleCards, setVisibleCards] = useState(3);
    const [newsItems, setNewsItems] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fallback static data
    const staticItems = actualitesData.map(item => ({
        ...item,
        imageSrc: fallbackImagesMap[item.image] || item.image,
        isStatic: true,
    }));

    // Fetch news from API
    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                setLoading(true);
                const resp = await getPublicNews({ per_page: 10 });
                if (!mounted) return;
                const apiNews = resp?.data?.data || [];
                if (apiNews.length > 0) {
                    setNewsItems(apiNews.map(item => ({
                        id: item.id,
                        titre: item.titre?.replace(/<[^>]*>/g, '') || '',
                        description: item.resume || item.contenu?.substring(0, 200) || '',
                        imageSrc: item.image_url || null,
                        date: item.date_publication,
                        auteur: item.auteur ? `${item.auteur.prenom} ${item.auteur.nom}` : '',
                        isStatic: false,
                    })));
                } else {
                    setNewsItems(staticItems);
                }
            } catch (e) {
                console.error('Erreur chargement actualités:', e);
                if (mounted) setNewsItems(staticItems);
            } finally {
                if (mounted) setLoading(false);
            }
        })();
        return () => { mounted = false; };
    }, []);

    const updateVisibleCards = useCallback(() => {
        if (window.innerWidth <= 768) {
            setVisibleCards(1);
        } else if (window.innerWidth <= 1024) {
            setVisibleCards(2);
        } else {
            setVisibleCards(3);
        }
    }, []);

    useEffect(() => {
        updateVisibleCards();
        window.addEventListener('resize', updateVisibleCards);
        return () => window.removeEventListener('resize', updateVisibleCards);
    }, [updateVisibleCards]);

    const maxIndex = Math.max(0, newsItems.length - visibleCards);

    const handleNext = () => {
        setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    };

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
    };

    const handleDotClick = (index) => {
        setCurrentIndex(index);
    };

    const handleCardClick = (news) => {
        if (!news.isStatic && news.id) {
            navigate(`/news/${news.id}`);
        } else {
            setSelectedNews(news);
        }
    };

    const totalDots = Math.max(1, newsItems.length - visibleCards + 1);
    const currentActiveDot = currentIndex;

    if (loading) {
        return (
            <section className="actualite-section" id="actualites">
                <div className="actualite-header">
                    <h2 className="actualite-header__title">Actualités</h2>
                </div>
                <div style={{ textAlign: 'center', padding: '60px 0' }}>
                    <div className="spinner-border text-primary" role="status" style={{
                        width: '3rem', height: '3rem',
                        border: '3px solid #e0e0e0',
                        borderTop: '3px solid #0d2744',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite',
                    }} />
                </div>
            </section>
        );
    }

    return (
        <section className="actualite-section" id="actualites">
            <div className="actualite-header">
                <h2 className="actualite-header__title">
                    Actualités
                </h2>
            </div>

            <div className="actualite-slider-viewport">
                <motion.div 
                    className="actualite-slider-track"
                    animate={{ x: `calc(-${currentIndex * (100 / visibleCards)}% - ${currentIndex * (30 / visibleCards)}px)` }}
                    transition={{ type: "spring", stiffness: 100, damping: 20 }}
                >
                    {newsItems.map((news, index) => (
                        <div 
                            key={news.id || index} 
                            className="actualite-card-item"
                            style={{ minWidth: `calc((100% - ${(visibleCards - 1) * 30}px) / ${visibleCards})` }}
                        >
                            <motion.div 
                                className="actualite-card"
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                            >
                                <div className="actualite-image-box">
                                    {news.imageSrc ? (
                                        <img 
                                            src={news.imageSrc} 
                                            alt={news.titre} 
                                            onError={(e) => { e.target.style.display = 'none'; }}
                                        />
                                    ) : (
                                        <div style={{
                                            width: '100%', height: '100%',
                                            background: 'linear-gradient(135deg, #0d2744, #1a4a7a)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            color: 'white', fontSize: '3rem'
                                        }}>
                                            📰
                                        </div>
                                    )}
                                </div>
                                <div className="actualite-content-box">
                                    <h3 className="actualite-card-title">{news.titre}</h3>
                                    <p className="actualite-card-excerpt">
                                        {news.description?.length > 120 
                                            ? news.description.substring(0, 120) + '...' 
                                            : news.description}
                                    </p>
                                    {news.auteur && (
                                        <p className="actualite-card-author">
                                            <small style={{ color: '#888' }}>Par {news.auteur}</small>
                                        </p>
                                    )}
                                    <button 
                                        className="actualite-read-more"
                                        onClick={() => handleCardClick(news)}
                                    >
                                        Lire suite
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    ))}
                </motion.div>

                <div className="actualite-controls">
                    <button 
                        className="actualite-ctrl-btn" 
                        onClick={handlePrev}
                        aria-label="Previous"
                    >
                        <ChevronLeft size={24} />
                    </button>

                    <div className="actualite-indicators">
                        {Array.from({ length: totalDots }).map((_, i) => (
                            <div 
                                key={i} 
                                className={`actualite-dot ${currentActiveDot === i ? 'active' : ''}`}
                                onClick={() => handleDotClick(i)}
                            />
                        ))}
                    </div>

                    <button 
                        className="actualite-ctrl-btn" 
                        onClick={handleNext}
                        aria-label="Next"
                    >
                        <ChevronRight size={24} />
                    </button>
                </div>
            </div>

            {/* Modal for static fallback items */}
            <AnimatePresence>
                {selectedNews && (
                    <motion.div 
                        className="actualite-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedNews(null)}
                    >
                        <motion.div 
                            className="actualite-modal-card"
                            initial={{ scale: 0.9, opacity: 0, y: 30 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 30 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {selectedNews.imageSrc && (
                                <img 
                                    src={selectedNews.imageSrc} 
                                    alt={selectedNews.titre} 
                                    className="actualite-modal-image" 
                                />
                            )}
                            <div className="actualite-modal-body">
                                <h2 className="actualite-modal-title">{selectedNews.titre}</h2>
                                <p className="actualite-modal-text">{selectedNews.description}</p>
                                <button 
                                    className="actualite-close-btn"
                                    onClick={() => setSelectedNews(null)}
                                >
                                    <ArrowLeft size={18} /> Retour
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
};

export default Actualite;
