import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
    ClipboardList, 
    FileText, 
    Upload, 
    CheckCircle, 
    ExternalLink, 
    ArrowRight,
    HelpCircle,
    Download,
    Wallet
} from 'lucide-react';
import '../../assets/css/Admission.css';

function ProcedureInscription() {
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
                    <div className="h-hero-tag">Votre Avenir Commence Ici</div>
                    <h1 className="h-hero-title">Procédure d'Inscription</h1>
                    <p className="h-hero-subtitle">
                        Un accompagnement pas à pas pour faciliter votre intégration au sein de l'ISTA NTIC SYBA.
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
                    <span>Procédure d'Inscription</span>
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
                                <li className="h-sidebar-item active">
                                    <Link to="/procedure-inscription">
                                        Procédure d'Inscription <span className="h-sidebar-active-arrow">›</span>
                                    </Link>
                                </li>
                                <li className="h-sidebar-item">
                                    <Link to="/resultats-admission">Résultats d'Admission</Link>
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
                        >
                            <h2 className="adm-card-title">
                                <ClipboardList className="text-accent" size={24} /> 
                                Guide d'Inscription 2024/2025
                            </h2>
                            <p style={{ color: 'var(--adm-muted)', marginBottom: '35px' }}>
                                Suivez ces étapes chronologiques pour valider votre candidature. Notre équipe reste disponible pour toute assistance technique.
                            </p>

                            <div className="adm-steps-container">
                                {/* Step 1 */}
                                <div className="adm-step-item">
                                    <div className="adm-step-number">01</div>
                                    <div className="adm-step-card">
                                        <div className="adm-badge">Phase Digitale</div>
                                        <h4 style={{ color: 'var(--adm-navy)', marginBottom: '10px' }}>Pré-inscription en ligne</h4>
                                        <p style={{ fontSize: '0.9rem', color: 'var(--adm-muted)', marginBottom: '15px' }}>
                                            Renseignez le formulaire électronique sur la plateforme nationale Takwine.
                                        </p>
                                        <a 
                                            href="https://takwine.ofppt.ma" 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="md-btn-submit"
                                            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', textDecoration: 'none', padding: '10px 20px', fontSize: '0.8rem' }}
                                        >
                                            Plateforme Takwine <ExternalLink size={14} />
                                        </a>
                                    </div>
                                </div>

                                {/* Step 2 */}
                                <div className="adm-step-item">
                                    <div className="adm-step-number">02</div>
                                    <div className="adm-step-card">
                                        <div className="adm-badge">Dossier</div>
                                        <h4 style={{ color: 'var(--adm-navy)', marginBottom: '10px' }}>Achat du dossier d'orientation</h4>
                                        <p style={{ fontSize: '0.9rem', color: 'var(--adm-muted)' }}>
                                            À retirer auprès de l'ISTA NTIC SYBA ou de tout établissement de l'OFPPT.
                                            <strong> Prix : 50 Dhs.</strong>
                                        </p>
                                    </div>
                                </div>

                                {/* Step 3 */}
                                <div className="adm-step-item">
                                    <div className="adm-step-number">03</div>
                                    <div className="adm-step-card">
                                        <div className="adm-badge">Dépôt</div>
                                        <h4 style={{ color: 'var(--adm-navy)', marginBottom: '10px' }}>Constitution du dossier physique</h4>
                                        <ul className="adm-feature-list" style={{ marginTop: '15px' }}>
                                            <li style={{ fontSize: '0.85rem', display: 'flex', gap: '10px', color: 'var(--adm-muted)' }}>
                                                <FileText size={16} color="var(--adm-accent)" /> 2 copies du diplôme ou certificat de scolarité
                                            </li>
                                            <li style={{ fontSize: '0.85rem', display: 'flex', gap: '10px', color: 'var(--adm-muted)' }}>
                                                <FileText size={16} color="var(--adm-accent)" /> 2 copies de la CIN (ou acte de naissance)
                                            </li>
                                            <li style={{ fontSize: '0.85rem', display: 'flex', gap: '10px', color: 'var(--adm-muted)' }}>
                                                <FileText size={16} color="var(--adm-accent)" /> 2 photos d'identité récentes
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </motion.section>

                        {/* Scholarship Section */}
                        <motion.section 
                            className="adm-section-card"
                            {...fadeIn}
                        >
                            <h2 className="adm-card-title">
                                <Wallet className="text-accent" size={24} /> 
                                Bourses d'Études (Minhaty)
                            </h2>
                            <p style={{ color: 'var(--adm-muted)', marginBottom: '20px' }}>
                                Les stagiaires de l'OFPPT peuvent bénéficier de la bourse d'études, octroyée en trois tranches annuelles.
                            </p>

                            <div className="adm-table-wrapper">
                                <table className="adm-data-table">
                                    <thead>
                                        <tr>
                                            <th>Tranche</th>
                                            <th>Période</th>
                                            <th>Montant</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>1ère Tranche</td>
                                            <td>Octobre</td>
                                            <td>1900 Dhs</td>
                                        </tr>
                                        <tr>
                                            <td>2ème Tranche</td>
                                            <td>Février</td>
                                            <td>1900 Dhs</td>
                                        </tr>
                                        <tr>
                                            <td>3ème Tranche</td>
                                            <td>Mai</td>
                                            <td>1900 Dhs</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <div style={{ marginTop: '25px', padding: '20px', background: 'var(--adm-bg)', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <h5 style={{ color: 'var(--adm-navy)', marginBottom: '5px' }}>Demande de bourse</h5>
                                    <p style={{ fontSize: '0.85rem', color: 'var(--adm-muted)' }}>Effectuez votre demande sur le portail Minhaty.</p>
                                </div>
                                <a 
                                    href="https://www.minhaty.ma" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    style={{ color: 'var(--adm-accent)', fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '5px' }}
                                >
                                    minhaty.ma <ExternalLink size={16} />
                                </a>
                            </div>
                        </motion.section>
                    </main>

                    {/* Right Sidebar */}
                    <aside className="adm-sidebar-right">
                        <div className="adm-sidebar-card">
                            <h3 className="adm-sidebar-title" style={{ background: 'var(--adm-accent)' }}>Resources</h3>
                            <div style={{ padding: '20px' }}>
                                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                    <li>
                                        <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--adm-navy)', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 600 }}>
                                            <Download size={18} /> Guide du Stagiaire (PDF)
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--adm-navy)', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 600 }}>
                                            <Download size={18} /> Liste des pièces (Checklist)
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div className="adm-sidebar-card" style={{ padding: '25px', textAlign: 'center' }}>
                            <HelpCircle size={40} color="var(--adm-accent)" style={{ marginBottom: '15px' }} />
                            <h4 style={{ color: 'var(--adm-navy)', marginBottom: '10px' }}>Une question ?</h4>
                            <p style={{ fontSize: '0.85rem', color: 'var(--adm-muted)', lineHeight: 1.5 }}>
                                Notre service admission vous répond du Lundi au Vendredi (8h30 - 16h30).
                            </p>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}

export default ProcedureInscription;