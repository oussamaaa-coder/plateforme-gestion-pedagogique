import React from 'react';
import { LogIn, PhoneCall } from 'lucide-react';
import { motion } from 'framer-motion';
import '../../assets/css/DigitalSpace.css';

const DigitalSpace = () => {
    return (
        <section className="digital-space-section">
            <div className="digital-space-shape" />
            
            <div className="digital-space-container">
                <motion.div 
                    className="digital-space-content"
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    viewport={{ once: true }}
                >
                    <h2 className="digital-space-title">Espace Numérique</h2>
                    <p className="digital-space-description">
                        Vous êtes étudiant ou enseignant ? Accédez à votre tableau de bord, 
                        consultez vos notes, emplois du temps et actualités en un clic.
                    </p>
                </motion.div>

                <motion.div 
                    className="digital-space-actions"
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                    viewport={{ once: true }}
                >
                    <a href="/choix-compte" className="digital-btn digital-btn--primary">
                        <LogIn size={18} />
                        Se Connecter
                    </a>
                    <a href="/contact" className="digital-btn digital-btn--outline">
                        <PhoneCall size={18} />
                        Contact
                    </a>
                </motion.div>
            </div>
        </section>
    );
};

export default DigitalSpace;
