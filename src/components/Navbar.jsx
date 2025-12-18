import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Navbar.css' // Importa o estilo isolado
import logoImg from '../assets/img/logo-teste2.jpeg' // Certifique-se que a imagem existe

function Navbar() {
  const { user, logout } = useAuth()
  const [menuAberto, setMenuAberto] = useState(false)

  // Fecha o menu mobile ao clicar em qualquer link
  const fecharMenu = () => setMenuAberto(false)

  return (
    <header className="header">
      {/* Logo e Nome */}
      <div className="logo-container">
        <img src={logoImg} alt="Logo CEMV" className="navbar-logo" />
        <div className="logo-text">CEMV</div>
      </div>
      
      {/* Botão Hamburger (Mobile) */}
      <button 
        className="menu-btn" 
        onClick={() => setMenuAberto(!menuAberto)}
        aria-label="Menu"
      >
        ☰
      </button>

      {/* Links de Navegação */}
      <nav className={`nav ${menuAberto ? 'ativo' : ''}`}>
        <Link to="/" onClick={fecharMenu}>Início</Link>
        <Link to="/biblia" onClick={fecharMenu}>Bíblia</Link>
        <Link to="/cultos" onClick={fecharMenu}>Cultos</Link>
        <Link to="/louvores" onClick={fecharMenu}>Louvores</Link>
        <Link to="/contribuicao" onClick={fecharMenu}>Contribuição</Link>
        <Link to="/contato" onClick={fecharMenu}>Contato</Link>

        {/* Link de Gestão (APENAS PARA ADMIN) */}
        {user && user.role === 'ADMIN' && (
            <Link 
                to="/admin/usuarios" 
                onClick={fecharMenu} 
                style={{color:'#f1c40f', borderBottom: '1px dashed #f1c40f'}}
            >
                ⚙️ Gestão
            </Link>
        )}

        {/* Área do Usuário */}
        {user ? (
            <div className="user-area">
                <span className="user-name">Olá, {user.nome}</span>
                <button onClick={() => { logout(); fecharMenu(); }} className="btn-logout">
                    Sair
                </button>
            </div>
        ) : (
            <Link to="/login" onClick={fecharMenu} className="link-login">
                Login
            </Link>
        )}
      </nav>
    </header>
  )
}

export default Navbar