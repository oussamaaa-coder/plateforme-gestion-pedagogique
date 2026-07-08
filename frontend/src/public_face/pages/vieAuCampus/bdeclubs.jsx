import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Cpu, Trophy, Leaf, CheckCircle2, Users } from 'lucide-react';
import SidebarLeft from '../../components/vieAuCampus/SidebarLeft';
import ContactSidebar from '../../components/vieAuCampus/ContactSidebar';
import '../../assets/css/VieAuCampus.css';
import '../../assets/css/FilliereDetail.css';

// Import local images from assets
import itClubImg from '../../assets/images/clubs/itClub.png';
import citoyenImg from '../../assets/images/clubs/citoyen.png';
import sportImg from '../../assets/images/clubs/sport.png';

const CLUBS = [
    {
        id: 'it-club',
        name: 'IT Club',
        icon: <Cpu size={22} />,
        color: '#4f46e5',
        image: itClubImg,
        tagline: 'Innovons ensemble',
        description: "Plongez dans l'innovation technologique. Nous explorons les frontières du code, de l'IA et de la cybersécurité dans une ambiance collaborative.",
        rules: [
            "Respect et bienveillance mutuels.",
            "Partage de contenu constructif.",
            "Curiosité et entraide.",
            "Pas de spam ni hors sujet."
        ],
        footer: "Ready to build the future?"
    },
    {
        id: 'eco-club',
        name: 'Club Citoyenneté',
        icon: <Leaf size={22} />,
        color: '#10b981',
        image: citoyenImg,
        tagline: 'Engagement & Nature',
        description: "Incarnez le changement sur notre campus. Nous menons des actions pour la durabilité et renforçons les liens de citoyenneté.",
        rules: [
            "Participation active aux projets.",
            "Éco-responsabilité exemplaire.",
            "Tolérance et collaboration.",
            "Inclusion de tous les membres."
        ],
        footer: "Agissons pour demain !"
    },
    {
        id: 'sportiso',
        name: 'SPORTISO',
        icon: <Trophy size={22} />,
        color: '#00a896',
        image: sportImg,
        tagline: 'L’esprit de champion',
        description: "Dépassez vos limites physiques et mentales. Le sport est notre vecteur de discipline, de santé et de cohésion d'équipe.",
        rules: [
            "Discipline et ponctualité.",
            "Focus sur le dépassement.",
            "Soutien moral et physique.",
            "Fair-play en toute circonstance."
        ],
        footer: "Plus fort, ensemble !"
    }
];

export default function BDEClubs() {
    useEffect(() => { window.scrollTo(0, 0); }, []);

    return (
        <div className="fd-page-wrapper">
            <header className="h-hero-section">
                <div className="h-hero-container">
                    <div className="h-hero-tag">VIE ÉTUDIANTE</div>
                    <h1 className="h-hero-title">BDE & Clubs</h1>
                    <p className="h-hero-subtitle">
                        Le cœur battant de la vie au campus. Découvrez nos clubs passionnés et rejoignez 
                        une communauté dynamique.
                    </p>
                </div>
            </header>

            <nav className="h-breadcrumb-section">
                <div className="h-breadcrumb-container">
                    <Link to="/">Accueil</Link> <span className="h-breadcrumb-sep">›</span> <span>Vie au Campus</span> <span className="h-breadcrumb-sep">›</span> <span>BDE & Clubs</span>
                </div>
            </nav>

            <div className="fd-content-grid fd-container">
                <SidebarLeft />

                <main className="fd-main-article">
                    <div className="vc-page-content">
                        <div className="vc-clubs-grid">
                            {CLUBS.map((club, index) => (
                                <motion.div 
                                    key={club.id}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1, duration: 0.6 }}
                                    className="vc-club-card"
                                >
                                    <div className="vc-club-media">
                                        <img src={club.image} alt={club.name} className="vc-club-image" />
                                        <div className="vc-club-overlay">
                                            <div className="vc-club-icon-bg">
                                                {club.icon}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="vc-club-content">
                                        <div className="vc-club-header">
                                            <h3 className="vc-club-name">{club.name}</h3>
                                            <p className="vc-club-tagline">{club.tagline}</p>
                                        </div>
                                        
                                        <p className="vc-club-description">{club.description}</p>
                                        
                                        <div className="vc-club-rules-label">
                                            <Users size={14} />
                                            <span>Charte du club</span>
                                        </div>
                                        
                                        <ul className="vc-rules-list">
                                            {club.rules.map((rule, idx) => (
                                                <li key={idx} className="vc-rule-item">
                                                    <CheckCircle2 size={16} className="vc-rule-check" />
                                                    <span>{rule}</span>
                                                </li>
                                            ))}
                                        </ul>
                                        
                                        <div className="vc-club-footer">
                                            <p>{club.footer}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </main>

                <ContactSidebar />
            </div>
        </div>
    );
}