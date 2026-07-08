import React, { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FILIERES } from '../components/filiere/Filliere';
import { FILLIERES_DETAILS } from '../data/fillieres';
import '../assets/css/FilliereDetail.css';

/* ============================================================
   SVG Icons — stroke-based, 16×16 viewport
   ============================================================ */
const ICONS = {
  // Filière 1 — Développement Digital
  // "Développer des sites web statique" → HTML5/CSS3/Bootstrap → balises < >
  frontend: (
    <svg viewBox="0 0 24 24">
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  ),

  // "Développer des sites web dynamique" → PHP/Python → écran + script
  backend: (
    <svg viewBox="0 0 24 24">
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <line x1="8" y1="21" x2="16" y2="21" />
      <line x1="12" y1="17" x2="12" y2="21" />
      <path d="M7 8h1l1 3 1-4 1 4 1-3h1" />
    </svg>
  ),

  // "Manipuler des bases de données" → MySQL → cylindre DB
  database: (
    <svg viewBox="0 0 24 24">
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5" />
      <path d="M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3" />
    </svg>
  ),

  // "Programmer en JavaScript" → accolades { } avec slash
  projects: (
    <svg viewBox="0 0 24 24">
      <path d="M7 8l-4 4 4 4" />
      <path d="M17 8l4 4-4 4" />
      <line x1="14" y1="4" x2="10" y2="20" />
    </svg>
  ),

  // Filière 3 — Web Full Stack
  // "Approche agile" → Git/Scrum → graphe de branches git
  architecture: (
    <svg viewBox="0 0 24 24">
      <circle cx="6" cy="18" r="2" />
      <circle cx="6" cy="6" r="2" />
      <circle cx="18" cy="6" r="2" />
      <line x1="6" y1="8" x2="6" y2="16" />
      <path d="M6 8a6 6 0 0 1 6 6h4" />
      <circle cx="18" cy="14" r="2" />
    </svg>
  ),

  // "Développement front-end" → React.js → atome React
  frameworks: (
    <svg viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="2" />
      <ellipse cx="12" cy="12" rx="10" ry="3.5" />
      <ellipse cx="12" cy="12" rx="10" ry="3.5" transform="rotate(60 12 12)" />
      <ellipse cx="12" cy="12" rx="10" ry="3.5" transform="rotate(120 12 12)" />
    </svg>
  ),

  // "Développement back-end" → Node.js/Laravel → serveur avec flèches API
  devops: (
    <svg viewBox="0 0 24 24">
      <rect x="2" y="2" width="20" height="8" rx="2" />
      <rect x="2" y="14" width="20" height="8" rx="2" />
      <line x1="6" y1="6" x2="6.01" y2="6" />
      <line x1="6" y1="18" x2="6.01" y2="18" />
      <line x1="10" y1="6" x2="14" y2="6" />
      <line x1="10" y1="18" x2="14" y2="18" />
    </svg>
  ),

  // "Application Cloud native" → Docker/K8s/AWS → nuage avec flèche deploy
  mobile: (
    <svg viewBox="0 0 24 24">
      <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
      <polyline points="16 12 12 8 8 12" />
      <line x1="12" y1="8" x2="12" y2="16" />
    </svg>
  ),

  // Filière 2 — Applications Mobiles
  // "Android" → Kotlin/Jetpack → logo android stylisé
  android: (
    <svg viewBox="0 0 24 24">
      <path d="M6 18V9a6 6 0 0 1 12 0v9a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1z" />
      <circle cx="9" cy="14" r="1" fill="currentColor" stroke="none" />
      <circle cx="15" cy="14" r="1" fill="currentColor" stroke="none" />
      <line x1="8.5" y1="6.5" x2="6" y2="4" />
      <line x1="15.5" y1="6.5" x2="18" y2="4" />
    </svg>
  ),

  // "iOS" → Swift/SwiftUI → iPhone avec barre notch
  ios: (
    <svg viewBox="0 0 24 24">
      <rect x="5" y="2" width="14" height="20" rx="3" />
      <path d="M10 5h4" />
      <circle cx="12" cy="18" r="1" fill="currentColor" stroke="none" />
    </svg>
  ),

  // "Multiplateforme" → React Native/Flutter → deux appareils liés
  crossplatform: (
    <svg viewBox="0 0 24 24">
      <rect x="2" y="8" width="7" height="12" rx="1.5" />
      <rect x="15" y="4" width="7" height="12" rx="1.5" />
      <path d="M9 14h6" strokeDasharray="2 1.5" />
      <polyline points="11 12 9 14 11 16" />
    </svg>
  ),

  // "UI/UX Mobile" → Figma/Design → plume + grille
  design: (
    <svg viewBox="0 0 24 24">
      <path d="M12 19l7-7 3 3-7 7-3-3z" />
      <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
      <path d="M2 2l11 11" />
      <circle cx="11" cy="11" r="2" />
    </svg>
  ),

  // Filière 4 — Infrastructure Digitale
  // "Réseaux" → Cisco/Routing → nœuds réseau avec liens
  network: (
    <svg viewBox="0 0 24 24">
      <rect x="10" y="2" width="4" height="4" rx="1" />
      <rect x="2" y="17" width="4" height="4" rx="1" />
      <rect x="18" y="17" width="4" height="4" rx="1" />
      <line x1="12" y1="6" x2="12" y2="11" />
      <line x1="12" y1="11" x2="4" y2="19" />
      <line x1="12" y1="11" x2="20" y2="19" />
    </svg>
  ),

  // "Systèmes" → Windows Server/Linux → terminal ligne de commande
  systems: (
    <svg viewBox="0 0 24 24">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <polyline points="6 9 9 12 6 15" />
      <line x1="13" y1="15" x2="18" y2="15" />
    </svg>
  ),

  // "Sécurité" → Firewall/VPN → bouclier avec verrou
  security: (
    <svg viewBox="0 0 24 24">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <rect x="9" y="11" width="6" height="5" rx="1" />
      <path d="M10 11V9a2 2 0 1 1 4 0v2" />
    </svg>
  ),

  // "Cloud Basics" → Virtualisation/Cloud → nuage avec éclair
  cloud: (
    <svg viewBox="0 0 24 24">
      <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
      <polyline points="13 11 11 15 14 15 12 19" />
    </svg>
  ),

  default: (
    <svg viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  ),
};

const Icon = ({ name }) => (
  <span className="fd-icon-wrapper">
    {ICONS[name] || ICONS.default}
  </span>
);

/* Code SVG icon for section header */
const CodeIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
  </svg>
);

/* Map pin SVG */
const MapPinIcon = () => (
  <svg viewBox="0 0 24 24">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

export default function FilliereDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const details = FILLIERES_DETAILS[id];
  const knownFiliere = FILIERES.find((f) => String(f.id) === String(id));
  const filiere = knownFiliere || details;

  useEffect(() => { window.scrollTo(0, 0); }, [id]);

  if (!details) {
    return (
      <div className="fd-page-error">
        <div className="fd-error-container">
          <span className="fd-error-emoji">🔍</span>
          <h2>Filière introuvable</h2>
          <p>L'identifiant fourni ne correspond à aucune filière connue.</p>
          <button className="fd-btn-primary" onClick={() => navigate('/')}>Retour à l'accueil</button>
        </div>
      </div>
    );
  }

  return (
    <div className="fd-page-wrapper">

      {/* ── Hero ─────────────────────────────────────────── */}
      <header className="h-hero-section">
        <div className="h-hero-container">
          <div className="h-hero-tag">NOS FORMATIONS</div>
          <h1 className="h-hero-title">{details.titre}</h1>
          <p className="h-hero-subtitle">{details.description}</p>
        </div>
      </header>

      {/* ── Breadcrumb ───────────────────────────────────── */}
      <nav className="h-breadcrumb-section">
        <div className="h-breadcrumb-container">
          <Link to="/">Accueil</Link> <span className="h-breadcrumb-sep">›</span> <Link to="/">NOS FORMATIONS</Link> <span className="h-breadcrumb-sep">›</span> <span>{details.titre}</span>
        </div>
      </nav>

      {/* ── 3-column grid ────────────────────────────────── */}
      <div className="fd-content-grid fd-container">

        {/* Left sidebar */}
        <aside className="h-sidebar-sticky">
          <div className="h-sidebar-card">
            <h3 className="h-sidebar-title">NOS FORMATIONS</h3>
            <ul className="h-sidebar-list">
              {Object.values(FILLIERES_DETAILS).map((f) => (
                <li key={f.id} className={`h-sidebar-item ${String(f.id) === String(id) ? 'active' : ''}`}>
                  <Link to={`/filiere/${f.id}`}>
                    {f.titre}
                    {String(f.id) === String(id) && <span className="h-sidebar-active-arrow">›</span>}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Main content */}
        <main className="fd-main-article">

          {/* Banner */}
          <div className="fd-article-banner" style={{ backgroundImage: `url(${filiere.image})` }}>
            <div className="fd-banner-overlay">
              <h2 className="fd-banner-title">{details.titre}</h2>
              <p className="fd-banner-subtitle">Excellence en formation technique</p>
            </div>
          </div>

          {/* Objectifs */}
          <section className="fd-section">
            <h3 className="fd-section-header">Objectifs de la formation</h3>
            <p className="fd-text-content">{details.objectifs}</p>
          </section>

          {/* Profil de sortie */}
          {details.conditions.profil_sortie && (
            <section className="fd-section">
              <h3 className="fd-section-header">Profil de Formation</h3>
              <p className="fd-text-content" style={{ marginBottom: 14 }}>
                À l'issue de la formation, le stagiaire sera capable de :
              </p>
              <div className="fd-debouches-list">
                {details.conditions.profil_sortie.map((p, idx) => (
                  <div key={idx} className="fd-debouche-item">
                    <span className="fd-dot" /><span>{p}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Modules */}
          <section className="fd-section">
            <h3 className="fd-section-header">
              <span className="fd-header-icon"><CodeIcon /></span>
              Modules Principaux
            </h3>
            <div className="fd-modules-grid">
              {details.modules.map((m, idx) => (
                <div key={idx} className="fd-module-card">
                  <div className="fd-module-top">
                    <Icon name={m.icon} />
                    <h4>{m.name}</h4>
                  </div>
                  <p>{m.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Organisation + Évaluation */}
          <div className="fd-dual-section">
            <section className="fd-section">
              <h3 className="fd-section-header">Organisation</h3>
              <ul className="fd-simple-list">
                {details.organisation.map((o, idx) => <li key={idx}>{o}</li>)}
              </ul>
            </section>
            <section className="fd-section">
              <h3 className="fd-section-header">Évaluation</h3>
              <ul className="fd-simple-list">
                {details.evaluation.map((e, idx) => <li key={idx}>{e}</li>)}
              </ul>
            </section>
          </div>

          {/* 2nd year options */}
          {details.options_2eme_annee && (
            <section className="fd-section">
              <h3 className="fd-section-header">Filières en 2ème année</h3>
              <div className="fd-options-grid">
                {details.options_2eme_annee.map((opt, idx) => (
                  <div key={idx} className="fd-option-card">
                    <h4>{opt.name}</h4>
                    <p>{opt.desc}</p>
                    {opt.link !== '#' && <Link to={opt.link} className="fd-read-more">Lire plus ›</Link>}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Débouchés */}
          <section className="fd-section">
            <h3 className="fd-section-header">Débouchés Professionnels</h3>
            <div className="fd-debouches-list">
              {details.debouches.map((d, idx) => (
                <div key={idx} className="fd-debouche-item">
                  <span className="fd-dot" /><span>{d}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Admission */}
          <section className="fd-admission-card">
            <h3 className="fd-admission-title">Conditions d'accès et Sélection</h3>
            <div className="fd-admission-content">
              <div className="fd-admission-left">
                {details.conditions.admission.lien_tronc_commun ? (
                  <div className="fd-tc-info">
                    <h4>Pré-requis</h4>
                    <p>{details.conditions.admission.details}</p>
                    <Link to={details.conditions.admission.lien_tronc_commun} className="fd-link-accent">
                      Découvrir le Tronc Commun ›
                    </Link>
                  </div>
                ) : (
                  <>
                    {details.conditions.admission.age && (
                      <div className="fd-admission-subgroup">
                        <h4>Critères d'âge</h4>
                        <ul className="fd-criteria-list">
                          {details.conditions.admission.age.map((a, idx) => <li key={idx}>• {a}</li>)}
                        </ul>
                      </div>
                    )}
                    {details.conditions.admission.niveau && (
                      <div className="fd-admission-subgroup">
                        <h4>Niveau Scolaire</h4>
                        <ul className="fd-criteria-list">
                          {details.conditions.admission.niveau.map((n, idx) => <li key={idx}>• {n}</li>)}
                          {details.conditions.admission.branches?.map((b, idx) => (
                            <li key={idx}>• Baccalauréat {b}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </>
                )}
                {details.conditions.admission.aptitudes && (
                  <div className="fd-admission-subgroup">
                    <h4>Aptitudes et Qualités</h4>
                    <ul className="fd-criteria-list">
                      {details.conditions.admission.aptitudes.map((a, idx) => <li key={idx}>• {a}</li>)}
                    </ul>
                  </div>
                )}
              </div>

              <div className="fd-admission-right">
                {details.conditions.selection.modalites && (
                  <div className="fd-admission-subgroup">
                    <h4>Modalités de sélection</h4>
                    <ul className="fd-criteria-list">
                      {details.conditions.selection.modalites.map((m, idx) => (
                        <li key={idx} className={idx > 1 ? 'fd-li-indent' : ''}>{m}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {details.conditions.selection.profils && (
                  <div className="fd-admission-subgroup">
                    <h4>Profil des étudiants admis</h4>
                    <div className="fd-profiles-grid">
                      {details.conditions.selection.profils.map((p, idx) => (
                        <div key={idx} className="fd-profile-bar-item">
                          <div className="fd-bar-labels">
                            <span>{p.label}</span>
                            <span>{p.value}%</span>
                          </div>
                          <div className="fd-bar-container">
                            <div className="fd-bar-fill" style={{ width: `${p.value}%`, backgroundColor: p.color }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        </main>

        {/* Right sidebar — contact */}
        <aside className="fd-sidebar-right">
          <div className="fd-contact-card">
            <div className="fd-contact-header">
              <h3>CONTACTEZ-NOUS</h3>
              <p>Une question ? Nous sommes là pour vous.</p>
            </div>
            <form className="fd-contact-form" onSubmit={(e) => e.preventDefault()}>
              <div className="fd-form-row">
                <div className="fd-input-group">
                  <label>Nom</label>
                  <input type="text" placeholder="Nom" />
                </div>
                <div className="fd-input-group">
                  <label>Prénom</label>
                  <input type="text" placeholder="Prénom" />
                </div>
              </div>
              <div className="fd-input-group">
                <label>Email</label>
                <input type="email" placeholder="exemple@email.com" />
              </div>
              <div className="fd-input-group">
                <label>Téléphone</label>
                <input type="tel" placeholder="+212 6 00 00 00 00" />
              </div>
              <div className="fd-input-group">
                <label>Sujet</label>
                <select defaultValue="Information Générale">
                  <option>Information Générale</option>
                  <option>Admission</option>
                  <option>Autre</option>
                </select>
              </div>
              <div className="fd-input-group">
                <label>Ville</label>
                <input type="text" placeholder="Votre ville" />
              </div>
              <button type="submit" className="fd-submit-btn">ENVOYER LE MESSAGE</button>
            </form>
          </div>
        </aside>
      </div>

      {/* ── Campus Section ───────────────────────────────── */}
      <section className="fd-campus-section">
        <div className="fd-campus-inner">

          {/* Left — contact info */}



        </div>
      </section>
    </div>
  );
}