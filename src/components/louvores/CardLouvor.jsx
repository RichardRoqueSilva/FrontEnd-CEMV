// src/components/louvores/CardLouvor.jsx
import React from 'react'
import './CardLouvor.css'

function CardLouvor({ louvor, aoEditar, aoExcluir, aoVerLetra, adminMode }) {
  return (
    <div className="card">
      <div className="card-header">
        <h3>{louvor.nomeMusica}</h3>
        <span className={`tag ${louvor.estilo === 'AGITADA' ? 'agitada' : 'lenta'}`}>
          {louvor.estilo}
        </span>
      </div>
      
      <p className="cantor-nome"><strong>Cantor:</strong> {louvor.nomeCantor}</p>
      
      {louvor.letra && (
        <button className="btn-link" onClick={() => aoVerLetra(louvor)}>
            Ver Letra Completa
        </button>
      )}

      {/* SÓ MOSTRA OS BOTÕES SE FOR ADMIN */}
      {adminMode && (
        <div className="card-actions">
            <button className="btn-edit" onClick={() => aoEditar(louvor)}>Editar</button>
            <button className="btn-delete" onClick={() => aoExcluir(louvor.id)}>Excluir</button>
        </div>
      )}
    </div>
  )
}

export default CardLouvor