import React from 'react'
import PalavraDoDia from '../components/home/PalavraDoDia'
import './Home.css'

// Importando a imagem
import fotoPastores from '../assets/img/home/pastores.jpeg' 

function Home() {
  return (
    <div className="main-content">
      
      {/* 1. CABEÇALHO PADRÃO */}
      <div className="home-header">
        <h1 className="home-titulo">Bem-vindo à CEMV</h1>
        <p className="home-subtitulo">Comunidade Evangélica Mudança de Vida</p>
      </div>

      {/* 2. SEÇÃO PALAVRA DO DIA */}
      <section>
        <PalavraDoDia />
      </section>

      {/* DIVISOR ELEGANTE */}
      <hr className="home-divisor" />

      {/* 3. SEÇÃO PASTORES (Novo Layout) */}
      <section className="pastores-section">
        
        {/* Título da Seção */}
        <div style={{textAlign: 'center', marginBottom: '30px'}}>
            <h2 className="home-titulo" style={{fontSize: '1.5rem', borderBottomColor: '#a82626'}}>
                Nossa Liderança
            </h2>
        </div>

        <div className="pastores-card">
            {/* Foto */}
            <div className="pastores-img-container">
                <img 
                    src={fotoPastores} 
                    alt="Pastores Márcio e Cláudia" 
                    className="pastores-foto"
                    onError={(e) => {
                        e.target.style.display='none';
                        e.target.nextSibling.style.display='flex';
                    }}
                />
                <div className="placeholder-foto" style={{display: 'none'}}>👥</div>
            </div>

            {/* Texto */}
            <div className="pastores-info">
                <h3 className="bio-titulo">Pastores Márcio e Cláudia</h3>
                <div className="texto-bio">
                    <p>
                        Há mais de 20 anos dedicados ao Reino, têm sido instrumentos vivos nas mãos de Deus. Iniciaram sua jornada ministerial como pastores auxiliares em Artur Nogueira e hoje lideram a CEMV com amor, excelência e dedicação.
                    </p>
                    <br/>
                    <p>
                        O Pastor Márcio é formado em Teologia e especialista em Terapia para Casais. A Pastora Cláudia, também teóloga, atua como Terapeuta. Juntos, conduzem um ministério marcado por milagres, curas e restauração de vidas.
                    </p>
                    <br/>
                    <p>
                        A CEMV é carinhosamente conhecida como a <span className="destaque-texto">"Igreja do Pão"</span> e a <span className="destaque-texto">"Igreja da Família"</span>, um lugar onde o alimento espiritual nunca falta e onde todos encontram um lar para pertencer.
                    </p>
                </div>
            </div>
        </div>
      </section>

    </div>
  )
}

export default Home