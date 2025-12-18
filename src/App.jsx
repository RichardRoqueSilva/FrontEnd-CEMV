import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Footer from './components/Footer'
import Louvores from './pages/Louvores'
import Biblia from './pages/Biblia'
import Contato from './pages/Contato' 
import Cultos from './pages/Cultos'
import Contribuicao from './pages/Contribuicao' 
import Login from './pages/auth/Login'       
import Cadastro from './pages/auth/Cadastro'
import GerenciarUsuarios from './pages/admin/GerenciarUsuarios' 
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <div className="container">
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/" element={<Home />} />
          <Route path="/admin/usuarios" element={<GerenciarUsuarios />} />
          <Route path="/louvores" element={<Louvores />} />    
          <Route path="/biblia" element={<Biblia />} />
          <Route path="/cultos" element={<Cultos />} />
          <Route path="/contato" element={<Contato />} />
          <Route path="/contribuicao" element={<Contribuicao />} />
        </Routes>
        <Footer /> 
      </div>
    </BrowserRouter>
  )
}

export default App