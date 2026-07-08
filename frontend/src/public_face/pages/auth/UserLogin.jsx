import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../../admin/context/AuthContext';
import { extractApiError } from '../../../admin/api/http';
import './Login.css';

export default function UserLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [role, setRole]         = useState('etudiant'); // 'etudiant' | 'formateur'
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    try {
      setLoading(true);
      await login(email, password, role);
      toast.success(
        role === 'etudiant'
          ? 'Connecté en tant qu\'étudiant'
          : 'Connecté en tant que formateur'
      );
      navigate(role === 'etudiant' ? '/student' : '/formateur');
    } catch (err) {
      const apiError = extractApiError(err);
      setError(apiError || 'Email ou mot de passe incorrect.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-container">
      <div className={`auth-card ${role}`}>

        {/* ── Role tab switcher ── */}
        <div className="auth-role-tabs">
          <button
            type="button"
            className={`auth-role-tab ${role === 'etudiant' ? 'active' : ''}`}
            onClick={() => { setRole('etudiant'); setError(''); }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
              <path d="M6 12v5c3 3 9 3 12 0v-5"/>
            </svg>
            Étudiant
          </button>
          <button
            type="button"
            className={`auth-role-tab ${role === 'formateur' ? 'active' : ''}`}
            onClick={() => { setRole('formateur'); setError(''); }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="3" width="20" height="14" rx="2"/>
              <path d="M8 21h8M12 17v4"/>
            </svg>
            Formateur
          </button>
        </div>

        {/* ── Header ── */}
        <div className="auth-header">
          <h2>
            {role === 'etudiant' ? 'Espace Étudiant' : 'Espace Formateur'}
          </h2>
          <p>
            {role === 'etudiant'
              ? 'Consultez vos notes et votre emploi du temps'
              : 'Gérez vos classes et vos étudiants'}
          </p>
        </div>

        {/* ── Error ── */}
        {error && (
          <div className="auth-error">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* ── Form ── */}
        <form onSubmit={onSubmit}>
          <div className="auth-form-group">
            <label htmlFor="email">Adresse email</label>
            <input
              id="email"
              type="email"
              className="auth-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre.email@example.com"
              autoComplete="email"
              required
            />
          </div>

          <div className="auth-form-group">
            <label htmlFor="password">Mot de passe</label>
            <input
              id="password"
              type="password"
              className="auth-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              required
            />
          </div>

          <div className="auth-options">
            <label className="auth-checkbox-label">
              <input
                type="checkbox"
                className="auth-checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              Se souvenir de moi
            </label>
            <a
              href="#"
              className="auth-forgot-link"
              onClick={(e) => { e.preventDefault(); toast.info("Contactez l'administration pour réinitialiser votre mot de passe."); }}
            >
              Mot de passe oublié ?
            </a>
          </div>

          <button type="submit" className="auth-submit-btn" disabled={loading}>
            {loading ? (
              <>
                <svg className="animate-spin" width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
                Connexion en cours...
              </>
            ) : 'Se connecter'}
          </button>
        </form>

        <Link to="/choix-compte" className="auth-back-link">
          ← Retour au choix du compte
        </Link>
      </div>
    </div>
  );
}
