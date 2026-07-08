import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
    UserCheck, 
    ShieldCheck, 
    GraduationCap, 
    Brain, 
    Languages, 
    Calendar, 
    ArrowRight,
    Search,
    Info,
    CheckCircle2
} from 'lucide-react';
import '../../assets/css/Admission.css';

function ConditionAcces() {
    const fadeIn = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5 }
    };

    const stagger = {
        animate: {
            transition: {
                staggerChildren: 0.1
            }
        }
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
                    <div className="h-hero-tag">Excellence & Réussite</div>
                    <h1 className="h-hero-title">Conditions d'Accès</h1>
                    <p className="h-hero-subtitle">
                        Rejoignez une institution de référence et donnez un élan décisif à votre carrière dans le digital.
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
                    <span>Conditions d'Accès</span>
                </div>
            </nav>

            <div className="adm-container">
                <div className="adm-content-grid">
                    {/* Left Sidebar */}
                    <aside className="h-sidebar-sticky">
                        <div className="h-sidebar-card">
                            <h3 className="h-sidebar-title">Admission</h3>
                            <ul className="h-sidebar-list">
                                <li className="h-sidebar-item active">
                                    <Link to="/condition-acces">
                                        Conditions d'Accès <span className="h-sidebar-active-arrow">›</span>
                                    </Link>
                                </li>
                                <li className="h-sidebar-item">
                                    <Link to="/procedure-inscription">Procédure d'Inscription</Link>
                                </li>
                                <li className="h-sidebar-item">
                                    <Link to="/resultats-admission">Résultats d'Admission</Link>
                                </li>
                                <li className="h-sidebar-item">
                                    <Link to="/bourse">Bourses d'Études</Link>
                                </li>
                            </ul>
                        </div>
                        
                        <div className="adm-sidebar-card" style={{ background: 'var(--adm-navy)', color: 'white', padding: '25px' }}>
                            <h4 style={{ color: 'var(--adm-accent-lt)', marginBottom: '10px', fontSize: '0.9rem' }}>Besoin d'aide ?</h4>
                            <p style={{ fontSize: '0.85rem', opacity: 0.8, lineHeight: 1.5, marginBottom: '20px' }}>
                                Nos conseillers sont à votre disposition pour vous guider dans votre choix de filière.
                            </p>
                            <Link to="/contact" style={{ color: 'white', fontWeight: 700, fontSize: '0.85rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                Nous contacter <ArrowRight size={16} />
                            </Link>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="adm-main-content">
                        <motion.section 
                            className="adm-section-card"
                            {...fadeIn}
                        >
                            <h2 className="adm-card-title">
                                <Info className="text-accent" size={24} /> 
                                Profil du Candidat
                            </h2>
                            <p style={{ marginBottom: '25px', color: 'var(--adm-muted)' }}>
                                L'admission à l'ISTA NTIC SYBA est ouverte aux esprits curieux et passionnés par l'innovation technologique.
                                Voici les critères d'éligibilité pour nos différents cycles.
                            </p>

                            <div className="adm-alert" style={{ background: 'var(--adm-accent-bg)', border: '1px solid var(--adm-accent-border)', color: 'var(--adm-navy)' }}>
                                <ShieldCheck size={32} color="var(--adm-accent)" strokeWidth={1.5} />
                                <p style={{ fontSize: '0.95rem', fontWeight: 500 }}>
                                    L'accès est ouvert aux jeunes de nationalité marocaine ainsi qu'aux candidats étrangers dans le cadre de la coopération internationale.
                                </p>
                            </div>
                        </motion.section>

                        <motion.section 
                            className="adm-section-card"
                            variants={stagger}
                            initial="initial"
                            animate="animate"
                        >
                            <h2 className="adm-card-title">
                                <GraduationCap className="text-accent" size={24} /> 
                                Niveaux de Formation
                            </h2>

                            <div className="adm-feature-list">
                                <motion.div className="adm-list-item" variants={fadeIn}>
                                    <div className="adm-item-icon"><UserCheck size={20} /></div>
                                    <div className="adm-item-content">
                                        <div className="adm-badge">Technicien Spécialisé (Bac +2)</div>
                                        <h4>Développement Digital & Infrastructure</h4>
                                        <ul style={{ listStyle: 'none', padding: 0, marginTop: '10px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                            <li style={{ fontSize: '0.85rem', display: 'flex', gap: '8px' }}>
                                                <CheckCircle2 size={14} color="var(--adm-accent)" /> Titulaire du Baccalauréat
                                            </li>
                                            <li style={{ fontSize: '0.85rem', display: 'flex', gap: '8px' }}>
                                                <CheckCircle2 size={14} color="var(--adm-accent)" /> Âge max : 30 ans
                                            </li>
                                            <li style={{ fontSize: '0.85rem', display: 'flex', gap: '8px' }}>
                                                <CheckCircle2 size={14} color="var(--adm-accent)" /> Sélection sur dossier
                                            </li>
                                            <li style={{ fontSize: '0.85rem', display: 'flex', gap: '8px' }}>
                                                <CheckCircle2 size={14} color="var(--adm-accent)" /> Système de passerelles (33 ans)
                                            </li>
                                        </ul>
                                    </div>
                                </motion.div>

                                <motion.div className="adm-list-item" variants={fadeIn}>
                                    <div className="adm-item-icon"><Calendar size={20} /></div>
                                    <div className="adm-item-content">
                                        <div className="adm-badge">Formations Qualifiantes</div>
                                        <h4>Certifications & Spécialisations</h4>
                                        <p>Python, Fibre Optique, Web Marketer, Microsoft Office Specialist.</p>
                                        <div style={{ marginTop: '12px', padding: '12px', background: 'white', borderRadius: '8px', border: '1px solid var(--adm-border)', fontSize: '0.85rem' }}>
                                            <strong>Pré-requis :</strong> Baccalauréat scientifique ou technique, ou Bac+2 selon la filière. 
                                            Entretien de motivation requis.
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        </motion.section>

                        <motion.section 
                            className="adm-section-card"
                            {...fadeIn}
                        >
                            <h2 className="adm-card-title">
                                <Brain className="text-accent" size={24} /> 
                                Aptitudes & Compétences
                            </h2>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                <div style={{ padding: '20px', borderRadius: '12px', border: '1px solid var(--adm-border)' }}>
                                    <h5 style={{ color: 'var(--adm-navy)', marginBottom: '10px' }}>Esprit Logique</h5>
                                    <p style={{ fontSize: '0.85rem', color: 'var(--adm-muted)' }}>Capacité d'analyse et résolution de problèmes complexes.</p>
                                </div>
                                <div style={{ padding: '20px', borderRadius: '12px', border: '1px solid var(--adm-border)' }}>
                                    <h5 style={{ color: 'var(--adm-navy)', marginBottom: '10px' }}>Curiosité Digitale</h5>
                                    <p style={{ fontSize: '0.85rem', color: 'var(--adm-muted)' }}>Veille technologique et passion pour l'innovation.</p>
                                </div>
                                <div style={{ padding: '20px', borderRadius: '12px', border: '1px solid var(--adm-border)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                                        <Languages size={18} color="var(--adm-accent)" />
                                        <h5 style={{ color: 'var(--adm-navy)', margin: 0 }}>Langues</h5>
                                    </div>
                                    <p style={{ fontSize: '0.85rem', color: 'var(--adm-muted)' }}>Maîtrise du Français et de l'Anglais technique.</p>
                                </div>
                                <div style={{ padding: '20px', borderRadius: '12px', border: '1px solid var(--adm-border)' }}>
                                    <h5 style={{ color: 'var(--adm-navy)', marginBottom: '10px' }}>Rigueur</h5>
                                    <p style={{ fontSize: '0.85rem', color: 'var(--adm-muted)' }}>Discipline et sens poussé de l'organisation.</p>
                                </div>
                            </div>
                        </motion.section>
                    </main>

                    {/* Right Sidebar */}
                    <aside className="adm-sidebar-right">
                        <div className="adm-sidebar-card">
                            <div style={{ background: '#f8fafc', padding: '20px', textAlign: 'center', borderBottom: '1px solid var(--adm-border)' }}>
                                <div style={{ width: '60px', height: '60px', background: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 15px', color: 'var(--adm-accent)', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                                    <Search size={28} />
                                </div>
                                <h3 style={{ fontSize: '1rem', color: 'var(--adm-navy)', margin: 0 }}>Suivi Admission</h3>
                            </div>
                            <form style={{ padding: '25px' }} onSubmit={(e) => e.preventDefault()}>
                                <div style={{ marginBottom: '15px' }}>
                                    <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, color: 'var(--adm-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>Numéro de CIN</label>
                                    <input 
                                        type="text" 
                                        placeholder="Ex: AB123456" 
                                        style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1.5px solid var(--adm-border)', outline: 'none', transition: 'border-color 0.2s' }}
                                    />
                                </div>
                                <button className="md-btn-submit" style={{ width: '100%', padding: '12px' }}>
                                    Vérifier l'état
                                </button>
                                <p style={{ fontSize: '0.75rem', textAlign: 'center', marginTop: '15px', color: 'var(--adm-muted)' }}>
                                    Entrez votre CIN pour suivre l'état de votre dossier de pré-inscription.
                                </p>
                            </form>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}

export default ConditionAcces;