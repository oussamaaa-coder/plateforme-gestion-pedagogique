import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
    Search, 
    AlertCircle, 
    Clock, 
    Bell, 
    ArrowRight,
    SearchCheck,
    CalendarDays
} from 'lucide-react';
import '../../assets/css/Admission.css';

function ResultatsAdmission() {
    const fadeIn = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5 }
    };

    return (
        <div className="adm-page-wrapper">
            {/* Hero Section */}
            <header className="h-hero-section">
                <motion.div 
                    className="h-hero-container"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="h-hero-tag">Suivi de Candidature</div>
                    <h1 className="h-hero-title">Résultats d'Admission</h1>
                    <p className="h-hero-subtitle">
                        Consultez en temps réel l'état d'avancement des listes d'admission pour la session 2024/2025.
                    </p>
                </motion.div>
            </header>

            {/* Breadcrumb */}
            <nav className="h-breadcrumb-section">
                <div className="h-breadcrumb-container">
                    <Link to="/">Accueil</Link>
                    <span className="h-breadcrumb-sep">›</span>
                    <span>Admission</span>
                    <span className="h-breadcrumb-sep">›</span>
                    <span>Résultats d'Admission</span>
                </div>
            </nav>

            <div className="adm-container">
                <div className="adm-content-grid">
                    {/* Left Sidebar */}
                    <aside className="h-sidebar-sticky">
                        <div className="h-sidebar-card">
                            <h3 className="h-sidebar-title">Admission</h3>
                            <ul className="h-sidebar-list">
                                <li className="h-sidebar-item">
                                    <Link to="/condition-acces">Conditions d'Accès</Link>
                                </li>
                                <li className="h-sidebar-item">
                                    <Link to="/procedure-inscription">Procédure d'Inscription</Link>
                                </li>
                                <li className="h-sidebar-item active">
                                    <Link to="/resultats-admission">
                                        Résultats d'Admission <span className="h-sidebar-active-arrow">›</span>
                                    </Link>
                                </li>
                                <li className="h-sidebar-item">
                                    <Link to="/bourse">Bourses d'Études</Link>
                                </li>
                            </ul>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="adm-main-content">
                        <motion.section 
                            className="adm-section-card"
                            {...fadeIn}
                            style={{ textAlign: 'center', padding: '60px 40px' }}
                        >
                            <div style={{ 
                                width: '80px', 
                                height: '80px', 
                                background: '#fefce8', 
                                color: '#eab308', 
                                borderRadius: '50%', 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center', 
                                margin: '0 auto 25px' 
                            }}>
                                <Clock size={40} />
                            </div>
                            
                            <h2 style={{ color: 'var(--adm-navy)', fontSize: '1.8rem', fontWeight: 800, marginBottom: '15px' }}>
                                En attente de publication
                            </h2>
                            
                            <p style={{ color: 'var(--adm-muted)', maxWidth: '500px', margin: '0 auto 30px', lineHeight: 1.6 }}>
                                Les listes d'admission ne sont pas encore disponibles pour la nouvelle rentrée. Nous traitons actuellement les dossiers déposés.
                            </p>

                            <div style={{ 
                                background: 'rgba(0, 168, 150, 0.05)', 
                                border: '1px solid rgba(0, 168, 150, 0.1)', 
                                padding: '20px', 
                                borderRadius: '12px',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '12px',
                                color: 'var(--adm-navy)',
                                fontSize: '0.9rem',
                                fontWeight: 600
                            }}>
                                <Bell size={18} className="text-accent" />
                                Soyez notifiés dès la publication des résultats
                            </div>
                        </motion.section>

                        <motion.div 
                            className="adm-content-grid" 
                            style={{ gridTemplateColumns: '1fr 1fr', gap: '25px', marginTop: '30px' }}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                        >
                            <div className="adm-section-card" style={{ marginBottom: 0 }}>
                                <h4 style={{ color: 'var(--adm-navy)', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <SearchCheck size={20} className="text-accent" />
                                    Comment vérifier ?
                                </h4>
                                <p style={{ fontSize: '0.88rem', color: 'var(--adm-muted)', lineHeight: 1.6 }}>
                                    Une fois publiées, les listes seront affichées à l'institut et disponibles en ligne via votre numéro de CIN.
                                </p>
                            </div>
                            
                            <div className="adm-section-card" style={{ marginBottom: 0 }}>
                                <h4 style={{ color: 'var(--adm-navy)', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <CalendarDays size={20} className="text-accent" />
                                    Sessions 2024
                                </h4>
                                <p style={{ fontSize: '0.88rem', color: 'var(--adm-muted)', lineHeight: 1.6 }}>
                                    Les premières vagues de résultats sont généralement attendues fin Juillet pour les bacheliers.
                                </p>
                            </div>
                        </motion.div>
                    </main>

                    {/* Right Sidebar */}
                    <aside className="adm-sidebar-right">
                        <div className="adm-sidebar-card" style={{ padding: '25px' }}>
                            <h3 style={{ fontSize: '0.95rem', color: 'var(--adm-navy)', fontWeight: 700, marginBottom: '15px' }}>Besoin d'aide ?</h3>
                            <p style={{ fontSize: '0.85rem', color: 'var(--adm-muted)', lineHeight: 1.6, marginBottom: '20px' }}>
                                Si vous rencontrez des difficultés techniques ou avez des questions sur votre dossier :
                            </p>
                            <Link to="/contact" className="md-btn-submit" style={{ textDecoration: 'none', display: 'block', textAlign: 'center' }}>
                                Contacter l'administration
                            </Link>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}

export default ResultatsAdmission;