import React from 'react';
import { motion } from 'framer-motion';
import FilliereCard from './FilliereCard';
import '../../assets/css/Filliere.css';
import devDigitalImg from '../../assets/images/filieres/dev_digital.png';
import webFullStackImg from '../../assets/images/filieres/web_fullstack.png';
import mobileImg from '../../assets/images/filieres/mobile_apps.png';
import infraImg from '../../assets/images/filieres/infrastructure.jpg';

const FILIERES = [
  {
    id: 1,
    titre: 'Développement Digital',
    description: '',
    image: devDigitalImg,
    duree: '2 ans',
    niveau: 'Technicien Spécialisé (Bac+2)',
  },
  {
    id: 3,
    titre: 'Web Full Stack',
    description: '',
    image: webFullStackImg,
    duree: '2 ans',
    niveau: 'Technicien Spécialisé (Bac+2)',
  },
  {
    id: 2,
    titre: 'Applications Mobiles',
    description: '',
    image: mobileImg,
    duree: '2 ans',
    niveau: 'Technicien Spécialisé (Bac+2)',
  },
  {
    id: 4,
    titre: 'Infrastructure Digitale',
    description: '', 
    image: infraImg,
    duree: '2 ans',
    niveau: 'Technicien Spécialisé (Bac+2)',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2
    }
  }
};

export { FILIERES };

export default function Filliere() {
  return (
    <section className="filliere-section" aria-label="Filières d'excellence">
      <div className="filliere-header">
        <h2 className="filliere-header__title">
          Nos Filières d'Excellence
        </h2>
      </div>

      <motion.div 
        className="filliere-grid"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
      >
        {FILIERES.map((filiere, index) => (
          <FilliereCard key={filiere.id} filiere={filiere} index={index} />
        ))}
      </motion.div>
    </section>
  );
}