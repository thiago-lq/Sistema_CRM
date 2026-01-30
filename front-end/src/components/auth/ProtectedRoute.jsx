import { Navigate, Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '../../services/supabase';

export default function ProtectedRoute() {
  const [allowed, setAllowed] = useState(null); // null = carregando

  useEffect(() => {
    const check = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setAllowed(!!session);
    };

    check();
  }, []);

  if (allowed === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Carregando autenticação...</div>
      </div>
    );
  }

  if (!allowed) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
