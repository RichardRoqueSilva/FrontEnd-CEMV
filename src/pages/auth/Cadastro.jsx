import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../../App.css' // Usa os estilos globais de formulário (.form-box)

function Cadastro() {
  // Define o role fixo como MEMBER
  const [form, setForm] = useState({ 
    nome: '', 
    email: '', 
    senha: '', 
    role: 'MEMBER' 
  })
  
  const [carregando, setCarregando] = useState(false)
  const navigate = useNavigate()

  // Função para atualizar o estado conforme digita
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
        // Usa variável de ambiente ou localhost por padrão
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080'
        
        const response = await fetch(`${apiUrl}/api/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form)
        })

        if (response.ok) {
            alert("Usuário cadastrado com sucesso!")
            navigate('/login') // Redireciona para o login
        } else {
            // Tenta pegar a mensagem de erro do backend
            const erroMsg = await response.text()
            alert(`Erro ao cadastrar: ${erroMsg || 'Verifique os dados.'}`)
        }
    } catch (error) {
        console.error(error)
        alert("Erro de conexão com o servidor.")
    } finally {
        setCarregando(false)
    }
  }

   return (
    <div className="main-content">
      <h1 className="page-title">Criar Conta</h1>
      
      <form className="form-box" onSubmit={handleCadastro}>
        
        <label>Nome Completo:</label>
        <input type="text" name="nome" value={form.nome} onChange={handleChange} placeholder="Ex: João da Silva" required />

        <label>Email:</label>
        <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="seu@email.com" required />
        
        <label>Senha:</label>
        <input type="password" name="senha" value={form.senha} onChange={handleChange} required />
        
        {/* REMOVIDO O SELECT DE TIPO DE ACESSO */}
        {/* O usuário não vê, mas o estado 'form.role' já é 'MEMBER' */}

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