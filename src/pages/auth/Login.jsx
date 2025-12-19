import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { preCarregarLeituraDiaria } from '../../utils/bibliaPreloader' // <--- IMPORTANTE
import '../../App.css'

function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  
  const [form, setForm] = useState({ email: '', senha: '' })
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    // Tenta realizar o login no Backend
    const sucesso = await login(form.email, form.senha)
    
    if (sucesso) {
        // --- PERFORMANCE: DISPARAR PRÉ-LOAD ---
        // Não usamos 'await' aqui. Deixamos rodando em paralelo (background)
        // enquanto o usuário é redirecionado imediatamente.
        preCarregarLeituraDiaria()
        
        navigate('/') // Vai para a Home
    } else {
        alert("Email ou senha incorretos!")
    }
    setLoading(false)
  }

  return (
    <div className="main-content">
      <h1 className="page-title">Acesso Restrito</h1>
      
      <form className="form-box" onSubmit={handleLogin}>
        <label>Email:</label>
        <input 
            type="email" 
            required 
            onChange={e => setForm({...form, email: e.target.value})} 
            placeholder="seu@email.com"
        />
        
        <label>Senha:</label>
        <input 
            type="password" 
            required 
            onChange={e => setForm({...form, senha: e.target.value})} 
        />

        <button 
            type="submit" 
            className="btn-primary" 
            style={{width:'100%', marginTop:'20px'}} 
            disabled={loading}
        >
            {loading ? 'Entrando...' : 'Entrar'}
        </button>
        
        <p style={{textAlign:'center', marginTop:'15px'}}>
            Ainda não tem conta? <a href="/cadastro" style={{color:'#a82626', fontWeight:'bold'}}>Cadastre-se</a>
        </p>
      </form>
    </div>
  )
}

export default Login