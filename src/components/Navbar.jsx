import { useState } from 'react'
import { Link } from 'react-router-dom'
import '../App.css'
// Importando a imagem da pasta assets
import logoImg from '../assets/img/logo-teste2.jpeg' 

function Navbar() {
  const [menuAberto, setMenuAberto] = useState(false)

  return (
    <header className="header">
      <div className="logo-container">
        {/* Imagem do Logo */}
        <img src={logoImg} alt="Logo CEMV" className="navbar-logo" />
        <div className="logo-text">CEMV</div>
      </div>
      
      <button 
        className="menu-btn" 
        onClick={() => setMenuAberto(!menuAberto)}
      >
        ☰
      </button>

      <nav className={`nav ${menuAberto ? 'ativo' : ''}`}>
        <Link to="/" onClick={() => setMenuAberto(false)}>Início</Link>
        <Link to="/biblia" onClick={() => setMenuAberto(false)}>Bíblia</Link>
        <Link to="/cultos" onClick={() => setMenuAberto(false)}>Cultos</Link>
        <Link to="/louvores" onClick={() => setMenuAberto(false)}>Louvores</Link>
        <Link to="/contribuicao" onClick={() => setMenuAberto(false)}>Contribuição</Link>
        <Link to="/contato" onClick={() => setMenuAberto(false)}>Contato</Link>
      </nav>
    </header>
  )
}

export default Navbar