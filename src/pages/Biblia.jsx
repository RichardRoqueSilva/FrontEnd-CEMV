import { useState } from 'react'
import PlanoLeitura from '../components/biblia/PlanoLeitura'
import LeitorBiblia from '../components/biblia/LeitorBiblia'
import '../App.css'

function Biblia() {
  const [leituraAtiva, setLeituraAtiva] = useState({ livro: null, cap: null })

  const abrirNoLeitor = (livro, cap) => {
    setLeituraAtiva({ livro, cap })
    window.scrollTo({ top: 600, behavior: 'smooth' })
  }

  return (
    <div className="main-content">
      
      {/* Título Plano */}
      <h1 className="page-title">Plano de Leitura</h1>
      
      <PlanoLeitura aoSelecionarCapitulo={abrirNoLeitor} />

      {/* Título Bíblia (Adicionei um margin-top para dar um respiro sem a linha) */}
      <h1 className="page-title" style={{marginTop: '50px'}}>Bíblia Sagrada Online</h1>

      <LeitorBiblia 
         livroInicial={leituraAtiva.livro} 
         capInicial={leituraAtiva.cap} 
      />

    </div>
  )
}

export default Biblia