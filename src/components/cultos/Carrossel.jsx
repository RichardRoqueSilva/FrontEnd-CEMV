import React, { useState, useEffect } from 'react'
import './Carrossel.css'

function Carrossel({ titulo, dados, podeEditar, aoExcluir }) {
  const [indiceAtual, setIndiceAtual] = useState(0)
  const [imagemExpandida, setImagemExpandida] = useState(null)
  
  // NOVO ESTADO: Controla se o mouse está em cima
  const [pausado, setPausado] = useState(false)

  const listaDados = dados || []

  const proximaFoto = () => {
    setIndiceAtual((prev) => (prev === listaDados.length - 1 ? 0 : prev + 1))
  }

  const fotoAnterior = () => {
    setIndiceAtual((prev) => (prev === 0 ? listaDados.length - 1 : prev - 1))
  }

  useEffect(() => {
    // Só roda o timer se:
    // 1. Tiver fotos
    // 2. Não estiver com zoom aberto
    // 3. NÃO estiver com o mouse em cima (pausado)
    if (listaDados.length === 0 || imagemExpandida || pausado) return

    const intervalo = setInterval(proximaFoto, 5000)
    return () => clearInterval(intervalo)
  }, [indiceAtual, imagemExpandida, listaDados, pausado]) // Adicionado 'pausado' nas dependências

  if (listaDados.length === 0) {
    return (
        <div className="carrossel-wrapper">
            <h2 className="carrossel-titulo">{titulo}</h2>
            <p style={{color:'#666', fontStyle:'italic', padding:'20px'}}>
                Nenhuma foto cadastrada ainda.
            </p>
        </div>
    )
  }

  const getClasseImagem = (index) => {
    if (index === indiceAtual) return 'slide ativo'
    
    const total = listaDados.length
    
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

  const itemAtual = listaDados[indiceAtual]

  return (
    <div 
        className="carrossel-wrapper"
        // NOVOS EVENTOS PARA PAUSAR
        onMouseEnter={() => setPausado(true)}
        onMouseLeave={() => setPausado(false)}
    >
      <h2 className="carrossel-titulo">{titulo}</h2>
      
      <div className="carrossel-container">
        <button className="btn-seta esquerda" onClick={fotoAnterior}>❮</button>
        
        <div className="slides-stage">
            {listaDados.map((item, index) => (
                <div 
                    key={item.id || index} 
                    className={getClasseImagem(index)}
                    onClick={() => index === indiceAtual ? setImagemExpandida(item.urlImagem) : setIndiceAtual(index)}
                >
                    <img src={item.urlImagem} alt="Culto" />
                    
                    {podeEditar && index === indiceAtual && (
                        <button 
                            className="btn-delete-foto"
                            onClick={(e) => {
                                e.stopPropagation()
                                if(confirm('Excluir esta foto?')) aoExcluir(item.id)
                            }}
                            title="Excluir foto"
                        >
                            🗑️
                        </button>
                    )}
                </div>
            ))}
        </div>

        <button className="btn-seta direita" onClick={proximaFoto}>❯</button>
      </div>

      <div className="legenda-container">
        <p className="legenda-texto">
            {itemAtual?.descricao || "Sem descrição."}
        </p>
        <div className="indicadores">
            {listaDados.map((_, index) => (
                <span 
                    key={index} 
                    className={`bolinha ${index === indiceAtual ? 'ativa' : ''}`}
                    onClick={() => setIndiceAtual(index)}
                ></span>
            ))}
        </div>
      </div>

      {imagemExpandida && (
        <div className="lightbox-overlay" onClick={() => setImagemExpandida(null)}>
            <button className="lightbox-close">✖</button>
            <img src={imagemExpandida} className="lightbox-img" onClick={(e) => e.stopPropagation()}/>
        </div>
      )}
    </div>
  )
}

export default Carrossel