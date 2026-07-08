import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
    Wallet, 
    Gift, 
    Globe, 
    CheckCircle, 
    ArrowRight,
    Info,
    LayoutDashboard,
    Banknote
} from 'lucide-react';
import '../../assets/css/Admission.css';

function Bourse() {
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
                    <div className="h-hero-tag">Soutien & Accompagnement</div>
                    <h1 className="h-hero-title">Bourses d'Études</h1>
                    <p className="h-hero-subtitle">
                        Découvrez les différentes aides financières destinées à accompagner votre réussite académique.
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
                    <span>Bourses d'Études</span>
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
                                <li className="h-sidebar-item">
                                    <Link to="/resultats-admission">Résultats d'Admission</Link>
                                </li>
                                <li className="h-sidebar-item active">
                                    <Link to="/bourse">
                                        Bourses d'Études <span className="h-sidebar-active-arrow">›</span>
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="adm-main-content">
                        <motion.section 
                            className="adm-section-card"
                            {...fadeIn}
                        >
                            <h2 className="adm-card-title">
                                <Banknote className="text-accent" size={24} /> 
                                Bourse Minhaty (OFPPT)
                            </h2>
                            <p style={{ color: 'var(--adm-muted)', marginBottom: '25px', lineHeight: 1.7 }}>
                                Tous les stagiaires de l'OFPPT titulaires d’un baccalauréat et inscrits dans les niveaux de formation de Technicien Spécialisé ou de Technicien peuvent bénéficier de la bourse d’étude.
                            </p>
                            
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
                                <div style={{ padding: '20px', background: 'var(--adm-bg)', borderRadius: '12px' }}>
                                    <h5 style={{ color: 'var(--adm-navy)', marginBottom: '10px' }}>Montant Annuel</h5>
                                    <p style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--adm-accent)' }}>5700 Dhs</p>
                                    <p style={{ fontSize: '0.8rem', color: 'var(--adm-muted)' }}>Versé en 3 tranches de 1900 Dhs.</p>
                                </div>
                                <div style={{ padding: '20px', background: 'var(--adm-bg)', borderRadius: '12px' }}>
                                    <h5 style={{ color: 'var(--adm-navy)', marginBottom: '10px' }}>Condition de résidence</h5>
                                    <p style={{ fontSize: '0.88rem', color: 'var(--adm-muted)' }}>Accordée aux stagiaires dont les parents résident hors de la ville siège de l'institut.</p>
                                </div>
                            </div>
                        </motion.section>

                        <motion.section 
                            className="adm-section-card"
                            {...fadeIn}
                        >
                            <h2 className="adm-card-title">
                                <Gift className="text-accent" size={24} /> 
                                Autres aides financières
                            </h2>
                            <div className="adm-feature-list">
                                <div className="adm-list-item">
                                    <div className="adm-item-icon"><LayoutDashboard size={20} /></div>
                                    <div className="adm-item-content">
                                        <h4>Bourse de l'Entraide Nationale</h4>
                                        <p>Destinée aux stagiaires en situation de précarité sociale. Renseignez-vous auprès de l'administration pour les dossiers.</p>
                                    </div>
                                </div>
                                <div className="adm-list-item">
                                    <div className="adm-item-icon"><Globe size={20} /></div>
                                    <div className="adm-item-content">
                                        <h4>Bourses de Mérite</h4>
                                        <p>Prix d'excellence pour les majors de promotion afin d'encourager la performance académique au sein du digital.</p>
                                    </div>
                                </div>
                            </div>
                        </motion.section>
                    </main>

                    {/* Right Sidebar */}
                    <aside className="adm-sidebar-right">
                        <div className="adm-sidebar-card" style={{ padding: '25px', background: 'var(--adm-navy)', color: 'white' }}>
                            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '15px' }}>Besoin d'aide ?</h3>
                            <p style={{ fontSize: '0.85rem', opacity: 0.8, lineHeight: 1.6, marginBottom: '20px' }}>
                                Si vous avez des questions sur l'éligibilité ou le dépôt de dossier Social.
                            </p>
                            <Link to="/contact" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--adm-accent-lt)', textDecoration: 'none', fontWeight: 700 }}>
                                Contacter l'administration <ArrowRight size={16} />
                            </Link>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}

export default Bourse;
