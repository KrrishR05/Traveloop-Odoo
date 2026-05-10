import { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext(null);

const AFK_TIMEOUT_MS = 10 * 60 * 1000; // 10 minutes

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const afkTimerRef = useRef(null);

  // ── AFK Idle Timeout ──────────────────────────────────────────
  const resetAfkTimer = useCallback(() => {
    if (afkTimerRef.current) clearTimeout(afkTimerRef.current);
    if (!authService.getToken()) return;

    afkTimerRef.current = setTimeout(() => {
      // User has been idle for 10 minutes — auto logout
      console.log('[Auth] AFK timeout — logging out');
      logout();
    }, AFK_TIMEOUT_MS);
  }, []);

  // Attach activity listeners when authenticated
  useEffect(() => {
    if (!isAuthenticated) return;

    const events = ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart', 'click'];
    const handler = () => resetAfkTimer();

    events.forEach((e) => window.addEventListener(e, handler, { passive: true }));
    resetAfkTimer(); // Start initial timer

    return () => {
      events.forEach((e) => window.removeEventListener(e, handler));
      if (afkTimerRef.current) clearTimeout(afkTimerRef.current);
    };
  }, [isAuthenticated, resetAfkTimer]);

  // ── Bootstrap: check for existing token on mount ──────────────
  useEffect(() => {
    const token = authService.getToken();
    if (token) {
      // Validate token by fetching profile
      authService.getProfile()
        .then((profileData) => {
          setUser(profileData);
          setIsAuthenticated(true);
        })
        .catch(() => {
          // Token invalid — clear it
          authService.clearToken();
          setUser(null);
          setIsAuthenticated(false);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  // ── Auth methods ──────────────────────────────────────────────

  const login = async (email, password) => {
    const res = await authService.login(email, password);
    setUser(res.user);
    setIsAuthenticated(true);
    return res;
  };

  const register = async (data) => {
    const res = await authService.register(data);
    setUser(res.user);
    setIsAuthenticated(true);
    return res;
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
    setIsAuthenticated(false);
    if (afkTimerRef.current) clearTimeout(afkTimerRef.current);
    // Redirect to login
    window.location.href = '/login';
  };

  const updateProfile = async (data) => {
    const res = await authService.updateProfile(data);
    setUser(res.user);
    return res;
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export default AuthContext;
