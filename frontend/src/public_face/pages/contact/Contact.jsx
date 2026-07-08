import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, Send, Globe, MessageSquare } from 'lucide-react';
import '../../assets/css/Contact.css';
import '../../assets/css/FilliereDetail.css';

const CONTACT_INFO = [
    {
        icon: <MapPin size={28} />,
        title: "Notre Adresse",
        content: "Av. Al Adarissa, Marrakech, Maroc",
        link: "#"
    },
    {
        icon: <Phone size={28} />,
        title: "Téléphone",
        content: "05 24 40 41 69",
        link: "tel:0524404169"
    },
    {
        icon: <Mail size={28} />,
        title: "E-mail",
        content: "contact@istanticsyba.ma",
        link: "mailto:contact@istanticsyba.ma"
    },
    {
        icon: <Clock size={28} />,
        title: "Horaires",
        content: "Lundi - Samedi: 08h30 - 18h30 | Dimanche: Fermé",
        link: "#"
    }
];

export default function Contact() {
    useEffect(() => { window.scrollTo(0, 0); }, []);

    return (
        <div className="fd-page-wrapper contact-container">
            {/* ── Hero ─────────────────────────────────────────── */}
            <header className="h-hero-section">
                <div className="h-hero-container">
                    <div className="h-hero-tag">NOUS REJOINDRE</div>
                    <h1 className="h-hero-title">Contactez-nous</h1>
                    <p className="h-hero-subtitle">
                        Une question ? Un projet ? Notre équipe est à votre écoute pour vous 
                        accompagner dans vos démarches.
                    </p>
                </div>
            </header>

            {/* ── Breadcrumb ───────────────────────────────────── */}
            <nav className="h-breadcrumb-section">
                <div className="h-breadcrumb-container">
                    <Link to="/">Accueil</Link> <span className="h-breadcrumb-sep">›</span> <span>Contact</span>
                </div>
            </nav>

            <div className="fd-container">
                {/* ── Info Cards ── */}
                <div className="contact-info-grid">
                    {CONTACT_INFO.map((info, idx) => (
                        <motion.a 
                            href={info.link}
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="contact-info-card"
                        >
                            <div className="contact-icon-wrapper">
                                {info.icon}
                            </div>
                            <h3>{info.title}</h3>
                            <p>{info.content}</p>
                        </motion.a>
                    ))}
                </div>

                {/* ── Main Section ── */}
                <div className="contact-main-grid">
                    {/* Form */}
                    <motion.div 
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="contact-form-wrapper"
                    >
                        <h2 className="contact-form-title">Envoyez-nous un message</h2>
                        <p className="contact-form-subtitle">Remplissez le formulaire ci-dessous, nous vous répondrons dans les plus brefs délais.</p>
                        
                        <form className="contact-form" onSubmit={(e) => e.preventDefault()}>
                            <div className="form-group-row">
                                <div className="contact-input-field">
                                    <label>Nom Complet</label>
                                    <input type="text" placeholder="Ex: Ahmed Alaoui" required />
                                </div>
                                <div className="contact-input-field">
                                    <label>E-mail</label>
                                    <input type="email" placeholder="votre@email.com" required />
                                </div>
                            </div>

                            <div className="form-group-row">
                                <div className="contact-input-field">
                                    <label>Téléphone</label>
                                    <input type="tel" placeholder="+212 6..." />
                                </div>
                                <div className="contact-input-field">
                                    <label>Sujet</label>
                                    <input type="text" placeholder="Ex: Inscription, Information..." required />
                                </div>
                            </div>

                            <div className="contact-input-field">
                                <label>Votre Message</label>
                                <textarea rows="6" placeholder="Comment pouvons-nous vous aider ?" required></textarea>
                            </div>

                            <button type="submit" className="contact-submit-btn">
                                <Send size={20} />
                                Envoyer le message
                            </button>
                        </form>
                    </motion.div>

                    {/* Map */}
                    <motion.div 
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="contact-map-wrapper"
                    >
                        {/* Placeholder for real Google Map - using a refined styled one */}
                        <iframe 
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m1m3!1d3397.873523588974!2d-7.98939222438!3d31.60995137417537!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xdafefd34ed18395%3A0x6b864a7c062c3e1b!2sISTA%20NTIC%20Sidi%20Youssef%20Ben%20Ali!5e0!3m2!1sfr!2sma!4v1711234567890!5m2!1sfr!2sma" 
                            allowFullScreen="" 
                            loading="lazy" 
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Localisation ISTA NTIC SYBA"
                        ></iframe>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}