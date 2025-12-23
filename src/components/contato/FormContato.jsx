import React, { useState } from 'react'
import Swal from 'sweetalert2' // <--- IMPORTANTE
import './FormContato.css'

function FormContato() {
  const [dados, setDados] = useState({
    nome: '', celular: '', cidade: '', motivo: ''
  })
  
  const [formAberto, setFormAberto] = useState(false)
  const [enviando, setEnviando] = useState(false)
  const [celularTocado, setCelularTocado] = useState(false)

  const mascaraCelular = (valor) => {
    return valor
      .replace(/\D/g, '')
      .replace(/^(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .replace(/(-\d{4})\d+?$/, '$1');
  }

  const handleChange = (e) => {
    let { name, value } = e.target
    if (name === 'celular') value = mascaraCelular(value)
    setDados({ ...dados, [name]: value })
  }

  const handleBlurCelular = () => {
    setCelularTocado(true)
  }

  const erroCelular = celularTocado && dados.celular.length < 15

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!dados.nome || dados.celular.length < 15) {
      setCelularTocado(true)
      // --- ALERTA DE ERRO PERSONALIZADO ---
      Swal.fire({
        icon: 'warning',
        title: 'Atenção',
        text: 'Por favor, preencha o Nome e um Celular válido.',
        confirmButtonColor: '#2b0505' // Cor Vinho da Igreja
      })
      return
    }

    setEnviando(true)

    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080'

    fetch(`${apiUrl}/api/contatos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados)
    })
    .then(res => {
        if(res.ok) {
            // --- ALERTA DE SUCESSO PERSONALIZADO ---
            Swal.fire({
                icon: 'success',
                title: 'Mensagem Enviada!',
                text: `Obrigado, ${dados.nome}! Entraremos em contato em breve.`,
                confirmButtonColor: '#2b0505',
                background: '#fff',
                iconColor: '#27ae60'
            })
            
            setDados({ nome: '', celular: '', cidade: '', motivo: '' })
            setCelularTocado(false)
            setFormAberto(false)
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Erro',
                text: 'Não foi possível enviar. Tente novamente mais tarde.',
                confirmButtonColor: '#a82626'
            })
        }
    })
    .catch(error => {
        console.error(error)
        Swal.fire({
            icon: 'error',
            title: 'Erro de Conexão',
            text: 'Verifique sua internet ou tente mais tarde.',
            confirmButtonColor: '#a82626'
        })
    })
    .finally(() => {
        setEnviando(false)
    })
  }

  return (
    <div className="form-contato-container">
      <div 
        className="form-header-accordion" 
        onClick={() => setFormAberto(!formAberto)}
        title={formAberto ? "Clique para fechar" : "Clique para abrir o formulário"}
      >
        <h2 className="titulo-form">✉️ Desejo receber contato</h2>
        <span className={`seta-form ${formAberto ? 'aberta' : ''}`}>▼</span>
      </div>
      
      {formAberto && (
        <form onSubmit={handleSubmit} className="form-grid form-animado">
            
            <div className="campo">
                <label>Nome *</label>
                <input type="text" name="nome" value={dados.nome} onChange={handleChange} placeholder="Seu nome completo" required />
            </div>

            <div className="campo">
                <label>Celular *</label>
                <input 
                    type="tel" name="celular" value={dados.celular} onChange={handleChange} onBlur={handleBlurCelular}
                    placeholder="(00) 00000-0000" maxLength="15" required 
                    className={erroCelular ? "input-erro" : ""}
                />
                {erroCelular && <span className="msg-erro">Digite o número completo com DDD.</span>}
            </div>

            <div className="campo">
                <label>Cidade</label>
                <input type="text" name="cidade" value={dados.cidade} onChange={handleChange} placeholder="Ex: Araraquara"/>
            </div>

            <div className="campo full-width">
                <label>Motivo do contato</label>
                <textarea name="motivo" value={dados.motivo} onChange={handleChange} rows="3" placeholder="Pedido de oração, visita, dúvida..."></textarea>
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