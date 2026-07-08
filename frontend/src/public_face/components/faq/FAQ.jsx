import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import '../../assets/css/FAQ.css';

const faqData = [
    {
        question: "Comment obtenir une information sur une spécialité donnée ?",
        answer: "Vous pouvez obtenir des informations détaillées sur nos filières directement auprès de l'établissement le plus proche de chez vous ou en contactant la Direction Régionale de l'OFPPT. Nos conseillers en orientation sont également à votre disposition pour vous guider dans votre choix professionnel."
    },
    {
        question: "Quels sont les types de diplômes délivrés par l'OFPPT ?",
        answer: (
            <div>
                L'OFPPT délivre des diplômes reconnus par l'État pour chaque niveau de formation :
                <ul>
                    <li><strong>Technicien Spécialisé (TS)</strong> : Niveau Bac+2.</li>
                    <li><strong>Technicien (T)</strong> : Pour les élèves ayant le niveau Bac.</li>
                    <li><strong>Qualification Professionnelle (QP)</strong> : Pour les élèves ayant achevé le cycle collégial.</li>
                    <li><strong>Spécialisation Professionnelle (SP)</strong> : Pour les élèves ayant achevé le cycle primaire.</li>
                    <li><strong>Certificat de Formation</strong> : Pour les formations qualifiantes de courte durée.</li>
                </ul>
            </div>
        )
    },
    {
        question: "Comment la formation est-elle évaluée ?",
        answer: "Le cursus est ponctué par plusieurs étapes d'évaluation pour garantir l'acquisition des compétences : contrôles continus tout au long de l'année, examens de fin de modules (EFM), examen de passage (pour les formations sur 2 ans) et enfin l'Examen de Fin de Formation (EFF) pour l'obtention définitive du diplôme."
    },
    {
        question: "Quelle est la durée d'une formation organisée en cours du jour ?",
        answer: "La durée varie selon le niveau : 2 ans pour les Techniciens Spécialisés et Techniciens, 15 mois pour la Qualification, et 1 an pour la Spécialisation. Ces durées intègrent des stages obligatoires en entreprise. Les formations qualifiantes varient de 3 à 12 mois."
    },
    {
        question: "Quels sont les secteurs de formations couverts par l'OFPPT ?",
        answer: "Nous couvrons plus de 20 secteurs d'activité stratégiques, notamment le Digital & Intelligence Artificielle, Gestion & Commerce, Industrie, BTP, Hôtellerie & Tourisme, Transport & Logistique, Santé, et les Arts Graphiques."
    },
    {
        question: "Quels sont les niveaux des formations assurées ?",
        answer: "Nous proposons quatre niveaux de formation diplômante accessibles selon votre parcours scolaire (du Primaire au Baccalauréat), ainsi que des formations qualifiantes permettant une montée en compétences rapide pour une insertion professionnelle immédiate."
    }
];

const FAQItem = ({ question, answer, isOpen, toggle }) => {
    return (
        <div className={`faq-item ${isOpen ? 'active' : ''}`}>
            <button className="faq-question" onClick={toggle}>
                <h3>{question}</h3>
                <span className="faq-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                </span>
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
                    >
                        <div className="faq-answer">
                            {typeof answer === 'string' ? <p>{answer}</p> : answer}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const FAQ = () => {
    const [activeIndex, setActiveIndex] = useState(null);

    const toggleAccordion = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <section className="faq-section">
            <div className="faq-header">
                <h2 className="faq-header__title">Foire Aux Questions</h2>
            </div>
            
            <div className="faq-container">
                {faqData.map((item, index) => (
                    <FAQItem
                        key={index}
                        question={item.question}
                        answer={item.answer}
                        isOpen={activeIndex === index}
                        toggle={() => toggleAccordion(index)}
                    />
                ))}
            </div>
        </section>
    );
};

export default FAQ;
