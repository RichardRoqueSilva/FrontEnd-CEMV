import React, { useState } from 'react'
import './FormContato.css'

function FormContato() {
  // Estado para armazenar os dados dos campos
  const [dados, setDados] = useState({
    nome: '',
    celular: '',
    cidade: '',
    motivo: ''
  })

  // Estado para controlar se o formulário está visível (Acordeão)
  const [formAberto, setFormAberto] = useState(false)

  // Estado para bloquear o botão enquanto envia
  const [enviando, setEnviando] = useState(false)

  // Atualiza o estado quando o usuário digita
  const handleChange = (e) => {
    setDados({ ...dados, [e.target.name]: e.target.value })
  }

  // Envia os dados para o Backend
  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Validação básica
    if (!dados.nome || !dados.celular) {
      alert("Por favor, preencha Nome e Celular.")
      return
    }

    setEnviando(true) // Bloqueia o botão e muda o texto

    // Chamada para a API Java (Rodando localmente)
    fetch('http://localhost:8080/api/contatos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados)
    })
    .then(res => {
        if(res.ok) {
            alert(`Obrigado, ${dados.nome}! Sua mensagem foi enviada com sucesso.`)
            // Limpa o formulário
            setDados({ nome: '', celular: '', cidade: '', motivo: '' })
            // Fecha o acordeão
            setFormAberto(false)
        } else {
            alert("Ocorreu um erro ao enviar. Tente novamente.")
        }
    })
    .catch(error => {
        console.error("Erro na requisição:", error)
        alert("Erro de conexão com o servidor. Verifique se o backend está rodando.")
    })
    .finally(() => {
        setEnviando(false) // Libera o botão novamente
    })
  }

  return (
    <div className="form-contato-container">
      
      {/* Cabeçalho Clicável (Lógica do Acordeão) */}
      <div 
        className="form-header-accordion" 
        onClick={() => setFormAberto(!formAberto)}
        title={formAberto ? "Clique para fechar" : "Clique para abrir o formulário"}
      >
        <h2 className="titulo-form">✉️ Desejo receber contato</h2>
        {/* A seta gira dependendo se está aberto ou fechado */}
        <span className={`seta-form ${formAberto ? 'aberta' : ''}`}>▼</span>
      </div>
      
      {/* O formulário só é renderizado se formAberto for true */}
      {formAberto && (
        <form onSubmit={handleSubmit} className="form-grid form-animado">
            
            <div className="campo">
                <label>Nome *</label>
                <input 
                    type="text" 
                    name="nome" 
                    value={dados.nome} 
                    onChange={handleChange} 
                    placeholder="Seu nome completo" 
                    required 
                />
            </div>

            <div className="campo">
                <label>Celular *</label>
                <input 
                    type="tel" 
                    name="celular" 
                    value={dados.celular} 
                    onChange={handleChange} 
                    placeholder="(DDD) 99999-9999" 
                    required 
                />
            </div>

            <div className="campo">
                <label>Cidade</label>
                <input 
                    type="text" 
                    name="cidade" 
                    value={dados.cidade} 
                    onChange={handleChange} 
                    placeholder="Ex: Araraquara"
                />
            </div>

            <div className="campo full-width">
                <label>Motivo do contato</label>
                <textarea 
                    name="motivo" 
                    value={dados.motivo} 
                    onChange={handleChange} 
                    rows="3" 
                    placeholder="Pedido de oração, visita, dúvida..."
                ></textarea>
            </div>

            <button type="submit" className="btn-enviar full-width" disabled={enviando}>
                {enviando ? 'Enviando...' : 'Enviar Mensagem'}
            </button>

        </form>
      )}

    </div>
  )
}

export default FormContato