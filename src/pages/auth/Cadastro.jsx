import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2' // <--- 1. IMPORTAR AQUI
import '../../App.css'

function Cadastro() {
  const [form, setForm] = useState({ 
    nome: '', 
    email: '', 
    senha: '', 
    role: 'MEMBER' 
  })
  
  const [carregando, setCarregando] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm({
        ...form,
        [e.target.name]: e.target.value
    })
  }

  const handleCadastro = async (e) => {
    e.preventDefault()
    setCarregando(true)
    
    try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080'
        
        const response = await fetch(`${apiUrl}/api/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form)
        })

        if (response.ok) {
            // --- 2. ALERTA DE SUCESSO PERSONALIZADO ---
            Swal.fire({
                icon: 'success',
                title: 'Conta Criada!',
                text: 'Seu cadastro foi realizado com sucesso.',
                confirmButtonColor: '#2b0505', // Vinho
                iconColor: '#27ae60', // Verde
                confirmButtonText: 'Ir para Login'
            }).then((result) => {
                // Só navega depois que a pessoa clicar no OK
                if (result.isConfirmed) {
                    navigate('/login')
                }
            })

        } else {
            const erroMsg = await response.text()
            
            // --- 3. ALERTA DE ERRO PERSONALIZADO ---
            Swal.fire({
                icon: 'error',
                title: 'Erro ao Cadastrar',
                text: erroMsg || 'Verifique os dados e tente novamente.',
                confirmButtonColor: '#a82626' // Vermelho
            })
        }
    } catch (error) {
        console.error(error)
        Swal.fire({
            icon: 'error',
            title: 'Erro de Conexão',
            text: 'Não foi possível conectar ao servidor.',
            confirmButtonColor: '#a82626'
        })
    } finally {
        setCarregando(false)
    }
  }

  return (
    <div className="main-content">
      <h1 className="page-title">Criar Conta</h1>
      
      <form className="form-box" onSubmit={handleCadastro}>
        
        <label>Nome Completo:</label>
        <input 
            type="text" 
            name="nome"
            value={form.nome}
            onChange={handleChange}
            placeholder="Ex: João da Silva"
            required 
        />

        <label>Email:</label>
        <input 
            type="email" 
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="seu@email.com"
            required 
        />
        
        <label>Senha:</label>
        <input 
            type="password" 
            name="senha"
            value={form.senha}
            onChange={handleChange}
            required 
        />
        
        {/* O usuário entra como MEMBER por padrão, sem precisar escolher */}

        <button type="submit" className="btn-save" disabled={carregando}>
            {carregando ? 'Cadastrando...' : 'Cadastrar'}
        </button>

        <p style={{textAlign:'center', marginTop:'15px'}}>
            Já tem uma conta? <a href="/login" style={{color:'#a82626', fontWeight:'bold'}}>Fazer Login</a>
        </p>
      </form>
    </div>
  )
}

export default Cadastro