import React, { useState, useEffect } from 'react'
import { getVersiculoDoDia } from '../../utils/versiculosDia'
import './PalavraDoDia.css'

function PalavraDoDia() {
  const [texto, setTexto] = useState('')
  const [referencia, setReferencia] = useState('')
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    const refDoDia = getVersiculoDoDia()
    setReferencia(refDoDia)

    // Busca o texto na API
    fetch(`https://bible-api.com/${refDoDia}?translation=almeida`)
      .then(res => res.json())
      .then(data => {
        setTexto(data.text)
        setCarregando(false)
      })
      .catch(err => {
        console.error("Erro ao buscar palavra do dia", err)
        setTexto("O Senhor é o meu pastor, nada me faltará.") // Fallback se der erro
        setReferencia("Salmos 23:1")
        setCarregando(false)
      })
  }, [])

  // Função para compartilhar no WhatsApp
  const compartilhar = () => {
    const mensagem = `*Palavra do Dia - CEMV* ✨\n\n"${texto.trim()}"\n_(${referencia})_`
    const url = `https://wa.me/?text=${encodeURIComponent(mensagem)}`
    window.open(url, '_blank')
  }

  return (
    <div className="palavra-container">
      <div className="palavra-header">
        <h3>☕ Palavra do Dia</h3>
        <span className="data-hoje">
            {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
        </span>
      </div>

      <div className="palavra-content">
        {carregando ? (
            <div className="loading-spinner"></div>
        ) : (
            <>
                <p className="versiculo-texto">"{texto.trim()}"</p>
                <p className="versiculo-ref">{referencia}</p>
                
                <button onClick={compartilhar} className="btn-share">
                    Compartilhar no WhatsApp 📲
                </button>
            </>
        )}
      </div>
    </div>
  )
}

export default PalavraDoDia