import React from 'react';
import { Link } from 'react-router-dom';
import '../../assets/css/NosPartenaires.css';

// Logo Imports
import logoAirArabia from '../../assets/images/partners/Ai_ Arabia.png';
import logoRAM from '../../assets/images/partners/Royal_Air_Maroc(RAM).png';
import logoSafran from '../../assets/images/partners/Safran.png';
import logoStelia from '../../assets/images/partners/STELIA.png';
import logoBombardier from '../../assets/images/partners/Bombardier.png';
import logoATI from '../../assets/images/partners/ATTIJARI.png';

const ICONS = {
    target: <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>,
    lightbulb: <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18h6"></path><path d="M10 22h4"></path><path d="M12 2a7 7 0 0 0-7 7c0 2.38 1.19 4.47 3 5.74V17a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-2.26c1.81-1.27 3-3.36 3-5.74a7 7 0 0 0-7-7z"></path></svg>,
    rocket: <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"></path><path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"></path><path d="M9 12H4s.55-3.03 2-5c1.62-2.2 5-3 5-3"></path><path d="M12 15v5s3.03-.55 5-2c2.2-1.62 3-5 3-5"></path></svg>
};

const NosPartenaires = () => {
    const partners = [
        {
            id: 1,
            name: "Air Arabia",
            logo: logoAirArabia,
            category: "Transport Aérien",
            description: "Partenaire stratégique pour la maintenance et les services au sol."
        },
        {
            id: 2,
            name: "Royal Air Maroc (RAM)",
            logo: logoRAM,
            category: "Compagnie Nationale",
            description: "Collaboration historique pour l'insertion des techniciens en maintenance."
        },
        {
            id: 3,
            name: "Safran",
            logo: logoSafran,
            category: "Aéronautique",
            description: "Leader mondial des équipements aéronautiques et de défense."
        },
        {
            id: 4,
            name: "Stelia",
            logo: logoStelia,
            category: "Aérostructures",
            description: "Spécialiste des fuselages et des sièges pilotes/passagers."
        },
        {
            id: 5,
            name: "Bombardier",
            logo: logoBombardier,
            category: "Transport & Aviation",
            description: "Soutien majeur pour les formations en génie mécanique et systèmes."
        },
        {
            id: 6,
            name: "ATI (Attijari)",
            logo: logoATI,
            category: "Services & Formation",
            description: "Partenariat technique pour le développement des compétences IT."
        }
    ];

    return (
        <div className="np-page-wrapper">
            {/* Hero Section */}
            <header className="h-hero-section">
                <div className="h-hero-container">
                    <div className="h-hero-tag">Réseau & Innovation</div>
                    <h1 className="h-hero-title">Nos Partenaires</h1>
                    <p className="h-hero-subtitle">
                        Une collaboration étroite avec les leaders de l'industrie pour une insertion professionnelle garantie.
                    </p>
                </div>
            </header>

            <div className="np-container">
                {/* Breadcrumb */}
                <nav className="h-breadcrumb-section">
                    <div className="h-breadcrumb-container">
                        <Link to="/">Accueil</Link>
                        <span className="h-breadcrumb-sep">›</span>
                        <span>Découvrir l'NTIC</span>
                        <span className="h-breadcrumb-sep">›</span>
                        <span>Nos Partenaires</span>
                    </div>
                </nav>

                <div className="np-content-grid">
                    {/* Left Sidebar */}
                    <aside className="h-sidebar-sticky">
                        <div className="h-sidebar-card">
                            <h3 className="h-sidebar-title">DÉCOUVRIR ISTA NTIC</h3>
                            <ul className="h-sidebar-list">
                                <li className="h-sidebar-item">
                                    <Link to="/mot-du-directeur">Mot du Directeur</Link>
                                </li>
                                <li className="h-sidebar-item">
                                    <Link to="/presentation-historique">Présentation & Histoire</Link>
                                </li>
                                <li className="h-sidebar-item">
                                    <Link to="/reglement-interieur">Règlement Intérieur</Link>
                                </li>
                                <li className="h-sidebar-item active">
                                    <Link to="/nos-partenaires">
                                        Nos Partenaires
                                        <span className="h-sidebar-active-arrow">›</span>
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="np-main-content">
                        <section className="np-intro-section">
                            <h2 className="np-sec-title">Partenariats Stratégiques</h2>
                            <p className="np-intro-p">
                                L'Institut Spécialisé de Technologie Appliquée NTIC Sidi Youssef Ben Ali place la relation avec l'entreprise au cœur de son projet pédagogique.
                                Ces partenariats permettent d'ajuster nos programmes aux besoins réels du marché et d'offrir à nos stagiaires des opportunités de stages et d'emplois de premier plan.
                            </p>
                        </section>

                        <div className="np-logo-grid">
                            {partners.map(partner => (
                                <div key={partner.id} className="np-partner-card">
                                    <div className="np-logo-box">
                                        <img src={partner.logo} alt={partner.name} className="np-partner-logo" />
                                    </div>
                                    <div className="np-partner-info">
                                        <span className="np-partner-cat">{partner.category}</span>
                                        <h3 className="np-partner-name">{partner.name}</h3>
                                        <p className="np-partner-desc">{partner.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <section className="np-values-section">
                            <div className="np-value-banner">
                                <div className="np-value-item">
                                    <span className="np-value-icon">{ICONS.target}</span>
                                    <h4>Insertion</h4>
                                    <p>95% de nos lauréats trouvent un emploi dans les 6 mois.</p>
                                </div>
                                <div className="np-value-item">
                                    <span className="np-value-icon">{ICONS.lightbulb}</span>
                                    <h4>Expertise</h4>
                                    <p>Des intervenants issus du monde professionnel.</p>
                                </div>
                                <div className="np-value-item">
                                    <span className="np-value-icon">{ICONS.rocket}</span>
                                    <h4>Innovation</h4>
                                    <p>Veille technologique constante avec nos partenaires.</p>
                                </div>
                            </div>
                        </section>
                    </main>


                    {/* Right Sidebar */}
                    <aside className="np-sidebar-right">
                        <div className="np-card np-cta-card">
                            <h3 className="np-card-title">Devenir Partenaire</h3>
                            <p className="np-cta-text">
                                Vous souhaitez collaborer avec l'institut et recruter nos futurs talents ?
                            </p>
                            <Link to="/contact" className="np-btn-contact">Contactez-nous</Link>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
};

export default NosPartenaires;