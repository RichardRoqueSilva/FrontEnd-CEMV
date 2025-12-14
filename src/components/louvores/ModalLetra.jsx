import React from 'react'
import './ModalLetra.css'

function ModalLetra({ louvor, aoFechar }) {
  if (!louvor) return null

  return (
    <div className="modal-overlay" onClick={aoFechar}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{louvor.nomeMusica}</h2>
          <button className="btn-close-modal" onClick={aoFechar}>✖</button>
        </div>
        
        <h4 style={{textAlign:'center', color:'#666', marginTop:'10px'}}>
            {louvor.nomeCantor}
        </h4>
        
        <div className="modal-body-letra">
          {louvor.letra}
        </div>

        <button className="btn-primary" style={{margin:'20px'}} onClick={aoFechar}>
          Fechar
        </button>
      </div>
    </div>
  )
}

export default ModalLetra