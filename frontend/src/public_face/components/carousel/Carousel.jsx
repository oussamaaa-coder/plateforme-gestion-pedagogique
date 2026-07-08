import { useState, useEffect, useRef, useCallback } from 'react';
import './Carousel.css';
import ista from '../../assets/images/ista.jpg';
import ista_acti from '../../assets/images/ista_acti.jpg';
import conf from '../../assets/images/conf.png';
import dehors from '../../assets/images/dehors.png';
import campus from '../../assets/images/campus.jpg';
const DEFAULT_SLIDES = [
    {
        src: ista,
        alt: 'ista',
        tag: 'Bienvenue',
        title: 'Bienvenue au ISTA NTIC Syba',
        desc: 'Votre avenir commence ici - Excellence, Innovation et Réussite',
    },
    {
        src: ista_acti,
        alt: 'ista',
        tag: 'Campus',
        title: 'Un Campus Moderne',
        desc: 'Un environnement propice à l\'apprentissage et à l\'épanouissement',
    },
    {
        src: conf,
        alt: 'ista',
        tag: 'Infrastructures',
        title: 'Infrastructures de Qualité',
        desc: 'Des espaces conçus pour votre confort et votre réussite',
    },
    {
        src: dehors,
        alt: 'ista',
        tag: 'Environnement',
        title: 'Un Cadre de Vie Agréable',
        desc: 'Profitez d\'un environnement verdoyant et calme',
    },
    {
        src: campus,
        alt: 'ista',
        tag: 'Excellence',
        title: 'Rejoignez l\'Excellence',
        desc: 'Une formation reconnue et des débouchés assurés'
    },
];


export default function Carousel({
    slides = DEFAULT_SLIDES,
    duration = 4000,
    showBrand = true,
    brandText = 'ISTA NTIC Syba',
    brandEm = 'ISTA NTIC Syba',
    fullscreen = false,
    height = '55vh',
}) {
    const total = slides.length;

    const [current, setCurrent] = useState(0);
    const [leaving, setLeaving] = useState(null);
    const [progress, setProgress] = useState(0);

    const isPaused = useRef(false);
    const rafId = useRef(null);
    const startTime = useRef(null);
    const elapsed = useRef(0);
    const currentRef = useRef(current);

    useEffect(() => { currentRef.current = current; }, [current]);

    /* ── goNext ───────────────────────────────────────────── */
    const goNext = useCallback(() => {
        setCurrent(prev => {
            const next = (prev + 1) % total;
            setLeaving(prev);
            return next;
        });
    }, [total]);

    /* ── startProgress ────────────────────────────────────── */
    const startProgress = useCallback(() => {
        cancelAnimationFrame(rafId.current);
        startTime.current = null;

        const tick = (now) => {
            if (isPaused.current) return;
            if (startTime.current === null) startTime.current = now;

            const totalMs = elapsed.current + (now - startTime.current);
            const pct = Math.min(totalMs / duration, 1);
            setProgress(pct);

            if (pct < 1) {
                rafId.current = requestAnimationFrame(tick);
            } else {
                elapsed.current = 0;
                goNext();
            }
        };

        rafId.current = requestAnimationFrame(tick);
    }, [duration, goNext]);

    /* ── pauseProgress ────────────────────────────────────── */
    const pauseProgress = useCallback(() => {
        cancelAnimationFrame(rafId.current);
        elapsed.current += performance.now() - (startTime.current ?? performance.now());
        startTime.current = null;
    }, []);

    /* ── resumeProgress ───────────────────────────────────── */
    const resumeProgress = useCallback(() => {
        startTime.current = null;
        startProgress();
    }, [startProgress]);

    /* ── resetProgress ────────────────────────────────────── */
    const resetProgress = useCallback(() => {
        cancelAnimationFrame(rafId.current);
        elapsed.current = 0;
        startTime.current = null;
        setProgress(0);
        startProgress();
    }, [startProgress]);

    /* ── Démarrage initial ────────────────────────────────── */
    useEffect(() => {
        resetProgress();
        return () => cancelAnimationFrame(rafId.current);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /* ── Reset quand current change ───────────────────────── */
    const isFirstRender = useRef(true);
    useEffect(() => {
        if (isFirstRender.current) { isFirstRender.current = false; return; }
        resetProgress();
        const timer = setTimeout(() => setLeaving(null), 800);
        return () => clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [current]);

    /* ── Navigation ───────────────────────────────────────── */
    const changeTo = useCallback((index) => {
        if (index === currentRef.current) return;
        setLeaving(currentRef.current);
        setCurrent(index);
    }, []);

    const handlePrev = useCallback(() => {
        changeTo((currentRef.current - 1 + total) % total);
    }, [changeTo, total]);

    const handleNext = useCallback(() => {
        changeTo((currentRef.current + 1) % total);
    }, [changeTo, total]);

    const handleKeyDown = useCallback((e) => {
        switch (e.key) {
            case 'ArrowRight':
            case 'ArrowDown': e.preventDefault(); handleNext(); break;
            case 'ArrowLeft':
            case 'ArrowUp': e.preventDefault(); handlePrev(); break;
            case 'Home': e.preventDefault(); changeTo(0); break;
            case 'End': e.preventDefault(); changeTo(total - 1); break;
            default: break;
        }
    }, [handleNext, handlePrev, changeTo, total]);


    /* ── Render ───────────────────────────────────────────── */
    return (
        <section
            className={`carousel${fullscreen ? ' carousel--fullscreen' : ' carousel--inline'}`}
            style={!fullscreen ? { height } : undefined}
            aria-label="Galerie d'images"
            tabIndex={0}
            onKeyDown={handleKeyDown}
        >
            {showBrand && (
                <div className="carousel__brand" aria-hidden="true">
                    {brandText} <em>{brandEm}</em>
                </div>
            )}

            <div className="carousel__progress-track" aria-hidden="true">
                <div
                    className="carousel__progress-bar"
                    style={{ width: `${(progress * 100).toFixed(3)}%` }}
                />
            </div>

            <div className="carousel__counter" aria-live="polite">
                <span>{current + 1}</span>
                <span className="carousel__counter-sep">/</span>
                <span>{total}</span>
            </div>

            <div className="carousel__slides">
                {slides.map((slide, i) => (
                    <article
                        key={i}
                        className={[
                            'carousel__slide',
                            i === current ? 'is-active' : '',
                            i === leaving ? 'is-leaving' : '',
                        ].join(' ').trim()}
                        role="group"
                        aria-roledescription="slide"
                        aria-label={`Image ${i + 1} sur ${total}`}
                        aria-hidden={i !== current}
                    >
                        <div className="carousel__img-wrap">
                            <img
                                src={slide.src}
                                alt={slide.alt}
                                loading={i === 0 ? 'eager' : 'lazy'}
                            />
                        </div>
                        <div className="carousel__caption">
                            <span className="carousel__tag">{slide.tag}</span>
                            <h2 className="carousel__title">{slide.title}</h2>
                            <p className="carousel__desc">{slide.desc}</p>
                        </div>
                    </article>
                ))}
            </div>

            <button
                className="carousel__nav carousel__nav--prev"
                onClick={handlePrev}
                aria-label="Image précédente"
            >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <polyline points="15 18 9 12 15 6" />
                </svg>
            </button>

            <button
                className="carousel__nav carousel__nav--next"
                onClick={handleNext}
                aria-label="Image suivante"
            >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <polyline points="9 18 15 12 9 6" />
                </svg>
            </button>

            <div className="carousel__dots" role="tablist" aria-label="Sélecteur de slide">
                {slides.map((_, i) => (
                    <button
                        key={i}
                        className={`carousel__dot${i === current ? ' carousel__dot--active' : ''}`}
                        role="tab"
                        aria-selected={i === current}
                        aria-label={`Aller à l'image ${i + 1}`}
                        onClick={() => changeTo(i)}
                    />
                ))}
            </div>
        </section>
    );
}
