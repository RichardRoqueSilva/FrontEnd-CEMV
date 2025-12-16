import { useState, useEffect, useRef } from 'react'
import { LISTA_LIVROS } from '../../utils/dadosBiblia'
import './LeitorBiblia.css'

function LeitorBiblia({ livroInicial, capInicial }) {
  const [livroSelecionado, setLivroSelecionado] = useState(LISTA_LIVROS[0])
  const [capituloSelecionado, setCapituloSelecionado] = useState(1)
  const [versiculos, setVersiculos] = useState([])
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState(null)
  
  // --- CONTROLE DE LEITURA DE VOZ (ÁUDIO) ---
  const [lendo, setLendo] = useState(false)
  const [velocidade, setVelocidade] = useState(1)
  const [vozesDisponiveis, setVozesDisponiveis] = useState([])
  const [vozSelecionada, setVozSelecionada] = useState(null)
  
  const synth = window.speechSynthesis

  // --- CONTROLE DE ESTUDO (NOTAS E CORES) ---
  const [notasUsuario, setNotasUsuario] = useState({})
  const [versoEmEdicao, setVersoEmEdicao] = useState(null)
  const [tempNota, setTempNota] = useState("")
  const [tempCor, setTempCor] = useState("")

  // 1. Carregar notas salvas do LocalStorage
  useEffect(() => {
    const salvas = localStorage.getItem('cemv_biblia_notas')
    if (salvas) setNotasUsuario(JSON.parse(salvas))
  }, [])

  // 2. Carregar e filtrar vozes em Português
  useEffect(() => {
    const carregarVozes = () => {
      const todasVozes = synth.getVoices()
      const vozesPT = todasVozes.filter(v => v.lang.includes('pt'))
      setVozesDisponiveis(vozesPT)
      // Tenta selecionar uma padrão
      if (vozesPT.length > 0) {
        setVozSelecionada(vozesPT[0])
      }
    }
    carregarVozes()
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = carregarVozes
    }
  }, [])

  // 3. Sincroniza props
  useEffect(() => {
    if (livroInicial && capInicial) {
        const livroObj = LISTA_LIVROS.find(l => l.nome === livroInicial)
        if(livroObj) {
            setLivroSelecionado(livroObj)
            setCapituloSelecionado(capInicial)
        }
    }
  }, [livroInicial, capInicial])

  // 4. Busca Texto e Para a leitura anterior
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

  // --- LÓGICA DE ESTUDO (NOTAS) ---
  const abrirEditor = (numVerso) => {
    const chave = `${livroSelecionado.nome}-${capituloSelecionado}-${numVerso}`
    const dadosExistentes = notasUsuario[chave] || { cor: '', nota: '' }
    setVersoEmEdicao(numVerso)
    setTempCor(dadosExistentes.cor)
    setTempNota(dadosExistentes.nota)
  }

  const salvarNota = () => {
    const chave = `${livroSelecionado.nome}-${capituloSelecionado}-${versoEmEdicao}`
    let novasNotas = { ...notasUsuario }
    
    if (!tempCor && !tempNota.trim()) {
        delete novasNotas[chave]
    } else {
        novasNotas[chave] = { cor: tempCor, nota: tempNota }
    }

    setNotasUsuario(novasNotas)
    localStorage.setItem('cemv_biblia_notas', JSON.stringify(novasNotas))
    setVersoEmEdicao(null)
  }

  const getDadosVerso = (numVerso) => {
    const chave = `${livroSelecionado.nome}-${capituloSelecionado}-${numVerso}`
    return notasUsuario[chave] || { cor: '', nota: '' }
  }

  // --- LÓGICA DE LEITURA (ÁUDIO) ---
  
  const iniciarLeitura = (velocidadeEscolhida) => {
    if (versiculos.length === 0) return
    if (synth.speaking) synth.cancel()

    setLendo(true)
    
    const textoCompleto = `${livroSelecionado.nome}, capítulo ${capituloSelecionado}. ` + 
                          versiculos.map(v => v.text).join(" ")

    const utterThis = new SpeechSynthesisUtterance(textoCompleto)
    
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

  const mudarVoz = (e) => {
    const nomeVoz = e.target.value
    const novaVoz = vozesDisponiveis.find(v => v.name === nomeVoz)
    setVozSelecionada(novaVoz)

    if (lendo) {
        cancelarLeitura()
        setTimeout(() => {
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

  const getIconeVoz = (nome) => {
    const n = nome.toLowerCase()
    if (n.includes('daniel') || n.includes('felipe') || n.includes('male')) return '👨'
    if (n.includes('maria') || n.includes('luciana') || n.includes('female') || n.includes('google')) return '👩'
    return '🗣️'
  }

  return (
    <div className="leitor-container">
      
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
        
        {/* BARRA DE CONTROLE DE ÁUDIO */}
        <div className="audio-controls-bar">
            <h2 className="titulo-capitulo-audio">
                {livroSelecionado.nome} {capituloSelecionado}
            </h2>
            
            <div className="player-actions">
                {/* Seletor de Voz */}
                {vozesDisponiveis.length > 0 && (
                    <select 
                        className="select-velocidade"
                        value={vozSelecionada ? vozSelecionada.name : ''} 
                        onChange={mudarVoz}
                        title="Escolha a Voz"
                        style={{maxWidth: '150px'}}
                    >
                        {vozesDisponiveis.map((v) => (
                            <option key={v.name} value={v.name}>
                                {getIconeVoz(v.name)} {v.name.replace('Microsoft ', '').replace('Google ', '')}
                            </option>
                        ))}
                    </select>
                )}

                {/* Seletor de Velocidade */}
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

        {/* LISTA DE VERSÍCULOS (Com suporte a clique e cor) */}
        {carregando ? <div className="loading">Carregando palavra...</div> : erro ? <div style={{color:'red'}}>{erro}</div> : (
            <div className="versiculos-lista">
                {versiculos.map((v) => {
                    // Pega dados de cor/nota se existirem
                    const dados = getDadosVerso(v.verse)
                    return (
                        <div 
                            key={v.verse} 
                            className={`versiculo ${dados.cor ? `bg-${dados.cor}` : ''}`} 
                            onClick={() => abrirEditor(v.verse)}
                            title="Clique para grifar ou comentar"
                        >
                            <span className="v-numero">{v.verse}</span> {v.text}
                            
                            {/* Mostra nota se existir */}
                            {dados.nota && <span className="nota-usuario">📝 {dados.nota}</span>}
                        </div>
                    )
                })}
            </div>
        )}
      </div>

      {/* --- MODAL DE EDIÇÃO DE VERSÍCULO --- */}
      {versoEmEdicao && (
        <div className="editor-overlay" onClick={() => setVersoEmEdicao(null)}>
            <div className="editor-box" onClick={e => e.stopPropagation()}>
                <h3 className="editor-titulo">Editar Versículo {versoEmEdicao}</h3>
                
                <p style={{fontSize:'0.9rem', marginBottom:'10px', color:'#555'}}>Cor de destaque:</p>
                <div className="cores-grid">
                    <button className={`btn-cor ${tempCor === '' ? 'selecionada' : ''}`} style={{background:'white'}} onClick={() => setTempCor('')}>❌</button>
                    <button className={`btn-cor bg-amarelo ${tempCor === 'amarelo' ? 'selecionada' : ''}`} onClick={() => setTempCor('amarelo')}></button>
                    <button className={`btn-cor bg-verde ${tempCor === 'verde' ? 'selecionada' : ''}`} onClick={() => setTempCor('verde')}></button>
                    <button className={`btn-cor bg-azul ${tempCor === 'azul' ? 'selecionada' : ''}`} onClick={() => setTempCor('azul')}></button>
                    <button className={`btn-cor bg-rosa ${tempCor === 'rosa' ? 'selecionada' : ''}`} onClick={() => setTempCor('rosa')}></button>
                </div>

                <p style={{fontSize:'0.9rem', marginBottom:'10px', color:'#555'}}>Anotação:</p>
                <textarea 
                    className="input-nota" 
                    rows="3" 
                    placeholder="Escreva sua anotação..."
                    value={tempNota}
                    onChange={(e) => setTempNota(e.target.value)}
                ></textarea>

                <div className="editor-actions">
                    <button className="btn-stop" onClick={() => setVersoEmEdicao(null)}>Cancelar</button>
                    <button className="btn-play" onClick={salvarNota}>Salvar</button>
                </div>
            </div>
        </div>
      )}

    </div>
  )
}

export default LeitorBiblia