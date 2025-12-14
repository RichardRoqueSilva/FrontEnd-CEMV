import { useState, useEffect, useRef } from 'react'
import { LISTA_LIVROS } from '../../utils/dadosBiblia'
import './LeitorBiblia.css'

function LeitorBiblia({ livroInicial, capInicial }) {
  const [livroSelecionado, setLivroSelecionado] = useState(LISTA_LIVROS[0])
  const [capituloSelecionado, setCapituloSelecionado] = useState(1)
  const [versiculos, setVersiculos] = useState([])
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState(null)
  
  // Controle de Leitura
  const [lendo, setLendo] = useState(false)
  const [velocidade, setVelocidade] = useState(1)
  
  // --- NOVOS ESTADOS DE VOZ ---
  const [vozesDisponiveis, setVozesDisponiveis] = useState([])
  const [vozSelecionada, setVozSelecionada] = useState(null)
  
  const synth = window.speechSynthesis

  // 1. Carrega e filtra vozes em Português
  useEffect(() => {
    const carregarVozes = () => {
      const todasVozes = synth.getVoices()
      
      // Filtra apenas PT-BR ou PT-PT
      const vozesPT = todasVozes.filter(v => v.lang.includes('pt'))
      
      setVozesDisponiveis(vozesPT)

      // Tenta selecionar uma padrão (Preferência: Google ou Microsoft)
      if (vozesPT.length > 0) {
        setVozSelecionada(vozesPT[0])
      }
    }

    carregarVozes()
    
    // Chrome precisa desse evento para carregar vozes assincronamente
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = carregarVozes
    }
  }, [])

  useEffect(() => {
    if (livroInicial && capInicial) {
        const livroObj = LISTA_LIVROS.find(l => l.nome === livroInicial)
        if(livroObj) {
            setLivroSelecionado(livroObj)
            setCapituloSelecionado(capInicial)
        }
    }
  }, [livroInicial, capInicial])

  useEffect(() => {
    cancelarLeitura()
    buscarVersiculos()
  }, [livroSelecionado, capituloSelecionado])

  const buscarVersiculos = () => {
    setCarregando(true); setErro(null)
    fetch(`https://bible-api.com/${livroSelecionado.nome}+${capituloSelecionado}?translation=almeida`)
      .then(res => res.json())
      .then(data => { setVersiculos(data.verses); setCarregando(false) })
      .catch(() => { setErro("Erro ao carregar texto sagrado."); setCarregando(false) })
  }

  const handleTrocaLivro = (e) => {
    const livro = LISTA_LIVROS.find(l => l.nome === e.target.value)
    setLivroSelecionado(livro)
    setCapituloSelecionado(1)
  }

  // --- LÓGICA DE LEITURA ---
  
  const iniciarLeitura = (velocidadeEscolhida) => {
    if (versiculos.length === 0) return
    if (synth.speaking) synth.cancel()

    setLendo(true)
    
    const textoCompleto = `${livroSelecionado.nome}, capítulo ${capituloSelecionado}. ` + 
                          versiculos.map(v => v.text).join(" ")

    const utterThis = new SpeechSynthesisUtterance(textoCompleto)
    
    // Configura a voz escolhida pelo usuário
    if (vozSelecionada) {
        utterThis.voice = vozSelecionada
        utterThis.lang = vozSelecionada.lang
    }

    utterThis.rate = velocidadeEscolhida || velocidade 
    utterThis.pitch = 1.0
    utterThis.onend = () => setLendo(false)
    
    synth.speak(utterThis)
  }

  const cancelarLeitura = () => {
    if (synth.speaking) synth.cancel()
    setLendo(false)
  }

  const alternarLeitura = () => {
    if (lendo) cancelarLeitura()
    else iniciarLeitura(velocidade)
  }

  const mudarVelocidade = (e) => {
    const novaVel = parseFloat(e.target.value)
    setVelocidade(novaVel)
    if (lendo) {
        cancelarLeitura()
        setTimeout(() => iniciarLeitura(novaVel), 50)
    }
  }

  // Função para trocar a voz e reiniciar se estiver falando
  const mudarVoz = (e) => {
    const nomeVoz = e.target.value
    const novaVoz = vozesDisponiveis.find(v => v.name === nomeVoz)
    setVozSelecionada(novaVoz)

    if (lendo) {
        cancelarLeitura()
        // Pequeno delay necessário para o navegador processar a troca
        setTimeout(() => {
            // Gambiarra necessária: precisamos passar a nova voz manualmente aqui
            // porque o estado vozSelecionada pode não ter atualizado ainda dentro do timeout
            if (versiculos.length === 0) return
            const textoCompleto = `${livroSelecionado.nome}, capítulo ${capituloSelecionado}. ` + 
                                  versiculos.map(v => v.text).join(" ")
            const utterThis = new SpeechSynthesisUtterance(textoCompleto)
            utterThis.voice = novaVoz
            utterThis.rate = velocidade
            utterThis.onend = () => setLendo(false)
            setLendo(true)
            synth.speak(utterThis)
        }, 100)
    }
  }

  // Tenta adivinhar o gênero pelo nome da voz para colocar um ícone
  const getIconeVoz = (nome) => {
    const n = nome.toLowerCase()
    if (n.includes('daniel') || n.includes('felipe') || n.includes('ricardo') || n.includes('male')) return '👨'
    if (n.includes('maria') || n.includes('luciana') || n.includes('fernanda') || n.includes('female') || n.includes('google')) return '👩'
    return '🗣️'
  }

  return (
    <div className="leitor-container">
      <h1>Bíblia Sagrada Online</h1>
      
      <div className="biblia-controls form-box-row">
        <div style={{flex: 1}}>
            <label>Livro:</label>
            <select onChange={handleTrocaLivro} value={livroSelecionado.nome}>
            {LISTA_LIVROS.map((livro) => (
                <option key={livro.nome} value={livro.nome}>{livro.nome}</option>
            ))}
            </select>
        </div>
        <div style={{flex: 1, maxWidth: '100px'}}>
            <label>Capítulo:</label>
            <select value={capituloSelecionado} onChange={(e) => setCapituloSelecionado(Number(e.target.value))}>
                {Array.from({ length: livroSelecionado.caps }, (_, i) => i + 1).map(num => (
                    <option key={num} value={num}>{num}</option>
                ))}
            </select>
        </div>
      </div>

      <div className="biblia-leitura-box">
        
        {/* BARRA DE CONTROLE */}
        <div className="audio-controls-bar">
            <h2 className="titulo-capitulo-audio">
                {livroSelecionado.nome} {capituloSelecionado}
            </h2>
            
            <div className="player-actions">
                
                {/* SELETOR DE VOZ (Novo) */}
                {vozesDisponiveis.length > 0 && (
                    <select 
                        className="select-velocidade"
                        value={vozSelecionada ? vozSelecionada.name : ''} 
                        onChange={mudarVoz}
                        title="Escolha a Voz"
                        style={{maxWidth: '150px'}} // Limita largura pra não quebrar layout
                    >
                        {vozesDisponiveis.map((v) => (
                            <option key={v.name} value={v.name}>
                                {getIconeVoz(v.name)} {v.name.replace('Microsoft ', '').replace('Google ', '')}
                            </option>
                        ))}
                    </select>
                )}

                {/* SELETOR DE VELOCIDADE */}
                <select 
                    className="select-velocidade"
                    value={velocidade}
                    onChange={mudarVelocidade}
                    title="Velocidade"
                >
                    <option value="0.75">0.75x</option>
                    <option value="1">1.0x</option>
                    <option value="1.25">1.25x</option>
                    <option value="1.5">1.5x</option>
                    <option value="2">2.0x</option>
                </select>

                <button 
                    onClick={alternarLeitura} 
                    className={lendo ? "btn-stop" : "btn-play"}
                >
                    {lendo ? "⏹️" : "🔊"}
                </button>
            </div>
        </div>

        <hr style={{margin: '0 0 20px 0', border: 0, borderTop: '1px solid #eee'}}/>

        {carregando ? <div className="loading">Carregando palavra...</div> : erro ? <div style={{color:'red'}}>{erro}</div> : (
            <div className="versiculos-lista">
                {versiculos.map((v) => (
                    <p key={v.verse} className="versiculo">
                        <span className="v-numero">{v.verse}</span> {v.text}
                    </p>
                ))}
            </div>
        )}
      </div>
    </div>
  )
}

export default LeitorBiblia