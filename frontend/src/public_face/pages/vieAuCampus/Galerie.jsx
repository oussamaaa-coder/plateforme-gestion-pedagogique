import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Calendar, ImageIcon, Clock, CalendarDays, Sparkles, X } from 'lucide-react';
import SidebarLeft from '../../components/vieAuCampus/SidebarLeft';
import ContactSidebar from '../../components/vieAuCampus/ContactSidebar';
import Stack from '../../components/vieAuCampus/Stack';
import '../../assets/css/VieAuCampus.css';
import '../../assets/css/FilliereDetail.css';

import img1 from '../../assets/images/Galerie/12Septambre2023.jpg';
import img2 from '../../assets/images/Galerie/12Septembre2023.jpg';
import img3 from '../../assets/images/Galerie/1Janver2024.jpg';
import img4 from '../../assets/images/Galerie/1Janvier2024.jpg';
import img5 from '../../assets/images/Galerie/30Novembre2023_La commission d\'organisation de l\'événement CyberDay excelle.jpg';
import img6 from '../../assets/images/Galerie/4Janver2024Le donne du sang.jpg';
import img7 from '../../assets/images/Galerie/9Novembre2022.jpg';
import img8 from '../../assets/images/Galerie/9Novenmbre2022.png';

const PHOTOS = [
    { id: 1, title: "Événement Campus", date: "2023-09-12", url: img1, category: "Campus" },
    { id: 2, title: "Vie Étudiante", date: "2023-09-12", url: img2, category: "Campus" },
    { id: 3, title: "Nouvel An 2024", date: "2024-01-01", url: img3, category: "Événement" },
    { id: 4, title: "Rentrée Janvier", date: "2024-01-01", url: img4, category: "Campus" },
    { id: 5, title: "Commission CyberDay", date: "2023-11-30", url: img5, category: "CyberDay" },
    { id: 6, title: "Don de Sang", date: "2024-01-04", url: img6, category: "Social" },
    { id: 7, title: "Souvenir 2022", date: "2022-11-09", url: img7, category: "Archives" },
    { id: 8, title: "Conférence", date: "2022-11-09", url: img8, category: "Événement" },
];

export default function Galerie() {
    const [sortOrder, setSortOrder] = useState('newest');
    const [showStack, setShowStack] = useState(false);

    useEffect(() => { window.scrollTo(0, 0); }, []);

    const groupedPhotos = useMemo(() => {
        const sorted = [...PHOTOS].sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
        });

        return sorted.reduce((acc, photo) => {
            const dateStr = photo.date;
            if (!acc[dateStr]) acc[dateStr] = [];
            acc[dateStr].push(photo);
            return acc;
        }, {});
    }, [sortOrder]);

    const formatLongDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    return (
        <div className="fd-page-wrapper">
            <header className="h-hero-section">
                <div className="h-hero-container">
                    <div className="h-hero-tag">SOUVENIRS</div>
                    <h1 className="h-hero-title">Galerie Photos</h1>
                    <p className="h-hero-subtitle">
                        Plongez au cœur de l'ambiance du campus. Nos moments forts capturés
                        et organisés pour vous.
                    </p>
                </div>
            </header>

            <nav className="h-breadcrumb-section">
                <div className="h-breadcrumb-container">
                    <Link to="/">Accueil</Link> <span className="h-breadcrumb-sep">›</span> <span>Vie au Campus</span> <span className="h-breadcrumb-sep">›</span> <span>Galerie Photos</span>
                </div>
            </nav>

            <div className="fd-content-grid fd-container">
                <SidebarLeft />

                <main className="fd-main-article">
                    <div className="vc-page-content">

                        <div className="vc-galerie-header">
                            <div className="vc-header-left">
                                <div className="vc-galerie-info">
                                    <ImageIcon size={24} color="#00a896" />
                                    <span>{PHOTOS.length} Moments capturés</span>
                                </div>
                                <button
                                    className={`vc-explore-btn ${showStack ? 'active' : ''}`}
                                    onClick={() => setShowStack(!showStack)}
                                >
                                    {showStack ? <X size={16} /> : <Sparkles size={16} />}
                                    {showStack ? 'Quitter Explore' : 'Bon Explore'}
                                </button>
                            </div>

                            <div className="vc-galerie-sort">
                                <button
                                    className={`vc-sort-btn ${sortOrder === 'newest' ? 'active' : ''}`}
                                    onClick={() => { setSortOrder('newest'); setShowStack(false); }}
                                >
                                    <Clock size={16} />
                                    Récent
                                </button>
                                <button
                                    className={`vc-sort-btn ${sortOrder === 'oldest' ? 'active' : ''}`}
                                    onClick={() => { setSortOrder('oldest'); setShowStack(false); }}
                                >
                                    <Calendar size={16} />
                                    Ancien
                                </button>
                            </div>
                        </div>

                        <AnimatePresence mode='wait'>
                            {showStack ? (
                                <motion.div
                                    key="stack-view"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className="vc-stack-explorer"
                                >
                                    <div className="vc-stack-wrapper">
                                        <Stack
                                            randomRotation={true}
                                            sensitivity={180}
                                            sendToBackOnClick={true}
                                            cards={PHOTOS.map(p => (
                                                <div className="vc-stack-card-inner">
                                                    <img src={p.url} alt={p.title} className="card-image" />
                                                    <div className="vc-stack-label">{p.title}</div>
                                                </div>
                                            ))}
                                        />
                                    </div>
                                    <p className="vc-stack-hint">Glissez ou cliquez pour voir la suite</p>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key={sortOrder}
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -15 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    {Object.keys(groupedPhotos).map((date) => (
                                        <div key={date} className="vc-galerie-date-group">
                                            <div className="vc-date-header">
                                                <div className="vc-date-badge">
                                                    <CalendarDays size={18} />
                                                    <h3 style={{ color: "white" }}>{formatLongDate(date)}</h3>
                                                </div>
                                                <div className="vc-date-line"></div>
                                            </div>

                                            <div className="vc-galerie-grid">
                                                {groupedPhotos[date].map((photo, pIdx) => (
                                                    <motion.div
                                                        key={photo.id}
                                                        initial={{ opacity: 0, scale: 0.95 }}
                                                        whileInView={{ opacity: 1, scale: 1 }}
                                                        viewport={{ once: true }}
                                                        transition={{ delay: pIdx * 0.05 }}
                                                        className="vc-photo-card"
                                                    >
                                                        <img src={photo.url} alt={photo.title} className="vc-photo-img" />
                                                        <div className="vc-photo-overlay">
                                                            <h4 className="vc-photo-title">{photo.title}</h4>
                                                        </div>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </main>

                <ContactSidebar />
            </div>
        </div>
    );
}