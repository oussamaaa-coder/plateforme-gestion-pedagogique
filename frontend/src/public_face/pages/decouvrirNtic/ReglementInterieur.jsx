import React from 'react';
import { Link } from 'react-router-dom';
import '../../assets/css/ReglementInterieur.css';

// PDF Import (Vite/React way)
import pdfFile from '../../assets/pdf/Règlement Intérieur des EFP de l\'OFPPT_1.pdf';

const ICONS = {
    scroll: <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>,
    edit: <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>,
    clock: <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>,
    briefcase: <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>,
    users: <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><circle cx="19" cy="11" r="4"></circle></svg>,
    alert: <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>,
    justice: <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><circle cx="6" cy="19" r="3"></circle><circle cx="18" cy="19" r="3"></circle><path d="M6 16V6a6 6 0 0 1 12 0v10"></path><line x1="12" y1="2" x2="12" y2="22"></line></svg>,
    chart: <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>,
    graduation: <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c3 3 9 3 12 0v-5"></path></svg>,
    trending: <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>,
    download: <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>,
    target: <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>
};

const ReglementInterieur = () => {
    const rules = [
        {
            id: 1,
            title: "C’est quoi ce règlement ?",
            content: "C’est un document qui explique comment fonctionne l’établissement, les droits et devoirs des stagiaires, ainsi que les règles de discipline, sécurité et comportement. Tous les stagiaires doivent le respecter.",
            icon: ICONS.scroll
        },
        {
            id: 2,
            title: "Accès et inscription",
            content: "On entre à l’OFPPT par test, entretien ou sélection. Il faut déposer un dossier complet et payer les frais d'inscription (non remboursables).",
            icon: ICONS.edit
        },
        {
            id: 3,
            title: "Organisation de la formation",
            content: "Formations diplômantes (TS, T, Qualification) ou qualifiantes. Horaires : du lundi au samedi (8h → 18h30). Obligation d'assister aux cours et de passer les examens.",
            icon: ICONS.clock
        },
        {
            id: 4,
            title: "Stage en entreprise",
            content: "Obligatoire pour appliquer vos acquis. Le stage est noté et compte dans votre moyenne générale de fin d'année.",
            icon: ICONS.briefcase
        },
        {
            id: 5,
            title: "Droits des stagiaires",
            content: "Le droit de s’exprimer avec respect, de participer à des réunions autorisées et de recevoir de l’aide en cas de difficulté d'apprentissage.",
            icon: ICONS.users
        },
        {
            id: 6,
            title: "Obligations Importantes",
            content: "Respect mutuel, ponctualité, tenue correcte. Interdiction de fumer, d'utiliser le téléphone en classe ou d'apporter des objets interdits.",
            icon: ICONS.alert
        },
        {
            id: 7,
            title: "Discipline et sanctions",
            content: "Mise en garde, avertissement, exclusion temporaire ou définitive. Les parents sont systématiquement informés des sanctions graves.",
            icon: ICONS.justice
        },
        {
            id: 8,
            title: "Examens & Évaluations",
            content: "Contrôles continus, examens de fin de module et examen final. Toute absence non justifiée entraîne la note 0. La fraude est lourdement sanctionnée.",
            icon: ICONS.chart
        },
        {
            id: 9,
            title: "Passage et réussite",
            content: "Moyenne ≥ 10 pour passer. Entre 9 et 10, décision du conseil de classe. < 9 entraîne le redoublement ou la réorientation.",
            icon: ICONS.graduation
        },
        {
            id: 10,
            title: "Comportement & Assiduité",
            content: "Les retards et absences injustifiés impactent la note de comportement et peuvent mener à des sanctions disciplinaires.",
            icon: ICONS.trending
        }
    ];

    return (
        <div className="ri-page-wrapper">
            {/* Hero Section */}
            <header className="h-hero-section">
                <div className="h-hero-container">
                    <div className="h-hero-tag">Cadre de Vie</div>
                    <h1 className="h-hero-title">Règlement Intérieur</h1>
                    <p className="h-hero-subtitle">
                        Les règles de vie commune pour garantir l'excellence et le respect mutuel au sein de l'institut.
                    </p>
                </div>
            </header>

            <div className="ri-container">
                {/* Breadcrumb */}
                <nav className="h-breadcrumb-section">
                    <div className="h-breadcrumb-container">
                        <Link to="/">Accueil</Link>
                        <span className="h-breadcrumb-sep">›</span>
                        <span>Découvrir l'NTIC</span>
                        <span className="h-breadcrumb-sep">›</span>
                        <span>Règlement Intérieur</span>
                    </div>
                </nav>

                <div className="ri-content-grid">
                    {/* Left Sidebar */}
                    <aside className="h-sidebar-sticky">
                        <div className="h-sidebar-card">
                            <h3 className="h-sidebar-title">DÉCOUVRIR ISTA NTIC</h3>
                            <ul className="h-sidebar-list">
                                <li className="h-sidebar-item">
                                    <Link to="/mot-du-directeur">Mot du Directeur</Link>
                                </li>
                                <li className="h-sidebar-item">
                                    <Link to="/presentation-historique">Présentation & Histoire</Link>
                                </li>
                                <li className="h-sidebar-item active">
                                    <Link to="/reglement-interieur">
                                        Règlement Intérieur
                                        <span className="h-sidebar-active-arrow">›</span>
                                    </Link>
                                </li>
                                <li className="h-sidebar-item">
                                    <Link to="/nos-partenaires">Nos Partenaires</Link>
                                </li>
                            </ul>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="ri-main-content">
                        {/* Download Section */}
                        <div className="ri-download-banner">
                            <div className="ri-download-info">
                                <h3>Télécharger le document complet</h3>
                                <p>Consultez la version officielle du règlement intérieur des EFP de l'OFPPT.</p>
                            </div>
                            <a href={pdfFile} download className="ri-download-btn">
                                <span className="ri-btn-icon">{ICONS.download}</span>
                                Télécharger le PDF
                            </a>
                        </div>

                        <div className="ri-rules-grid">
                            {rules.map(rule => (
                                <div key={rule.id} className="ri-rule-card">
                                    <div className="ri-rule-header">
                                        <span className="ri-rule-icon">{rule.icon}</span>
                                        <span className="ri-rule-number">#0{rule.id}</span>
                                    </div>
                                    <h3 className="ri-rule-title">{rule.title}</h3>
                                    <p className="ri-rule-text">{rule.content}</p>
                                </div>
                            ))}
                        </div>

                        <div className="ri-conclusion-box">
                            <h3 className="ri-conclusion-title">
                                <span className="ri-conclusion-icon">{ICONS.target}</span>
                                Conclusion
                            </h3>
                            <div className="ri-conclusion-steps">
                                <div className="ri-step">Respecter les règles</div>
                                <div className="ri-step">Être sérieux</div>
                                <div className="ri-step">Être présent</div>
                                <div className="ri-step">Travailler dur</div>
                            </div>
                        </div>
                    </main>

                    {/* Right Sidebar */}
                    <aside className="ri-sidebar-right">
                        <div className="ri-card ri-contact-card">
                            <h3 className="ri-card-title">Des questions ?</h3>
                            <form className="ri-contact-form" onSubmit={(e) => e.preventDefault()}>
                                <div className="ri-input-group">
                                    <label>Nom</label>
                                    <input type="text" placeholder="Votre nom" />
                                </div>
                                <div className="ri-input-group">
                                    <label>Email</label>
                                    <input type="email" placeholder="Votre email" />
                                </div>
                                <div className="ri-input-group">
                                    <label>Message</label>
                                    <textarea rows="3" placeholder="Posez votre question ici..."></textarea>
                                </div>
                                <button type="submit" className="ri-btn-submit">Envoyer</button>
                            </form>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
};


export default ReglementInterieur;