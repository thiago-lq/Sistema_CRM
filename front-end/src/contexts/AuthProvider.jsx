import { useEffect, useState } from 'react';
import { supabase } from '../services/supabase';
import api from '../services/api';
import { AuthContext } from './AuthContext';

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (session?.access_token) {
      api.defaults.headers.common.Authorization =
        `Bearer ${session.access_token}`;
    } else {
      delete api.defaults.headers.common.Authorization;
    }
  }, [session]);

  return (
    <AuthContext.Provider
      value={{
        session,
        user: session?.user ?? null,
        isAuthenticated: !!session,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
