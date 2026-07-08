import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import '../../assets/css/Filliere.css';

const cardVariants = {
  hidden: { 
    opacity: 0, 
    y: 60,
    clipPath: 'inset(10% 0 10% 0)' 
  },
  visible: {
    opacity: 1,
    y: 0,
    clipPath: 'inset(0% 0 0% 0)',
    transition: {
      duration: 1.2,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

/**
 * FilliereCard – Carte photo-overlay cliquable avec effet Glassmorphism.
 */
function FilliereCard({ filiere }) {
  const navigate = useNavigate();

  const handleClick = () => navigate(`/filiere/${filiere.id}`);
  
  // Magnetic effect for CTA
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseX = useSpring(x, { stiffness: 150, damping: 15 });
  const mouseY = useSpring(y, { stiffness: 150, damping: 15 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) * 0.35);
    y.set((e.clientY - centerY) * 0.35);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') handleClick();
  };

  return (
    <motion.article
      variants={cardVariants}
      className={`filliere-card ${filiere.className || ''}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`Voir la filière ${filiere.titre}`}
    >
      {/* Background image reveal */}
      <motion.div
        className="filliere-card__bg"
        initial={{ scale: 1.2, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
        style={{ backgroundImage: `url(${filiere.image})` }}
        aria-hidden="true"
      />

      {/* Glass Overlay */}
      <div className="filliere-card__overlay" aria-hidden="true" />

      {/* Badge niveau */}
      {filiere.niveau && (
        <span className="filliere-card__badge">
          {filiere.niveau}
        </span>
      )}

      {/* Content */}
      <div className="filliere-card__content">
        <h3 className="filliere-card__title">{filiere.titre}</h3>

        {/* Description revealed on hover via CSS */}
        <p className="filliere-card__desc">
          {filiere.description || "Découvrez notre programme d'excellence académique et professionnelle."}
        </p>

        <motion.span 
          className="filliere-card__cta"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{ x: mouseX, y: mouseY }}
        >
          En savoir plus <span className="filliere-card__cta-arrow">→</span>
        </motion.span>
      </div>
    </motion.article>
  );
}

export default FilliereCard;