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

    // LÓGICA DE CACHE
    const dataHoje = new Date().toISOString().split('T')[0]
    const chaveCache = `cemv_palavra_${dataHoje}`
    const cacheSalvo = localStorage.getItem(chaveCache)

    if (cacheSalvo) {
        // Se já tem no cache, usa ele e NÃO chama a API
        setTexto(cacheSalvo)
        setCarregando(false)
    } else {
        // Se não tem, busca na API
        fetch(`https://bible-api.com/${refDoDia}?translation=almeida`)
          .then(res => res.json())
          .then(data => {
            setTexto(data.text)
            // Salva no cache para a próxima vez
            localStorage.setItem(chaveCache, data.text)
            setCarregando(false)
          })
          .catch(err => {
            console.error("Erro", err)
            setTexto("O Senhor é o meu pastor, nada me faltará.")
            setCarregando(false)
          })
    }
  }, [])

  // ... (Restante do código: função compartilhar e return iguais) ...
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