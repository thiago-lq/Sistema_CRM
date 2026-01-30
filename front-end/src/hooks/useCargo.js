// src/hooks/useCargo.js
import  useAuth  from './useAuth';

export default function useCargo() {
  const { funcionario } = useAuth();
  
  const hasPermission = (requiredLevel) => {
    if (!funcionario?.cargo) return false;
    
    const levels = {
      'operacional': 1,
      'gerencial': 2,
      'executivo': 3
    };
    
    const userLevel = levels[funcionario.cargo.toLowerCase()] || 0;
    const required = levels[requiredLevel.toLowerCase()] || 0;
    
    return userLevel >= required;
  };

  return {
    cargo: funcionario?.cargo,
    nome: funcionario?.nome,
    hasPermission,
    isOperacional: funcionario?.cargo?.toLowerCase() === 'operacional',
    isGerencial: funcionario?.cargo?.toLowerCase() === 'gerencial',
    isExecutivo: funcionario?.cargo?.toLowerCase() === 'executivo'
  };
}