import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../../admin/context/AuthContext';
import { extractApiError } from '../../../admin/api/http';
import './Login.css';

export default function FormateurLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    try {
      setLoading(true);
      // 'formateur' is the expected role
      await login(email, password, 'formateur');
      toast.success('Connecté en tant que formateur');
      navigate('/formateur');
    } catch (err) {
      const apiError = extractApiError(err);
      setError(apiError || 'Une erreur est survenue lors de la connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-container">
      <div className="auth-card formateur">
        <div className="auth-header">
          <h2>Espace Formateur</h2>
          <p>Gérez vos classes et vos étudiants</p>
        </div>

        {error && (
          <div className="auth-error">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={onSubmit}>
          <div className="auth-form-group">
            <label htmlFor="email">Adresse email</label>
            <input 
              id="email"
              type="email" 
              className="auth-input" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="votre.email@ofppt.ma"
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
            <a href="#" className="auth-forgot-link" onClick={(e) => {e.preventDefault(); toast.info("Veuillez contacter l'administration pour réinitialiser le mot de passe.")}}>
              Mot de passe oublié ?
            </a>
          </div>

          <button type="submit" className="auth-submit-btn" disabled={loading}>
            {loading ? (
              <>
                <svg className="animate-spin" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Connexion en cours...
              </>
            ) : "Se connecter"}
          </button>
        </form>

        <Link to="/choix-compte" className="auth-back-link">
          &larr; Retour au choix du compte
        </Link>
      </div>
    </div>
  );
}
