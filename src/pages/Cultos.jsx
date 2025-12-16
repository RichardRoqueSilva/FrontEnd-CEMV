import React from 'react'
import Carrossel from '../components/cultos/Carrossel'

// --- 1. Importando Imagens de PREGAÇÃO ---
import pregacao1 from '../assets/img/pregacao/foto1.jpeg'
import pregacao2 from '../assets/img/pregacao/foto2.jpeg'
import pregacao3 from '../assets/img/pregacao/foto3.jpeg'
import pregacao4 from '../assets/img/pregacao/foto4.jpeg'

// --- 2. Importando Imagens de LOUVOR ---
// Certifique-se de que os arquivos existem nessa pasta!
import louvor1 from '../assets/img/louvor/louvor1.jpeg'
import louvor2 from '../assets/img/louvor/louvor2.jpeg'
import louvor3 from '../assets/img/louvor/louvor3.jpeg'
import louvor4 from '../assets/img/louvor/louvor4.jpeg'
import louvor5 from '../assets/img/louvor/louvor5.jpeg'

// Organizando os arrays
const imagensPregacao = [pregacao1, pregacao2, pregacao3, pregacao4]
const imagensLouvor = [louvor1, louvor2, louvor3, louvor4, louvor5]

function Cultos() {
  return (
    <div className="main-content">
      <h1 className="page-title">Momentos dos Cultos</h1>
      <p style={{textAlign: 'center', marginBottom: '40px', color: '#666'}}>
        Venha participar e ser abençoado pela palavra de Deus.
      </p>

      {/* --- SEÇÃO 1: PREGAÇÃO --- */}
      <section style={{marginBottom: '60px'}}>
        <Carrossel 
            titulo="Pregação" 
            imagens={imagensPregacao} 
        />
      </section>

      {/* Linha divisória elegante (Opcional) */}
      <hr style={{maxWidth: '200px', margin: '0 auto 60px auto', border: '1px solid #f1c40f'}} />

      {/* --- SEÇÃO 2: LOUVOR --- */}
      <section style={{marginBottom: '60px'}}>
        <Carrossel 
            titulo="Louvor" 
            imagens={imagensLouvor} 
        />
      </section>
    </div>
  )
}

export default Cultos