import React from 'react';
import { Link } from 'react-router-dom';
import '../../assets/css/PresentationHistorique.css';

const PresentationHistorique = () => {
    return (
        <div className="ph-page-wrapper">
            {/* Hero Section */}
            <header className="h-hero-section">
                <div className="h-hero-container">
                    <div className="h-hero-tag">Découvrir l'Institut</div>
                    <h1 className="h-hero-title">Présentation & Histoire</h1>
                    <p className="h-hero-subtitle">
                        L'excellence au service du digital depuis 2007. Découvrez notre parcours et nos engagements.
                    </p>
                </div>
            </header>

            <div className="ph-container">
                {/* Breadcrumb */}
                <nav className="h-breadcrumb-section">
                    <div className="h-breadcrumb-container">
                        <Link to="/">Accueil</Link>
                        <span className="h-breadcrumb-sep">›</span>
                        <span>Découvrir l'NTIC</span>
                        <span className="h-breadcrumb-sep">›</span>
                        <span>Présentation & Histoire</span>
                    </div>
                </nav>

                <div className="ph-content-grid">
                    {/* Left Sidebar */}
                    <aside className="h-sidebar-sticky">
                        <div className="h-sidebar-card">
                            <h3 className="h-sidebar-title">DÉCOUVRIR ISTA NTIC</h3>
                            <ul className="h-sidebar-list">
                                <li className="h-sidebar-item">
                                    <Link to="/mot-du-directeur">Mot du Directeur</Link>
                                </li>
                                <li className="h-sidebar-item active">
                                    <Link to="/presentation-historique">
                                        Présentation & Histoire
                                        <span className="h-sidebar-active-arrow">›</span>
                                    </Link>
                                </li>
                                <li className="h-sidebar-item">
                                    <Link to="/reglement-interieur">Règlement Intérieur</Link>
                                </li>
                                <li className="h-sidebar-item">
                                    <Link to="/nos-partenaires">Nos Partenaires</Link>
                                </li>
                            </ul>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="ph-main-content">
                        <section className="ph-section">
                            <h2 className="ph-sec-title">Notre Histoire</h2>
                            <p className="ph-intro-text">
                                L’Institut Spécialisé de Technologie Appliquée NTIC Sidi Youssef Ben Ali est un établissement public de formation professionnelle situé à Marrakech, dans le quartier Sidi Youssef Ben Ali.
                                Il fait partie de l'<strong>OFPPT</strong> (Office de la Formation Professionnelle et de la Promotion du Travail), l’organisme principal de formation au Maroc.
                            </p>
                            <p>
                                Fondé en 2007 sous l'égide de l'OFPPT, l'institut s'est imposé comme une référence dans l'enseignement technique supérieur à Marrakech.
                                Établi pour répondre à la demande croissante de techniciens spécialisés en informatique et réseaux, le centre a su évoluer pour intégrer les nouvelles technologies et les méthodes pédagogiques modernes.
                            </p>
                        </section>

                        <div className="ph-dual-cards">
                            {/* Mission Card */}
                            <div className="ph-card ph-mission-card">
                                <h3 className="ph-mission-title">Nos Missions</h3>
                                <ul className="ph-mission-list">
                                    <li>
                                        <span className="ph-check">✓</span>
                                        Formation technique de pointe
                                    </li>
                                    <li>
                                        <span className="ph-check">✓</span>
                                        Insertion professionnelle
                                    </li>
                                    <li>
                                        <span className="ph-check">✓</span>
                                        Développement des soft-skills
                                    </li>
                                    <li>
                                        <span className="ph-check">✓</span>
                                        Partenariats entreprises
                                    </li>
                                </ul>
                            </div>

                            {/* Stats Card */}
                            <div className="ph-card ph-stats-card">
                                <h3 className="ph-stats-title">Chiffres Clés</h3>
                                <div className="ph-stats-grid">
                                    <div className="ph-stat-item">
                                        <span className="ph-stat-num">+4</span>
                                        <span className="ph-stat-label">Filières</span>
                                    </div>
                                    <div className="ph-stat-item">
                                        <span className="ph-stat-num">2000+</span>
                                        <span className="ph-stat-label">Lauréats</span>
                                    </div>
                                    <div className="ph-stat-item">
                                        <span className="ph-stat-num">40+</span>
                                        <span className="ph-stat-label">Partenaires</span>
                                    </div>
                                    <div className="ph-stat-item">
                                        <span className="ph-stat-num">95%</span>
                                        <span className="ph-stat-label">Insertion</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <section className="ph-section">
                            <h2 className="ph-sec-title">Infrastructures</h2>
                            <p>
                                Le campus dispose d'infrastructures modernes adaptées aux exigences de chaque filière :
                            </p>
                            <ul className="ph-bullet-list">
                                <li>Laboratoires informatiques équipés de la fibre optique.</li>
                                <li>Ateliers de développement et réseaux aux normes OFPPT.</li>
                                <li>Bibliothèque numérique et espaces de travail collaboratif.</li>
                                <li>Salles multimédias pour les conférences et séminaires.</li>
                            </ul>
                        </section>

                        <section className="ph-section">
                            <h2 className="ph-sec-title">Localisation</h2>
                            <p>
                                Situé au cœur de Douar Jdid, Sidi Youssef Ben Ali à Marrakech, l'institut bénéficie d'un emplacement stratégique dans un quartier en plein essor.
                            </p>
                        </section>
                    </main>

                    {/* Right Sidebar */}
                    <aside className="ph-sidebar-right">
                        <div className="ph-card ph-contact-card">
                            <h3 className="ph-card-title ph-navy-title">Contactez-nous</h3>
                            <form className="ph-contact-form" onSubmit={(e) => e.preventDefault()}>
                                <div className="ph-form-row">
                                    <div className="ph-input-group">
                                        <label>Nom</label>
                                        <input type="text" placeholder="Nom" />
                                    </div>
                                    <div className="ph-input-group">
                                        <label>Prénom</label>
                                        <input type="text" placeholder="Prénom" />
                                    </div>
                                </div>
                                <div className="ph-input-group">
                                    <label>Email</label>
                                    <input type="email" placeholder="Email" />
                                </div>
                                <div className="ph-input-group">
                                    <label>Sujet</label>
                                    <select>
                                        <option>Demande d'information</option>
                                        <option>Inscription</option>
                                        <option>Stages</option>
                                    </select>
                                </div>
                                <button type="submit" className="ph-btn-submit">Envoyer</button>
                            </form>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
};

export default PresentationHistorique;