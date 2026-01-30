import { Navigate, Outlet } from 'react-router-dom';
import  useAuth  from '../../hooks/useAuth';

export default function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Carregando autenticação...</div>
      </div>
    );
  }

  // 🔴 SE NÃO ESTIVER AUTENTICADO, REDIRECIONA PARA LOGIN
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // 🟢 SE AUTENTICADO, PERMITE ACESSAR
  return <Outlet />;
}