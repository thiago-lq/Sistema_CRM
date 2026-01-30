// App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";

import Login from "./pages/Login";
import PaginaInicial from "./pages/PaginaInicial"; // ← agora é o hub
import Pedidos from "./pages/Pedidos";
import Clientes from "./pages/Clientes";
import Registros from "./pages/Registros";
import Dashboard from "./pages/Dashboard";
import AuthProvider from "./providers/AuthProvider";
import ProtectedRoute from "./components/auth/ProtectedRoute";

import ProtectedLayout from "./routes/ProtectedLayout"; // novo (opcional, veja abaixo)

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster richColors />

        <Routes>
          <Route path="/" element={<Login />} />
          <Route element={<ProtectedRoute />}>
            {/* Rotas logadas – com layout compartilhado (opcional) */}
            <Route element={<ProtectedLayout />}>
              <Route path="/PaginaInicial" element={<PaginaInicial />} />
              <Route path="/Pedidos" element={<Pedidos />} />
              <Route path="/Clientes" element={<Clientes />} />
              <Route path="/Registros" element={<Registros />} />
              <Route path="/Dashboard" element={<Dashboard />} />
              {/* Alternativa: redireciona raiz logada direto pro hub */}
              {/* <Route path="/" element={<PaginaInicial />} /> */}
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
