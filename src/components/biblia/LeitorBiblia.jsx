import { useState, useEffect, useRef } from 'react'
import { LISTA_LIVROS } from '../../utils/dadosBiblia'
import './LeitorBiblia.css'

function LeitorBiblia({ livroInicial, capInicial, podeAnotar }) {
  const [livroSelecionado, setLivroSelecionado] = useState(LISTA_LIVROS[0])
  const [capituloSelecionado, setCapituloSelecionado] = useState(1)
  const [versiculos, setVersiculos] = useState([])
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState(null)
  
  // Controle de Áudio
  const [lendo, setLendo] = useState(false)
  const [velocidade, setVelocidade] = useState(1)
  const [vozesDisponiveis, setVozesDisponiveis] = useState([])
  const [vozSelecionada, setVozSelecionada] = useState(null)
  const synth = window.speechSynthesis

  // Controle de Estudo
  const [notasUsuario, setNotasUsuario] = useState({})
  const [versoEmEdicao, setVersoEmEdicao] = useState(null)
  const [tempNota, setTempNota] = useState("")
  const [tempCor, setTempCor] = useState("")

  // --- EFEITOS (UseEffects) ---

  useEffect(() => {
    const salvas = localStorage.getItem('cemv_biblia_notas')
    if (salvas) setNotasUsuario(JSON.parse(salvas))
  }, [])

  useEffect(() => {
    const carregarVozes = () => {
      const todasVozes = synth.getVoices()
      const vozesPT = todasVozes.filter(v => v.lang.includes('pt'))
      setVozesDisponiveis(vozesPT)
      if (vozesPT.length > 0) setVozSelecionada(vozesPT[0])
    }
    carregarVozes()
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
    // Rola suavemente para o topo do leitor ao mudar de capítulo
    const leitorDiv = document.querySelector('.biblia-leitura-box')
    if (leitorDiv) leitorDiv.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [livroSelecionado, capituloSelecionado])

  const buscarVersiculos = () => {
    setCarregando(true); setErro(null)
    fetch(`https://bible-api.com/${livroSelecionado.nome}+${capituloSelecionado}?translation=almeida`)
      .then(res => {
        if (!res.ok) throw new Error("Capítulo não encontrado")
        return res.json()
      })
      .then(data => { setVersiculos(data.verses); setCarregando(false) })
      .catch(() => { setErro("Erro ao carregar texto sagrado."); setCarregando(false) })
  }

  const handleTrocaLivro = (e) => {
    const livro = LISTA_LIVROS.find(l => l.nome === e.target.value)
    setLivroSelecionado(livro)
    setCapituloSelecionado(1)
  }

  // --- NOVA LÓGICA DE NAVEGAÇÃO ---
  const irParaAnterior = () => {
    if (capituloSelecionado > 1) {
        // Apenas volta um capítulo
        setCapituloSelecionado(c => c - 1)
    } else {
        // Volta para o livro anterior
        const indexAtual = LISTA_LIVROS.findIndex(l => l.nome === livroSelecionado.nome)
        if (indexAtual > 0) {
            const livroAnterior = LISTA_LIVROS[indexAtual - 1]
            setLivroSelecionado(livroAnterior)
            setCapituloSelecionado(livroAnterior.caps) // Vai para o último cap do livro anterior
        }
    }
  }

  const irParaProximo = () => {
    if (capituloSelecionado < livroSelecionado.caps) {
        // Avança um capítulo
        setCapituloSelecionado(c => c + 1)
    } else {
        // Avança para o próximo livro
        const indexAtual = LISTA_LIVROS.findIndex(l => l.nome === livroSelecionado.nome)
        if (indexAtual < LISTA_LIVROS.length - 1) {
            const proximoLivro = LISTA_LIVROS[indexAtual + 1]
            setLivroSelecionado(proximoLivro)
            setCapituloSelecionado(1) // Vai para o cap 1
        }
    }
  }

  // Verifica se estamos no começo ou fim da Bíblia para desabilitar botões
  const ehGenesis1 = livroSelecionado.nome === "Gênesis" && capituloSelecionado === 1
  const ehApocalipse22 = livroSelecionado.nome === "Apocalipse" && capituloSelecionado === 22

  // --- FUNÇÕES DE NOTAS E ÁUDIO ---
  const abrirEditor = (numVerso) => {
    if (!podeAnotar) return 
    const chave = `${livroSelecionado.nome}-${capituloSelecionado}-${numVerso}`
    const dadosExistentes = notasUsuario[chave] || { cor: '', nota: '' }
    setVersoEmEdicao(numVerso)
    setTempCor(dadosExistentes.cor)
    setTempNota(dadosExistentes.nota)
  }

  const salvarNota = () => {
    const chave = `${livroSelecionado.nome}-${capituloSelecionado}-${versoEmEdicao}`
    let novasNotas = { ...notasUsuario }
    if (!tempCor && !tempNota.trim()) delete novasNotas[chave]
    else novasNotas[chave] = { cor: tempCor, nota: tempNota }
    setNotasUsuario(novasNotas)
    localStorage.setItem('cemv_biblia_notas', JSON.stringify(novasNotas))
    setVersoEmEdicao(null)
  }

  const getDadosVerso = (numVerso) => {
    const chave = `${livroSelecionado.nome}-${capituloSelecionado}-${numVerso}`
    return notasUsuario[chave] || { cor: '', nota: '' }
  }

  const iniciarLeitura = (velocidadeEscolhida) => {
    if (versiculos.length === 0) return
    if (synth.speaking) synth.cancel()
    setLendo(true)
    const textoCompleto = `${livroSelecionado.nome}, capítulo ${capituloSelecionado}. ` + 
                          versiculos.map(v => v.text).join(" ")
    const utterThis = new SpeechSynthesisUtterance(textoCompleto)
    if (vozSelecionada) utterThis.voice = vozSelecionada
    utterThis.lang = 'pt-BR'
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
        setTimeout(() => iniciarLeitura(velocidade), 100)
    }
  }

  const getIconeVoz = (nome) => {
    const n = nome.toLowerCase()
    if (n.includes('daniel') || n.includes('male')) return '👨'
    if (n.includes('maria') || n.includes('female')) return '👩'
    return '🗣️'
  }

  return (
    <div className="leitor-container">
      
      {/* SELETORES DE NAVEGAÇÃO */}
      <div className="biblia-controls form-box-row">
        <div style={{flex: 2, minWidth: '180px'}}>
            <label>Livro:</label>
            <select onChange={handleTrocaLivro} value={livroSelecionado.nome}>
            {LISTA_LIVROS.map((livro) => (
                <option key={livro.nome} value={livro.nome}>{livro.nome}</option>
            ))}
            </select>
        </div>
        <div style={{flex: 1, minWidth: '80px', maxWidth: '100px'}}>
            <label>Cap:</label>
            <select value={capituloSelecionado} onChange={(e) => setCapituloSelecionado(Number(e.target.value))}>
                {Array.from({ length: livroSelecionado.caps }, (_, i) => i + 1).map(num => (
                    <option key={num} value={num}>{num}</option>
                ))}
            </select>
        </div>
      </div>

      <div className="biblia-leitura-box">
        
        {/* BARRA DE ÁUDIO */}
        <div className="audio-controls-bar">
            <h2 className="titulo-capitulo-audio">{livroSelecionado.nome} {capituloSelecionado}</h2>
            <div className="player-actions">
                {vozesDisponiveis.length > 0 && (
                    <select className="select-velocidade" value={vozSelecionada ? vozSelecionada.name : ''} onChange={mudarVoz} style={{maxWidth: '150px'}}>
                        {vozesDisponiveis.map((v) => (
                            <option key={v.name} value={v.name}>{getIconeVoz(v.name)} {v.name.replace('Microsoft ', '').replace('Google ', '')}</option>
                        ))}
                    </select>
                )}
                <select className="select-velocidade" value={velocidade} onChange={mudarVelocidade}>
                    <option value="0.75">0.75x</option>
                    <option value="1">1.0x</option>
                    <option value="1.25">1.25x</option>
                    <option value="1.5">1.5x</option>
                    <option value="2">2.0x</option>
                </select>
                <button onClick={alternarLeitura} className={lendo ? "btn-stop" : "btn-play"}>
                    {lendo ? "⏹️ Parar" : "🔊 Ouvir"}
                </button>
            </div>
        </div>

        <hr style={{margin: '0 0 20px 0', border: 0, borderTop: '1px solid #eee'}}/>

        {/* TEXTO BÍBLICO */}
        {carregando ? <div className="loading">Carregando palavra...</div> : erro ? <div style={{color:'red', textAlign:'center'}}>{erro}</div> : (
            <div className="versiculos-lista">
                {versiculos.map((v) => {
                    const dados = getDadosVerso(v.verse)
                    return (
                        <div 
                            key={v.verse} 
                            className={`versiculo ${dados.cor ? `bg-${dados.cor}` : ''}`} 
                            onClick={() => abrirEditor(v.verse)}
                            title={podeAnotar ? "Clique para editar" : "Faça login para anotar"}
                            style={{cursor: podeAnotar ? 'pointer' : 'default'}}
                        >
                            <span className="v-numero">{v.verse}</span> {v.text}
                            {dados.nota && <span className="nota-usuario">📝 {dados.nota}</span>}
                        </div>
                    )
                })}
            </div>
        )}

        {/* --- NAVEGAÇÃO RODAPÉ --- */}
        <div className="nav-capitulos">
            <button 
                className="btn-nav" 
                onClick={irParaAnterior} 
                disabled={ehGenesis1}
                style={{opacity: ehGenesis1 ? 0.5 : 1}}
            >
                ❮ Anterior
            </button>
            
            <button 
                className="btn-nav" 
                onClick={irParaProximo} 
                disabled={ehApocalipse22}
                style={{opacity: ehApocalipse22 ? 0.5 : 1}}
            >
                Próximo ❯
            </button>
        </div>

      </div>

      {/* MODAL DE EDIÇÃO */}
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
                <textarea className="input-nota" rows="3" placeholder="Sua reflexão..." value={tempNota} onChange={(e) => setTempNota(e.target.value)}></textarea>
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