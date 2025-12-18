import React, { useState } from 'react'
import './CardPix.css'
import imgPix from '../../assets/img/contribuicao/pix.jpeg'

function CardPix() {
  const [copiado, setCopiado] = useState(false)
  
  // Chave PIX (Apenas números para facilitar apps de banco, ou e-mail/telefone)
  // Baseado na imagem, é o telefone.
  const chavePix = "16993365912" 
  const chaveFormatada = "(16) 99336-5912"

  const copiarChave = () => {
    navigator.clipboard.writeText(chavePix)
    setCopiado(true)
    
    // Reseta a mensagem de "Copiado" após 3 segundos
    setTimeout(() => setCopiado(false), 3000)
  }

  return (
    <div className="pix-card-container">
      
      {/* Imagem do QR Code fornecida */}
      <div className="pix-img-wrapper">
        <img src={imgPix} alt="QR Code PIX" className="pix-image" />
      </div>

      <div className="pix-info">
        <h3>Chave PIX (Celular)</h3>
        
        <div className="chave-box">
            {chaveFormatada}
        </div>

        <button 
            className={`btn-copiar ${copiado ? 'sucesso' : ''}`} 
            onClick={copiarChave}
        >
            {copiado ? '✅ Chave Copiada!' : '📋 Copiar Chave'}
        </button>
      </div>
    </div>
  )
}

export default CardPix