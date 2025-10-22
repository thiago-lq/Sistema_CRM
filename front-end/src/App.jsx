import { BrowserRouter, Route, Routes } from 'react-router-dom';
import PaginaInicial from './pages/PaginaInicial';
import Login from './pages/Login'
import NavBar from './components/NavBar';

function App() {
  return (
    
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route element={<NavBar />} >
        <Route path="/PaginaInicial" element={<PaginaInicial />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
export default App;