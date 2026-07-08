import { Link } from "react-router-dom";
import "../assets/css/choix_compte.css";

function LoginChoice() {
    return (
        <>
            <div className="login-choice-container">
                <div className="login-choice-header">
                    <span className="login-choice-eyebrow">Bienvenue</span>
                    <h2 className="login-choice-title">Accéder à votre espace</h2>
                    <div className="title-underline"></div>
                </div>

                <div className="choice-cards">
                    {/* ── Étudiant / Formateur ── */}
                    <Link to="/login" className="choice-card student">
                        <div className="card-glow"></div>
                        <div className="card-icon">
                            <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M32 8L4 22L32 36L60 22L32 8Z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" fill="none" />
                                <path d="M16 29V43C16 43 22 50 32 50C42 50 48 43 48 43V29" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M60 22V34" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                                <circle cx="60" cy="37" r="3" fill="currentColor" />
                            </svg>
                        </div>
                        <span className="card-label">Étudiant / Formateur</span>
                        <p className="card-description">
                            Accédez à votre espace personnel — notes, emploi du temps, classes et ressources.
                        </p>
                        <div className="card-arrow">
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                    </Link>

                    {/* ── Admin ── */}
                    <Link to="/admin/login" className="choice-card admin">
                        <div className="card-glow"></div>
                        <div className="card-icon">
                            <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="32" cy="20" r="10" stroke="currentColor" strokeWidth="2.5" fill="none" />
                                <path d="M32 10V8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                                <path d="M32 32V30" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                                <path d="M22 20H20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                                <path d="M44 20H42" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                                <path d="M24.93 13.1L23.52 11.69" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                                <path d="M40.48 28.31L39.07 26.9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                                <path d="M24.93 26.9L23.52 28.31" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                                <path d="M40.48 11.69L39.07 13.1" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                                <circle cx="32" cy="20" r="4" stroke="currentColor" strokeWidth="2.5" fill="none" />
                                <path d="M14 52C14 44.268 22.059 38 32 38C41.941 38 50 44.268 50 52" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                                <path d="M8 52H56" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                            </svg>
                        </div>
                        <span className="card-label">Administrateur</span>
                        <p className="card-description">
                            Gérez les utilisateurs, les paramètres et supervisez la plateforme.
                        </p>
                        <div className="card-arrow">
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                    </Link>
                </div>
            </div>
        </>
    );
}

export default LoginChoice;