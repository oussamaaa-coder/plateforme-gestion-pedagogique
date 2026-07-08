import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import logo_ofppt from '../assets/images/logo-ofppt.png';
import '../assets/css/navbar.css';

function Navbar() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState(null);

    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu & remove focus to close desktop dropdowns
    const closeMenu = (e) => {
        if (e) e.stopPropagation();
        setMobileOpen(false);
        setActiveDropdown(null);
        if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
        }
    };

    const toggleDropdown = (name) => {
        setActiveDropdown(activeDropdown === name ? null : name);
    };

    const handleNavClick = (e) => {
        if (e.target.closest('a')) {
            closeMenu(e);
        }
    };

    useEffect(() => {
        closeMenu();
    }, [location]);

    return (
        <header className={`site-header ${scrolled ? 'scrolled' : ''}`}>
            <div className="header-top">
                <div className="nav-container">
                    <Link to="/" className="header-brand" onClick={(e) => closeMenu(e)}>
                        <div className="header-logo-wrap">
                            <img src={logo_ofppt} alt="Logo OFPPT" className="header-logo" />
                        </div>
                        <span className="header-title">
                            Institut Spécialisé de Technologie Appliquée<br />
                            <strong>NTIC SYBA</strong>
                        </span>
                    </Link>

                    <div className="header-right">
                        <div className="social-links">
                            <a href="#!" aria-label="Facebook" className="social-icon">
                                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
                            </a>
                            <a href="#!" aria-label="Instagram" className="social-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" /></svg>
                            </a>
                            <a href="#!" aria-label="YouTube" className="social-icon">
                                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.96-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" /><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white" /></svg>
                            </a>
                        </div>
                        <Link to="/choix-compte" className="btn-account" onClick={(e) => closeMenu(e)} style={{ color: "white" }}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                            Mon Compte
                        </Link>
                    </div>
                </div>
            </div>

            <nav className="main-nav">
                <div className="nav-container">
                    <button className="mobile-toggle" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu">
                        <span /><span /><span />
                    </button>

                    <div className={`nav-links ${mobileOpen ? 'open' : ''}`} onClick={handleNavClick}>
                        <Link to="/" className="nav-item nav-home">Accueil</Link>

                        <div className={`nav-item has-dropdown ${activeDropdown === 'decouvrir' ? 'active' : ''}`}
                            onClick={() => toggleDropdown('decouvrir')}>
                            <span>Découvrir ISTA NTIC SYBA</span>
                            <div className={`dropdown ${activeDropdown === 'decouvrir' ? 'show' : ''}`}>
                                <div className="dropdown-inner">
                                    <Link to="/mot-du-directeur">Mot du Directeur</Link>
                                    <Link to="/presentation-historique">Présentation &amp; Historique</Link>
                                    <Link to="/reglement-interieur">Règlement Intérieur</Link>
                                    <Link to="/nos-partenaires">Nos Partenaires</Link>
                                </div>
                            </div>
                        </div>

                        <div className={`nav-item has-dropdown ${activeDropdown === 'formations' ? 'active' : ''}`}
                            onClick={() => toggleDropdown('formations')}>
                            <span>Formations</span>
                            <div className={`dropdown dropdown-wide ${activeDropdown === 'formations' ? 'show' : ''}`}>
                                <div className="dropdown-inner">
                                    <Link to="/filiere/1">Développement Digital</Link>
                                    <Link to="/filiere/3">Web Full Stack</Link>
                                    <Link to="/filiere/2">Applications Mobiles</Link>
                                    <Link to="/filiere/4">Infrastructure Digitale</Link>
                                    <Link to="/filiere/5">Cloud Computing</Link>
                                    <Link to="/filiere/6">Cyber Sécurité</Link>
                                    <Link to="/filiere/7">Systèmes et Réseaux</Link>
                                    <Link to="/filiere/8">Développement Python</Link>
                                    <Link to="/filiere/9">Fibre Optique</Link>
                                    <Link to="/filiere/10">Web Marketer</Link>
                                    <div className="nested-dropdown">
                                        <div className="nested-dropdown-toggle">
                                            Certifications
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                                                <polyline points="9 18 15 12 9 6"></polyline>
                                            </svg>
                                        </div>
                                        <div className="nested-dropdown-menu">
                                            <Link to="/filiere/11">Excel Spécialiste</Link>
                                            <Link to="/filiere/12">PowerPoint Spécialiste</Link>
                                            <Link to="/filiere/13">Word Spécialiste</Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={`nav-item has-dropdown ${activeDropdown === 'admission' ? 'active' : ''}`}
                            onClick={() => toggleDropdown('admission')}>
                            <span>Admission</span>
                            <div className={`dropdown ${activeDropdown === 'admission' ? 'show' : ''}`}>
                                <div className="dropdown-inner">
                                    <Link to="/condition-acces">Conditions d'Accès</Link>
                                    <Link to="/resultats-admission">Résultats d'Admission</Link>
                                    <Link to="/procedure-inscription">Procédure d'Inscription</Link>
                                    <Link to="/bourse">Bourses</Link>
                                </div>
                            </div>
                        </div>

                        <div className={`nav-item has-dropdown ${activeDropdown === 'vie' ? 'active' : ''}`}
                            onClick={() => toggleDropdown('vie')}>
                            <span>Vie au Campus</span>
                            <div className={`dropdown ${activeDropdown === 'vie' ? 'show' : ''}`}>
                                <div className="dropdown-inner">
                                    <Link to="/bdeclubs">BDE &amp; Clubs</Link>
                                    <Link to="/internat-restauration">Internat &amp; Restauration</Link>
                                    <Link to="/galerie">Galerie Photos</Link>
                                </div>
                            </div>
                        </div>

                        <Link to="/news" className="nav-item">Actualités</Link>

                        <div className={`nav-item has-dropdown ${activeDropdown === 'contact' ? 'active' : ''}`}
                            onClick={() => toggleDropdown('contact')}>
                            <span>Contact</span>
                            <div className={`dropdown ${activeDropdown === 'contact' ? 'show' : ''}`}>
                                <div className="dropdown-inner">
                                    <Link to="/contact">Nous Contacter</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    );
}

export default Navbar;
