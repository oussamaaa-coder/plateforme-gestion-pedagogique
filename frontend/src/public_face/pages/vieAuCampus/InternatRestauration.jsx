import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Building2, Soup, Wifi, Shield, MapPin, Sparkles, Zap, Coffee, Clock, Heart } from 'lucide-react';
import SidebarLeft from '../../components/vieAuCampus/SidebarLeft';
import ContactSidebar from '../../components/vieAuCampus/ContactSidebar';
import '../../assets/css/VieAuCampus.css';
import '../../assets/css/FilliereDetail.css';

const INTERNAT_FEATURES = [
    { icon: <Wifi size={18} />, name: 'Wi-Fi Haut Débit', desc: 'Accès illimité pour tous.' },
    { icon: <Shield size={18} />, name: 'Sécurité 24/7', desc: 'Protection et surveillance.' },
    { icon: <MapPin size={18} />, name: 'Emplacement Central', desc: 'Proche des salles de cours.' },
    { icon: <Sparkles size={18} />, name: 'Modernité', desc: 'Confort et propreté garantis.' }
];

const RESTO_FEATURES = [
    { icon: <Zap size={18} />, name: 'Équilibre', desc: 'Menus sains et nutritionnels.' },
    { icon: <Coffee size={18} />, name: 'Pause Café', desc: 'Espace détente convivial.' },
    { icon: <Clock size={18} />, name: 'Rapidité', desc: 'Service fluide pour midi.' },
    { icon: <Heart size={18} />, name: 'Fraîcheur', desc: 'Ingrédients de saison.' }
];

export default function InternatRestauration() {
    useEffect(() => { window.scrollTo(0, 0); }, []);

    return (
        <div className="fd-page-wrapper">
            <header className="h-hero-section">
                <div className="h-hero-container">
                    <div className="h-hero-tag">SERVICES CAMPUS</div>
                    <h1 className="h-hero-title">Internat & Restauration</h1>
                    <p className="h-hero-subtitle">
                        Un cadre de vie d'exception pour un apprentissage serein. Profitez de services 
                        pensés pour votre bien-être et votre réussite.
                    </p>
                </div>
            </header>

            <nav className="h-breadcrumb-section">
                <div className="h-breadcrumb-container">
                    <Link to="/">Accueil</Link> <span className="h-breadcrumb-sep">›</span> <span>Vie au Campus</span> <span className="h-breadcrumb-sep">›</span> <span>Internat & Restauration</span>
                </div>
            </nav>

            <div className="fd-content-grid fd-container">
                <SidebarLeft />

                <main className="fd-main-article">
                    <div className="vc-page-content">
                        
                        {/* Internat Block */}
                        <div className="vc-service-block">
                            <motion.div 
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="vc-service-hero"
                            >
                                <div className="vc-service-visual">
                                    <Building2 size={120} strokeWidth={1} className="vc-service-icon-large" />
                                </div>
                                <div className="vc-service-main">
                                    <span className="vc-service-tag">Hébergement</span>
                                    <h2 className="vc-service-title">Votre second chez-vous</h2>
                                    <p className="vc-service-description">
                                        L'internat de l'ISTA NTIC SYBA offre un environnement calme et sécurisé. 
                                        Nos infrastructures sont conçues pour offrir tout le confort nécessaire aux stagiaires.
                                    </p>
                                    <div className="vc-service-features">
                                        {INTERNAT_FEATURES.map((feat, i) => (
                                            <div key={i} className="vc-s-feature">
                                                <div className="vc-s-feature-icon">{feat.icon}</div>
                                                <div className="vc-s-feature-text">
                                                    <h4>{feat.name}</h4>
                                                    <p>{feat.desc}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* Restauration Block */}
                        <div className="vc-service-block">
                            <motion.div 
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.2 }}
                                className="vc-service-hero"
                            >
                                <div className="vc-service-visual" style={{ order: 1 }}>
                                    <Soup size={120} strokeWidth={1} className="vc-service-icon-large" />
                                </div>
                                <div className="vc-service-main">
                                    <span className="vc-service-tag">Restauration</span>
                                    <h2 className="vc-service-title">Cuisine équilibrée</h2>
                                    <p className="vc-service-description">
                                        Notre restaurant propose quotidiennement des repas variés, préparés avec soin. 
                                        Un espace convivial pour se retrouver et partager.
                                    </p>
                                    <div className="vc-service-features">
                                        {RESTO_FEATURES.map((feat, i) => (
                                            <div key={i} className="vc-s-feature">
                                                <div className="vc-s-feature-icon">{feat.icon}</div>
                                                <div className="vc-s-feature-text">
                                                    <h4>{feat.name}</h4>
                                                    <p>{feat.desc}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                    </div>
                </main>

                <ContactSidebar />
            </div>
        </div>
    );
}