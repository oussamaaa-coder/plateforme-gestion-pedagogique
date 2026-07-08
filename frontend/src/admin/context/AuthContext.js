import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { me as apiMe, login as apiLogin, logout as apiLogout } from '../api/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        if (!token) {
          if (mounted) {
            setUser(null);
            setLoading(false);
          }
          return;
        }
        const resp = await apiMe();
        if (!mounted) return;
        setUser(resp?.data?.user || null);
      } catch {
        localStorage.removeItem('token');
        if (mounted) setUser(null);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = useMemo(() => ({
    user,
    loading,
    token: localStorage.getItem('token'),
    async login(email, password, expectedRole) {
      const resp = await apiLogin({ email, password, expected_role: expectedRole, device_name: 'react' });
      const t = resp?.data?.token;
      if (t) localStorage.setItem('token', t);
      const respMe = await apiMe();
      const userObj = respMe?.data?.user || null;
      setUser(userObj);
      return { resp, user: userObj };
    },
    async logout() {
      try { await apiLogout(); } catch {}
      localStorage.removeItem('token');
      setUser(null);
    },
    async refreshUser() {
      const respMe = await apiMe();
      const userObj = respMe?.data?.user || null;
      setUser(userObj);
      return userObj;
    },
  }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}

