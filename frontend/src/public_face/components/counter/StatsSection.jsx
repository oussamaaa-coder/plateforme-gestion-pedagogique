import { useEffect, useRef, useState } from 'react';
import { motion, useSpring, useTransform, useInView } from 'framer-motion';
import ScrollFloat from '../animations/ScrollFloat';
import './StatsSection.css';

const STATS = [
    { value: 4, suffix: '', label: "Filières d'Excellence" },
    { value: 2000, suffix: '+', label: 'Lauréats' },
    { value: 90, suffix: '%', label: 'Insertion Professionnelle' },
];

function StatItem({ stat }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });
    const [displayCount, setDisplayCount] = useState(0);

    const springValue = useSpring(0, {
        stiffness: 40,
        damping: 20,
        restDelta: 0.001
    });

    useEffect(() => {
        return springValue.on("change", (latest) => {
            setDisplayCount(Math.round(latest));
        });
    }, [springValue]);

    useEffect(() => {
        if (isInView) {
            springValue.set(stat.value);
        }
    }, [isInView, stat.value, springValue]);

    return (
        <div className="stats__item" ref={ref}>
            <span className="stats__number">
                {displayCount.toLocaleString('fr')}{stat.suffix}
            </span>
            <span className="stats__label">{stat.label}</span>
        </div>
    );
}

export default function StatsSection() {
    return (
        <section className="stats">
            <ScrollFloat
                animationDuration={1}
                ease='back.inOut(2)'
                scrollStart='center bottom+=60%'
                scrollEnd='bottom bottom-=30%'
                stagger={0.03}
                containerClassName="stats__title-container"
                textClassName="stats__title-text"
            >
            </ScrollFloat>
            <div className="stats__row stats__row--active">
                {STATS.map((stat, i) => (
                    <StatItem key={i} stat={stat} />
                ))}
            </div>
        </section>
    );
}