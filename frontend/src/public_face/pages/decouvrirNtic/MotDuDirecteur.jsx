import React from 'react';
import { Link } from 'react-router-dom';
import '../../assets/css/MotDuDirecteur.css';

// Using a placeholder for now, will replace with generated image path if available
import directorImg from '../../assets/images/director_portrait.png'; 

function MotDuDirecteur() {
    return (
        <div className="md-page-wrapper">
            {/* Hero Section */}
            <header className="h-hero-section">
                <div className="h-hero-container">
                    <div className="h-hero-tag">Institution</div>
                    <h1 className="h-hero-title">Mot de la Directrice</h1>
                    <p className="h-hero-subtitle">
                        Un message d'engagement vers l'excellence et l'innovation pour l'avenir de nos étudiants.
                    </p>
                </div>
            </header>

            <div className="md-container">
                {/* Standardized Breadcrumb */}
                <nav className="h-breadcrumb-section">
                    <div className="h-breadcrumb-container">
                        <Link to="/">Accueil</Link>
                        <span className="h-breadcrumb-sep">›</span>
                        <span>Découvrir l'NTIC</span>
                        <span className="h-breadcrumb-sep">›</span>
                        <span>Mot de la Directrice</span>
                    </div>
                </nav>

                <div className="md-content-grid">
                    {/* Left Sidebar - Menu */}
                    <aside className="h-sidebar-sticky">
                        <div className="h-sidebar-card">
                            <h3 className="h-sidebar-title">DÉCOUVRIR ISTA NTIC</h3>
                            <ul className="h-sidebar-list">
                                <li className="h-sidebar-item active">
                                    <Link to="/mot-du-directeur">
                                        Mot de la Directrice
                                        <span className="h-sidebar-active-arrow">›</span>
                                    </Link>
                                </li>
                                <li className="h-sidebar-item">
                                    <Link to="/presentation-historique">Présentation &amp; Historique</Link>
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
                    <main className="md-main-content">
                        <div className="md-director-top">
                            <div className="md-director-photo-side">
                                <img 
                                    src={directorImg} 
                                    alt="Directrice de l'ISTA NTIC SYBA" 
                                    className="md-director-image" 
                                    onError={(e) => {
                                        e.target.src = "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=800";
                                    }}
                                />
                                <div className="md-director-info">
                                    <h4 className="md-director-name">Amina BENJLOIJA</h4>
                                    <p className="md-director-title">DIRECTRICE DE L'ÉTABLISSEMENT</p>
                                </div>
                            </div>
                            
                            <div className="md-director-quote">
                                <p className="md-quote-intro">
                                    "Chers étudiants, chers partenaires, bienvenue au Centre d'Excellence."
                                </p>
                                <p>
                                    C’est avec une immense fierté que nous vous accueillons dans notre établissement, 
                                    véritable pôle d'excellence dédié à la formation technique supérieure.
                                </p>
                                <p>
                                    Depuis sa création, notre centre s'est donné pour mission de former les cadres 
                                    techniques de demain, capables de relever les défis d'un monde professionnel en perpétuelle mutation.
                                </p>
                            </div>
                        </div>

                        <div className="md-highlight-box">
                            <p>Notre ambition est de faire de chaque étudiant un professionnel compétent, responsable et innovant.</p>
                        </div>

                        <div className="md-message-text">
                            <p>
                                À l'ISTA NTIC SYBA, notre mission dépasse la simple transmission de connaissances ; 
                                nous nous engageons à former les leaders technologiques de demain.
                            </p>
                            <p>
                                Notre pédagogie repose sur deux piliers fondamentaux : 
                                <strong> la rigueur académique</strong> et <strong>l'ouverture sur le monde de l'entreprise</strong>.
                            </p>
                            <p>
                                Nous mettons à la disposition de nos apprenants des infrastructures de pointe 
                                et un corps professoral d'exception, alliant expertise académique et expérience terrain.
                            </p>
                        </div>
                    </main>

                    {/* Right Sidebar - Contact Form */}
                    <aside className="md-sidebar-right">
                        <div className="md-card">
                            <h3 className="md-card-title">Contactez-nous</h3>
                            <form className="md-contact-form" onSubmit={(e) => e.preventDefault()}>
                                <div className="md-form-row">
                                    <div className="md-input-group">
                                        <label>Nom</label>
                                        <input type="text" placeholder="Nom" />
                                    </div>
                                    <div className="md-input-group">
                                        <label>Prénom</label>
                                        <input type="text" placeholder="Prénom" />
                                    </div>
                                </div>
                                <div className="md-input-group">
                                    <label>Email</label>
                                    <input type="email" placeholder="Email" />
                                </div>
                                <div className="md-input-group">
                                    <label>Téléphone</label>
                                    <input type="text" placeholder="Téléphone (+212...)" />
                                </div>
                                <div className="md-input-group">
                                    <label>Sujet</label>
                                    <select>
                                        <option>Information Générale</option>
                                        <option>Admission</option>
                                        <option>Partenariat</option>
                                    </select>
                                </div>
                                <div className="md-input-group">
                                    <label>Ville</label>
                                    <input type="text" placeholder="Votre ville" />
                                </div>
                                <button type="submit" className="md-btn-submit">Envoyer le message</button>
                            </form>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}

export default MotDuDirecteur;