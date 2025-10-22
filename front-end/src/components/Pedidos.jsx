// Pedidos.jsx (Antigo GerenciadorPedidosComTabs.jsx)
import { useState } from 'react';
import ListaPedidos from './ListaPedidos';
import FormularioCadastro from './FormularioCadastro';

export default function Pedidos() {
  const [abaAtiva, setAbaAtiva] = useState('lista'); 

  const renderConteudo = () => {
    switch (abaAtiva) {
      case 'lista':
        return <ListaPedidos />;
      case 'cadastro':
        return <FormularioCadastro />;
      default:
        return <ListaPedidos />;
    }
  };

  const tabClasses = (tabName) => 
    `py-2 px-4 text-center cursor-pointer font-medium transition-colors duration-200 
    ${abaAtiva === tabName 
        ? 'border-b-4 border-indigo-600 text-indigo-700 bg-white' 
        : 'border-b-2 border-gray-300 text-gray-500 hover:text-indigo-600 hover:bg-gray-50' // Otimizei hover:bg-white-50 para hover:bg-gray-50
    }`;

  return (
    // Otimização: A div externa está responsável pelo fundo e margem
    <div className="p-10 m-6 bg-white rounded-xl shadow-[0_4px_30px_rgba(0,0,0,0.15)] max-w-full mx-auto mt-30">
      
      {/* LINHA CHAVE (1): Altere a classe max-w-lg (que limita a largura total do conteúdo) para um valor maior como max-w-3xl, max-w-4xl, ou até max-w-full se quiser que ele use toda a largura disponível.
      */}
      <div className="max-w-2/3 mx-auto bg-white rounded-xl shadow-[0_4px_30px_rgba(0,0,0,0.1)]">
        
        <h1 className="text-3xl font-extrabold p-4 text-center text-gray-800">
          Gerenciamento de Pedidos
        </h1>

        {/* CONTROLES DE ABAS */}
        <div className="flex border-b border-gray-200 ">
          <div 
            className={tabClasses('lista')} 
            onClick={() => setAbaAtiva('lista')}
            style={{ flex: 1 }}
          >
            Pedidos Cadastrados
          </div>
          <div 
            className={tabClasses('cadastro')} 
            onClick={() => setAbaAtiva('cadastro')}
            style={{ flex: 1 }}
          >
            Cadastrar Novo
          </div>
        </div>

        {/* CONTEÚDO DA ABA ATIVA */}
        <div className="p-4">
          {renderConteudo()}
        </div>
        
      </div>
    </div>
  );
}