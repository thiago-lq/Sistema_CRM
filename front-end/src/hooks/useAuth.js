import { useContext } from 'react';
import AuthContext from '../contexts/AuthContext';

// Hook SIMPLES - só pega o contexto
export default function useAuth() {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  
  return context;
}