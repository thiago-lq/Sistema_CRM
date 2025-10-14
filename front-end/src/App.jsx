import { BrowserRouter, Route, Routes } from 'react-router-dom';
import PaginaInicial from './pages/PaginaInicial';
import Login from './components/Login'
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Página de login */}
        <Route path="/" element={<Login />} />
        {/* Página com as seções (depois do login) */}
        <Route path="/PaginaInicial" element={<PaginaInicial />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

// OBS: Crie LoginPage.jsx (abaixo explico como)
