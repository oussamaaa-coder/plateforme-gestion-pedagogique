import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { extractApiError } from '../api/http';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { user } = await login(email, password);
      toast.success('Connecté.');
      if (user?.role === 'admin') {
        navigate('/admin');
      } else if (user?.role === 'etudiant') {
        navigate('/student');
      } else if (user?.role === 'formateur') {
        navigate('/formateur');
      } else {
        navigate('/'); // fallback
      }
    } catch (err) {
      toast.error(extractApiError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: 420, marginTop: 80 }}>
      <h3 className="mb-4">Connexion</h3>
      <form onSubmit={onSubmit}>
        <div className="form-group mb-3">
          <label>Email</label>
          <input className="form-control" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="form-group mb-3">
          <label>Mot de passe</label>
          <input className="form-control" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button className="btn btn-primary w-100" type="submit" disabled={loading}>
          {loading ? 'Connexion...' : 'Se connecter'}
        </button>
      </form>
      <div className="text-muted mt-3" style={{ fontSize: 12 }}>
        Astuce: connecte-toi avec un utilisateur `admin` existant en base.
      </div>
    </div>
  );
}

