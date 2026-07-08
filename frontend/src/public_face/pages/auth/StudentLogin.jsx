import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { Mail, Lock, LogIn, ChevronLeft, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../../admin/context/AuthContext';
import { extractApiError } from '../../../admin/api/http';
import logo from '../../assets/images/logo-ofppt.png';

export default function StudentLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
      await login(email, password, 'etudiant');
      toast.success('Bienvenue dans votre espace étudiant');
      navigate('/student');
    } catch (err) {
      const apiError = extractApiError(err);
      setError(apiError || 'Identifiants invalides');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4 selection:bg-indigo-100 selection:text-indigo-900">
      <div className="max-w-[450px] w-full space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-6">
          <Link to="/" className="inline-block transition-transform hover:scale-105 active:scale-95">
            <div className="w-16 h-16 bg-white rounded-3xl shadow-xl shadow-slate-200 border border-slate-100 flex items-center justify-center mx-auto">
              <img src={logo} alt="OFPPT" className="w-10 h-10 object-contain" />
            </div>
          </Link>
          <div className="space-y-2">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Espace Étudiant</h1>
            <p className="text-slate-500 font-medium">Accédez à votre plateforme de formation</p>
          </div>
        </div>

        {/* Login Card */}
        <div className="bg-white p-8 lg:p-10 rounded-[2.5rem] shadow-2xl shadow-slate-200 border border-slate-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
          
          <form onSubmit={onSubmit} className="space-y-6 relative z-10">
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-rose-50 border border-rose-100 p-4 rounded-2xl flex items-center gap-3 text-rose-600 text-sm font-bold shadow-sm"
              >
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm">
                  <ShieldCheck size={18} />
                </div>
                {error}
              </motion.div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Email Académique</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                  <Mail size={18} />
                </div>
                <input 
                  type="email" 
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl text-sm font-bold text-slate-900 focus:bg-white focus:border-indigo-500/20 focus:ring-4 focus:ring-indigo-500/5 outline-none transition-all placeholder:text-slate-400"
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  placeholder="votre.nom@ofppt-edu.ma"
                  required 
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between ml-1">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Mot de passe</label>
                <a href="#" onClick={(e) => {e.preventDefault(); toast.info("Contactez votre administration")}} className="text-[10px] font-black text-indigo-500 uppercase hover:text-indigo-600 transition-colors">Oublié ?</a>
              </div>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                  <Lock size={18} />
                </div>
                <input 
                  type="password" 
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl text-sm font-bold text-slate-900 focus:bg-white focus:border-indigo-500/20 focus:ring-4 focus:ring-indigo-500/5 outline-none transition-all placeholder:text-slate-400"
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  placeholder="••••••••"
                  required 
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 text-white rounded-2xl font-black text-sm uppercase tracking-[0.15em] shadow-xl shadow-indigo-100 hover:shadow-indigo-200 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Se connecter</span>
                  <LogIn size={18} />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center">
          <Link to="/choix-compte" className="inline-flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors group">
            <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Retour au portail
          </Link>
        </div>
      </div>
    </div>
  );
}

