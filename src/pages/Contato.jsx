import React from 'react'
import InfoIgreja from '../components/contato/InfoIgreja'
import FormContato from '../components/contato/FormContato'

function Contato() {
  return (
    <div className="main-content">
      <h1>Contato</h1>
      
      {/* Componente de Informações (Endereço e Cultos) */}
      <InfoIgreja />

      <hr style={{border: 0, height:'1px', background:'#ddd', margin:'40px 0'}} />

      {/* Componente de Formulário */}
      <FormContato />
      
    </div>
  )
}

export default Contato