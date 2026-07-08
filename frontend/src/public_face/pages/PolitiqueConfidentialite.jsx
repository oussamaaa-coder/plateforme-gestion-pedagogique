import { motion } from 'framer-motion';

export default function PolitiqueConfidentialite() {
    return (
        <div className="gh-page-wrapper">
            <div className="gh-hero-section">
                <motion.h1
                    className="gh-hero-title"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    Politique de Confidentialité
                </motion.h1>
                <p className="gh-hero-subtitle">Comment nous traitons vos données personnelles</p>
            </div>

            <div className="gh-content-section">
                <motion.div
                    className="gh-content-card"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                >
                    <h2>Collecte des données</h2>
                    <p>
                        Le site ISTA NTIC SYBA collecte uniquement les données nécessaires au bon fonctionnement des services proposés.
                        Les données collectées via le formulaire de contact (nom, email, message) sont utilisées exclusivement pour
                        répondre à vos demandes.
                    </p>

                    <h2>Utilisation des données</h2>
                    <p>
                        Les données personnelles collectées ne sont jamais cédées, vendues ou transmises à des tiers sans votre
                        consentement explicite, sauf obligation légale.
                    </p>

                    <h2>Sécurité</h2>
                    <p>
                        Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données
                        contre tout accès non autorisé, perte ou destruction.
                    </p>

                    <h2>Vos droits</h2>
                    <p>
                        Conformément à la loi 09-08 relative à la protection des personnes physiques à l'égard du
                        traitement des données à caractère personnel, vous disposez d'un droit d'accès, de rectification
                        et de suppression de vos données. Pour exercer ces droits, contactez-nous à : <strong>contact@nticsyba.ma</strong>
                    </p>

                    <h2>Cookies</h2>
                    <p>
                        Ce site utilise des cookies techniques indispensables à son fonctionnement. Aucun cookie publicitaire
                        ou de traçage tiers n'est utilisé.
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
