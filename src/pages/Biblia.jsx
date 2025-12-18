import { useState } from 'react'
import PlanoLeitura from '../components/biblia/PlanoLeitura'
import LeitorBiblia from '../components/biblia/LeitorBiblia'
import { useAuth } from '../context/AuthContext' // <--- Importar Contexto
import '../App.css'

function Biblia() {
  const { user } = useAuth()
  const usuarioLogado = !!user // True se tiver usuário, False se for visitante

  const [leituraAtiva, setLeituraAtiva] = useState({ livro: null, cap: null })

  const abrirNoLeitor = (livro, cap) => {
    setLeituraAtiva({ livro, cap })
    window.scrollTo({ top: 600, behavior: 'smooth' })
  }

  return (
    <div className="main-content">
      
      <h1 className="page-title">Plano de Leitura</h1>
      
      {/* Passa a permissão para o componente */}
      <PlanoLeitura 
        aoSelecionarCapitulo={abrirNoLeitor} 
        podeRegistrar={usuarioLogado} 
      />
      
      <h1 className="page-title" style={{marginTop: '50px'}}>Bíblia Online</h1>

      {/* Passa a permissão para o componente */}
      <LeitorBiblia 
         livroInicial={leituraAtiva.livro} 
         capInicial={leituraAtiva.cap} 
         podeAnotar={usuarioLogado}
      />

    </div>
  )
}

export default Biblia