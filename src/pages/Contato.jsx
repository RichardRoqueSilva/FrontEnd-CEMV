import React from 'react'
import InfoIgreja from '../components/contato/InfoIgreja'
import FormContato from '../components/contato/FormContato'

function Contato() {
  return (
    <div className="main-content">
      <h1 className="page-title">Contato</h1>
      
      {/* Componente de Informações (Endereço e Cultos) */}
      <InfoIgreja />

      {/* Divisor Padronizado */}
      <hr className="section-divider" />

      {/* Componente de Formulário */}
      <FormContato />
      
    </div>
  )
}

export default Contato