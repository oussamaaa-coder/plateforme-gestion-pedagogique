import { motion } from 'framer-motion';

export default function MentionsLegales() {
    return (
        <div className="gh-page-wrapper">
            <div className="gh-hero-section">
                <motion.h1
                    className="gh-hero-title"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    Mentions Légales
                </motion.h1>
                <p className="gh-hero-subtitle">Informations légales relatives à ce site</p>
            </div>

            <div className="gh-content-section">
                <motion.div
                    className="gh-content-card"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                >
                    <h2>Éditeur du site</h2>
                    <p>
                        <strong>ISTA NTIC SYBA</strong> — Institut Spécialisé de Technologie Appliquée NTIC SYBA<br />
                        Rattaché à l'Office de la Formation Professionnelle et de la Promotion du Travail (<strong>OFPPT</strong>)<br />
                        Adresse : Avenue Al Adarissa, Marrakech, Maroc<br />
                        Téléphone : 05 24 40 41 69<br />
                        Email : contact@nticsyba.ma
                    </p>

                    <h2>Hébergement</h2>
                    <p>
                        Ce site est hébergé dans le cadre du système d'information de l'OFPPT.
                    </p>

                    <h2>Propriété intellectuelle</h2>
                    <p>
                        L'ensemble du contenu de ce site (textes, images, logos, documents) est la propriété exclusive
                        de l'ISTA NTIC SYBA / OFPPT. Toute reproduction, même partielle, est interdite sans autorisation préalable.
                    </p>

                    <h2>Limitation de responsabilité</h2>
                    <p>
                        L'ISTA NTIC SYBA s'efforce d'assurer l'exactitude et la mise à jour des informations diffusées.
                        Toutefois, elle ne peut garantir l'exactitude, la précision ou l'exhaustivité des informations mises
                        à disposition sur ce site.
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
