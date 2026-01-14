// App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from "sonner";

import Login from './pages/Login';
import PaginaInicial from './pages/PaginaInicial';  // ← agora é o hub
import Pedidos from './pages/Pedidos';
import Clientes from './pages/Clientes';

import ProtectedLayout from './routes/ProtectedLayout';  // novo (opcional, veja abaixo)

function App() {
  return (
    <BrowserRouter>
      <Toaster richColors />

      <Routes>
        <Route path="/" element={<Login />} />

        {/* Rotas logadas – com layout compartilhado (opcional) */}
        <Route element={<ProtectedLayout />}>
          <Route path="/PaginaInicial" element={<PaginaInicial />} />
          <Route path="/Pedidos" element={<Pedidos />} />
          <Route path="/Clientes" element={<Clientes />} />

          {/* Alternativa: redireciona raiz logada direto pro hub */}
          {/* <Route path="/" element={<PaginaInicial />} /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;