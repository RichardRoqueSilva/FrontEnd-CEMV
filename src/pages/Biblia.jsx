import { useState } from 'react'
import PlanoLeitura from '../components/biblia/PlanoLeitura'
import LeitorBiblia from '../components/biblia/LeitorBiblia'

function Biblia() {
  // Estado para comunicar o Plano com o Leitor
  const [leituraAtiva, setLeituraAtiva] = useState({ livro: null, cap: null })

  // Função chamada quando clica num capítulo do plano
  const abrirNoLeitor = (livro, cap) => {
    setLeituraAtiva({ livro, cap })
    // Scroll suave até o leitor
    window.scrollTo({ top: 400, behavior: 'smooth' })
  }

  return (
    <div className="main-content">
      
      {/* Componente 1: Plano e Calendário */}
      <PlanoLeitura aoSelecionarCapitulo={abrirNoLeitor} />
      
      <hr style={{border: 0, height:'1px', background:'#ddd', margin:'30px 0'}} />

      {/* Componente 2: Leitor do Texto */}
      <LeitorBiblia 
         livroInicial={leituraAtiva.livro} 
         capInicial={leituraAtiva.cap} 
      />

    </div>
  )
}

export default Biblia