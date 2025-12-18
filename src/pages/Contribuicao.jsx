import React from 'react'
import CardPix from '../components/contribuicao/CardPix'
import '../App.css' // Garante os estilos globais

function Contribuicao() {
  return (
    <div className="main-content">
      
      {/* Título Padronizado */}
      <h1 className="page-title">Dízimos e Ofertas</h1>

      <div style={{textAlign: 'center', marginBottom: '40px', maxWidth: '800px', margin: '0 auto 40px auto'}}>
        <p style={{fontSize: '1.1rem', color: '#555', lineHeight: '1.6'}}>
          "Cada um contribua segundo propôs no seu coração; não com tristeza, ou por necessidade; porque Deus ama ao que dá com alegria."
          <br/>
          <strong>2 Coríntios 9:7</strong>
        </p>
      </div>

      {/* Componente Isolado */}
      <CardPix />

    </div>
  )
}

export default Contribuicao