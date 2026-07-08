import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import '../assets/css/GlobalHarmony.css';

export default function NotFound() {
    return (
        <div style={{
            minHeight: '70vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '4rem 2rem',
            background: 'linear-gradient(135deg, #0a1628 0%, #1a2a4a 100%)',
        }}>
            <motion.div
                initial={{ opacity: 0, y: -40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <h1 style={{
                    fontSize: 'clamp(6rem, 15vw, 12rem)',
                    fontWeight: '900',
                    background: 'linear-gradient(135deg, #4fc3f7, #29b6f6, #0288d1)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    lineHeight: 1,
                    marginBottom: '1rem',
                }}>404</h1>

                <h2 style={{
                    color: '#e0f7fa',
                    fontSize: 'clamp(1.2rem, 3vw, 1.8rem)',
                    fontWeight: '600',
                    marginBottom: '1rem',
                }}>
                    Page introuvable
                </h2>

                <p style={{
                    color: '#90a4ae',
                    fontSize: '1rem',
                    maxWidth: '480px',
                    lineHeight: '1.7',
                    marginBottom: '2.5rem',
                }}>
                    La page que vous cherchez n'existe pas ou a été déplacée.
                    Revenez à l'accueil pour continuer votre navigation.
                </p>

                <Link
                    to="/"
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        background: 'linear-gradient(135deg, #0288d1, #0077b6)',
                        color: '#fff',
                        padding: '0.85rem 2.2rem',
                        borderRadius: '50px',
                        fontWeight: '600',
                        fontSize: '1rem',
                        textDecoration: 'none',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        boxShadow: '0 4px 20px rgba(2, 136, 209, 0.4)',
                    }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                        <polyline points="9 22 9 12 15 12 15 22" />
                    </svg>
                    Retour à l'accueil
                </Link>
            </motion.div>
        </div>
    );
}
