import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import etudiantData from './etudiant.json';
import '../../assets/css/Etudiant.css';

// Import images dynamically or using a map
import image1_girl from '../../assets/images/etudiant/image1_girl.jpg';
import image2_girl from '../../assets/images/etudiant/image2_girl.jpg';
import image3_girl from '../../assets/images/etudiant/image3_girl.jpg';
import image4_boy from '../../assets/images/etudiant/image4_boy.jpg';
import image5_boy from '../../assets/images/etudiant/image5_boy.png';
import image6_boy from '../../assets/images/etudiant/image6_boy.jpg';
import image7_boy from '../../assets/images/etudiant/image7_boy.jpg';

const imagesMap = {
    image1_girl,
    image2_girl,
    image3_girl,
    image4_boy,
    image5_boy,
    image6_boy,
    image7_boy
};

const Etudiant = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [visibleCards, setVisibleCards] = useState(3);
    const timeoutRef = useRef(null);

    const students = etudiantData.map(item => ({
        ...item,
        imageSrc: imagesMap[item.image] || item.image
    }));

    const updateVisibleCards = useCallback(() => {
        if (window.innerWidth <= 768) {
            setVisibleCards(1);
        } else if (window.innerWidth <= 1024) {
            setVisibleCards(2);
        } else {
            setVisibleCards(3);
        }
    }, []);

    useEffect(() => {
        updateVisibleCards();
        window.addEventListener('resize', updateVisibleCards);
        return () => window.removeEventListener('resize', updateVisibleCards);
    }, [updateVisibleCards]);

    const maxIndex = Math.max(0, students.length - visibleCards);

    const resetTimeout = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
    };

    useEffect(() => {
        resetTimeout();
        timeoutRef.current = setTimeout(() => {
            setCurrentIndex((prevIndex) => 
                prevIndex >= maxIndex ? 0 : prevIndex + 1
            );
        }, 2000); // Auto-slide every 2 seconds

        return () => resetTimeout();
    }, [currentIndex, maxIndex]);

    const handleNext = () => {
        resetTimeout();
        setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    };

    const handlePrev = () => {
        resetTimeout();
        setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
    };

    const handleDotClick = (index) => {
        resetTimeout();
        setCurrentIndex(index);
    };

    const totalDots = students.length - visibleCards + 1;

    return (
        <section className="etudiant-section" id="etudiants">
            <div className="etudiant-header">
                <h2 className="etudiant-header__title">
                    Nos Étudiants
                </h2>
            </div>

            <div className="etudiant-carousel-viewport">
                <motion.div 
                    className="etudiant-carousel-track"
                    animate={{ x: `calc(-${currentIndex * (100 / visibleCards)}% - ${currentIndex * (30 / visibleCards)}px)` }}
                    transition={{ type: "spring", stiffness: 100, damping: 20 }}
                >
                    {students.map((student, index) => (
                        <div 
                            key={index} 
                            className="etudiant-card-container"
                            style={{ width: `calc((100% - ${(visibleCards - 1) * 30}px) / ${visibleCards})` }}
                        >
                            <div className="etudiant-card">
                                <div className="etudiant-card-content">
                                    <Quote className="etudiant-quote-icon" size={30} />
                                    <p className="etudiant-quote-text">
                                        "{student.quote}"
                                    </p>
                                </div>
                                <div className="etudiant-profile">
                                    <img 
                                        src={student.imageSrc} 
                                        alt={student.nom_competence} 
                                        className="etudiant-avatar" 
                                    />
                                    <div className="etudiant-info">
                                        <h4 className="etudiant-name">{student.nom_competence}</h4>
                                        <span className="etudiant-metier">{student.metier}</span>
                                        <span className="etudiant-laureat">{student.laureat}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </motion.div>

                <div className="etudiant-controls">
                    <button 
                        className="etudiant-ctrl-btn" 
                        onClick={handlePrev}
                        aria-label="Previous"
                    >
                        <ChevronLeft size={24} />
                    </button>

                    <div className="etudiant-indicators">
                        {Array.from({ length: Math.max(0, totalDots) }).map((_, i) => (
                            <div 
                                key={i} 
                                className={`etudiant-dot ${currentIndex === i ? 'active' : ''}`}
                                onClick={() => handleDotClick(i)}
                            />
                        ))}
                    </div>

                    <button 
                        className="etudiant-ctrl-btn" 
                        onClick={handleNext}
                        aria-label="Next"
                    >
                        <ChevronRight size={24} />
                    </button>
                </div>
            </div>
        </section>
    );
};

export default Etudiant;
