import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Carousel3D.css';

// Import images
import ista from '../../assets/images/ista.jpg';
import ista_acti from '../../assets/images/ista_acti.jpg';
import conf from '../../assets/images/conf.png';
import dehors from '../../assets/images/dehors.png';
import campus from '../../assets/images/campus.jpg';

const SLIDES = [
    { src: ista, tag: 'Bienvenue', title: 'Bienvenue au ISTA NTIC Syba', desc: 'Votre avenir commence ici - Excellence, Innovation et Réussite' },
    { src: ista_acti, tag: 'Campus', title: 'Un Campus Moderne', desc: 'Un environnement propice à l\'apprentissage et à l\'épanouissement' },
    { src: conf, tag: 'Infrastructures', title: 'Infrastructures de Qualité', desc: 'Des espaces conçus pour votre confort et votre réussite' },
    { src: dehors, tag: 'Environnement', title: 'Un Cadre de Vie Agréable', desc: 'Profitez d\'un environnement verdoyant et calme' },
    { src: campus, tag: 'Excellence', title: 'Rejoignez l\'Excellence', desc: 'Une formation reconnue et des débouchés assurés' },
];

export default function Carousel3D({ slides = SLIDES, height = '80vh' }) {
    const [current, setCurrent] = useState(0);
    const total = slides.length;

    const nextSlide = useCallback(() => {
        setCurrent((prev) => (prev + 1) % total);
    }, [total]);

    const prevSlide = useCallback(() => {
        setCurrent((prev) => (prev - 1 + total) % total);
    }, [total]);

    // Progress & Auto-advance synchronizer
    useEffect(() => {
        const timer = setInterval(() => {
            nextSlide();
        }, 4000); // 4 seconds per slide

        return () => clearInterval(timer);
    }, [nextSlide]); // This is stable as nextSlide is useCallback wrapped

    return (
        <section className="carousel3d-section" style={{ height }}>
            {/* Background Images with Crossfade and subtle zoom (Ken Burns effect) */}
            <div className="carousel3d-canvas-wrap" style={{ overflow: 'hidden', position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}>
                <AnimatePresence mode="popLayout" initial={false}>
                    <motion.div
                        key={current}
                        initial={{ opacity: 0, scale: 1.05 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{
                            opacity: { duration: 1.2, ease: "easeInOut" },
                            scale: { duration: 4, ease: "linear" }
                        }}
                        style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            backgroundImage: `url(${slides[current].src})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            willChange: "transform, opacity"
                        }}
                    />
                </AnimatePresence>
                {/* Dark Overlay for better text readability */}
                <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(4, 15, 29, 0.5)", zIndex: 1 }} />
            </div>

            <div className="carousel3d-overlay" style={{ zIndex: 2 }}>
                <div className="carousel3d-container-inner">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={current}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -15 }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                            className="carousel3d-content"
                        >
                            <div className="carousel3d-progress card-progress">
                                <motion.div
                                    key={current}
                                    className="carousel3d-progress-bar"
                                    initial={{ width: "0%" }}
                                    animate={{ width: "100%" }}
                                    transition={{ duration: 4, ease: "linear" }}
                                />
                            </div>
                            <span className="carousel3d-tag">{slides[current].tag}</span>
                            <h1 className="carousel3d-title">{slides[current].title}</h1>
                            <p className="carousel3d-desc">{slides[current].desc}</p>
                        </motion.div>
                    </AnimatePresence>

                    <div className="carousel3d-nav-bottom">
                        <div className="carousel3d-controls">
                            <button onClick={prevSlide} className="carousel3d-arrow">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
                            </button>
                            <div className="carousel3d-dots">
                                {slides.map((_, i) => (
                                    <div
                                        key={i}
                                        onClick={() => setCurrent(i)}
                                        className={`carousel3d-dot ${i === current ? 'active' : ''}`}
                                    />
                                ))}
                            </div>
                            <button onClick={nextSlide} className="carousel3d-arrow">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
