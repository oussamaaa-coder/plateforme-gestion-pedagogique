import React from 'react';
import { Link } from 'react-router-dom';
import logo_ofppt from '../../assets/images/logo-ofppt.png';
import './Footer.css';
import { motion } from 'framer-motion';

const Footer = () => {
    return (
        <footer className="modern-footer">
            <div className="footer-top">
                <div className="footer-container">
                    <div className="footer-grid">
                        
                        {/* Column 1: Brand & About */}
                        <motion.div 
                            className="footer-col brand-col"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                        >
                            <Link to="/" className="footer-brand">
                                <img src={logo_ofppt} alt="Logo OFPPT" className="footer-logo" />
                                <div className="footer-title">
                                    <span>ISTA</span>
                                    <strong>NTIC SYBA</strong>
                                </div>
                            </Link>
                            <p className="footer-description">
                                L'Institut Spécialisé de Technologie Appliquée NTIC SYBA forme les futurs talents du numérique, du développement digital à l'infrastructure réseau.
                            </p>
                            <div className="footer-socials">
                                <a href="#" aria-label="Facebook">
                                    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
                                </a>
                                <a href="#" aria-label="Instagram">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" /></svg>
                                </a>
                                <a href="#" aria-label="LinkedIn">
                                    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z" /><circle cx="4" cy="4" r="2" /></svg>
                                </a>
                            </div>
                        </motion.div>

                        {/* Column 2: Formations */}
                        <motion.div 
                            className="footer-col"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            viewport={{ once: true }}
                        >
                            <h4 className="footer-heading">Nos Formations</h4>
                            <ul className="footer-links">
                                <li><Link to="/filiere/1">Développement Digital</Link></li>
                                <li><Link to="/filiere/4">Infrastructure Digitale</Link></li>
                                <li><Link to="/filiere/2">Applications Mobiles</Link></li>
                                <li><Link to="/filiere/6">Cyber Sécurité</Link></li>
                                <li><Link to="/filiere/8">Développement Python</Link></li>
                            </ul>
                        </motion.div>

                        {/* Column 3: Liens Utiles */}
                        <motion.div 
                            className="footer-col"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            viewport={{ once: true }}
                        >
                            <h4 className="footer-heading">Liens Utiles</h4>
                            <ul className="footer-links">
                                <li><Link to="/condition-acces">Admission</Link></li>
                                <li><Link to="/bourse">Bourses</Link></li>
                                <li><Link to="/reglement-interieur">Règlement Intérieur</Link></li>
                                <li><Link to="/bdeclubs">Vie Etudiantine</Link></li>
                                <li><Link to="/contact">Nous Contacter</Link></li>
                            </ul>
                        </motion.div>

                        {/* Column 4: Contact */}
                        <motion.div 
                            className="footer-col"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            viewport={{ once: true }}
                        >
                            <h4 className="footer-heading">Contact</h4>
                            <ul className="footer-contact">
                                <li>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                                    <span>Av. Al Adarissa, Marrakech</span>
                                </li>
                                <li>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                                    <span>05 24 40 41 69</span>
                                </li>
                                <li>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
                                    <span>contact@nticsyba.ma</span>
                                </li>
                            </ul>
                        </motion.div>

                    </div>
                </div>
            </div>
            
            <div className="footer-bottom">
                <div className="footer-container">
                    <div className="footer-bottom-content">
                        <p>&copy; {new Date().getFullYear()} ISTA NTIC SYBA. Tous droits réservés.</p>
                        <div className="footer-bottom-links">
                            <Link to="/mentions-legales">Mentions Légales</Link>
                            <Link to="/politique-confidentialite">Politique de Confidentialité</Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
