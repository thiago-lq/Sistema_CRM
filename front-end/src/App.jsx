import { BrowserRouter, Route, Routes } from 'react-router-dom';
import PaginaInicial from './pages/PaginaInicial';
import Login from './components/Login'
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/PaginaInicial" element={<PaginaInicial />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;

