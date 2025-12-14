import React from 'react'
import './InfoIgreja.css'

function InfoIgreja() {
  // Dados de URL
  const enderecoQuery = "Av+Marginal+221+Jardim+São+Francisco+Araraquara"
  
  // URLs dos Mapas
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${enderecoQuery}`
  const appleMapsUrl = `http://maps.apple.com/?q=${enderecoQuery}`
  
  // URLs de Contato
  const whatsappUrl = "https://wa.me/5516993365912"
  const instagramUrl = "https://www.instagram.com/cemv.igrejafamilia/"

  return (
    <div className="info-grid">
      
      {/* CARD 1: Localização e Contato */}
      <div className="info-card">
        <h3>📍 Localização e Contato</h3>
        
        <div className="info-item">
            <p><strong>Comunidade Evangélica Mudança de Vida</strong></p>
            <p>Av Marginal, 221</p>
            <p>Jardim São Francisco, Araraquara - SP</p>
            
            {/* Botões dos Mapas Lado a Lado */}
            <div className="map-buttons-container">
                <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer" className="btn-mapa btn-google">
                   🗺️ Google Maps
                </a>
                <a href={appleMapsUrl} target="_blank" rel="noopener noreferrer" className="btn-mapa btn-apple">
                   🍎 Apple Maps
                </a>
            </div>
        </div>

        <div className="divisor-info"></div>

        <div className="info-item">
            <p><strong>Fale Conosco:</strong></p>
            <div className="social-links">
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="link-social link-whats">
                    📱 (16) 99336-5912
                </a>
                <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="link-social link-insta">
                    📸 @cemv.igrejafamilia
                </a>
            </div>
        </div>
      </div>

      {/* CARD 2: Horários dos Cultos (MANTIDO IGUAL) */}
      <div className="info-card destaque">
        <h3>⛪ Dias de Culto</h3>
        
        <ul className="lista-cultos">
            <li>
                <span className="dia">Terça-feira</span>
                <span className="desc">Oração e Estudo Bíblico</span>
                <span className="hora">19:30</span>
            </li>
            <li>
                <span className="dia">Quinta-feira</span>
                <span className="desc">Culto de Adoração</span>
                <span className="hora">19:30</span>
            </li>
            <li>
                <span className="dia">Domingo</span>
                <span className="desc">Culto da Família</span>
                <span className="hora">18:30</span>
            </li>
        </ul>
      </div>

    </div>
  )
}

export default InfoIgreja