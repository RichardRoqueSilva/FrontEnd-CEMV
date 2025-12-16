import React, { useState, useEffect } from 'react'
import './Carrossel.css'

// O componente agora recebe 'titulo' e 'imagens' como propriedades (Props)
function Carrossel({ titulo, imagens }) {
  const [indiceAtual, setIndiceAtual] = useState(0)
  const [imagemExpandida, setImagemExpandida] = useState(null)

  // Segurança: Se não vier imagens, usa array vazio para não quebrar
  const listaImagens = imagens || []

  const proximaFoto = () => {
    setIndiceAtual((prev) => (prev === listaImagens.length - 1 ? 0 : prev + 1))
  }

  const fotoAnterior = () => {
    setIndiceAtual((prev) => (prev === 0 ? listaImagens.length - 1 : prev - 1))
  }

  useEffect(() => {
    const intervalo = setInterval(proximaFoto, 5000)
    return () => clearInterval(intervalo)
  }, [indiceAtual])

  const getClasseImagem = (index) => {
    if (index === indiceAtual) return 'slide ativo'

    const total = listaImagens.length
    
    // Cálculo circular para índices
    const anterior = (indiceAtual - 1 + total) % total
    const proximo = (indiceAtual + 1) % total
    const anterior2 = (indiceAtual - 2 + total) % total
    const proximo2 = (indiceAtual + 2) % total

    if (index === anterior) return 'slide anterior'
    if (index === proximo) return 'slide proximo'
    if (index === anterior2) return 'slide anterior-2'
    if (index === proximo2) return 'slide proximo-2'

    return 'slide oculto'
  }

  const handleCliqueSlide = (index) => {
    if (index === indiceAtual) {
        setImagemExpandida(listaImagens[index])
    } else {
        setIndiceAtual(index)
    }
  }

  // Se não houver imagens, não renderiza nada
  if (listaImagens.length === 0) return null

  return (
    <div className="carrossel-wrapper">
      {/* Título dinâmico recebido via prop */}
      <h2 className="carrossel-titulo">{titulo}</h2>
      
      <div className="carrossel-container">
        <button className="btn-seta esquerda" onClick={fotoAnterior}>❮</button>
        
        <div className="slides-stage">
            {listaImagens.map((img, index) => (
                <div 
                    key={index} 
                    className={getClasseImagem(index)}
                    onClick={() => handleCliqueSlide(index)}
                    title={index === indiceAtual ? "Clique para ampliar" : "Clique para ver"}
                >
                    <img src={img} alt={`${titulo} ${index}`} />
                </div>
            ))}
        </div>

        <button className="btn-seta direita" onClick={proximaFoto}>❯</button>
      </div>

      <div className="indicadores">
        {listaImagens.map((_, index) => (
            <span 
                key={index} 
                className={`bolinha ${index === indiceAtual ? 'ativa' : ''}`}
                onClick={() => setIndiceAtual(index)}
            ></span>
        ))}
      </div>

      {imagemExpandida && (
        <div className="lightbox-overlay" onClick={() => setImagemExpandida(null)}>
            <button className="lightbox-close" onClick={() => setImagemExpandida(null)}>✖</button>
            <img src={imagemExpandida} alt="Zoom" className="lightbox-img" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </div>
  )
}

export default Carrossel