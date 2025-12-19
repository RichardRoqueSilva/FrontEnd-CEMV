import { useState, useEffect } from 'react'
import { BIBLIA_COMPLETA, BIBLIA_CRONOLOGICA } from '../../utils/dadosBiblia'
import './PlanoLeitura.css'

function PlanoLeitura({ aoSelecionarCapitulo, podeRegistrar }) {
  
  const pegarDataHojeLocal = () => {
    const hoje = new Date()
    const offset = hoje.getTimezoneOffset()
    const dataLocal = new Date(hoje.getTime() - (offset * 60 * 1000))
    return dataLocal.toISOString().split('T')[0]
  }

  const [config, setConfig] = useState(() => {
    const salvo = localStorage.getItem('cemv_plano')
    return salvo ? JSON.parse(salvo) : {
      diasPlano: 365,
      capitulosLidos: 0,
      dataInicio: pegarDataHojeLocal(),
      tipoOrdem: 'BIBLICA'
    }
  })

  const [planoAberto, setPlanoAberto] = useState(false)
  const [dataConsulta, setDataConsulta] = useState(pegarDataHojeLocal())

  useEffect(() => {
    localStorage.setItem('cemv_plano', JSON.stringify(config))
  }, [config])

  const listaAtual = config.tipoOrdem === 'CRONOLOGICA' ? BIBLIA_CRONOLOGICA : BIBLIA_COMPLETA
  const capsPorDia = Math.ceil(1189 / config.diasPlano)
  const porcentagem = Math.min(100, Math.floor((config.capitulosLidos / 1189) * 100))

  const indiceDiaAtual = Math.floor(config.capitulosLidos / capsPorDia)
  const inicioBatch = indiceDiaAtual * capsPorDia
  const fimBatch = inicioBatch + capsPorDia
  const capitulosDoDia = listaAtual.slice(inicioBatch, fimBatch)

  const calcularMetaDoDiaCalendario = (data) => {
    const inicioParts = config.dataInicio.split('-')
    const dataInicio = new Date(inicioParts[0], inicioParts[1] - 1, inicioParts[2])
    const atualParts = data.split('-')
    const dataAtual = new Date(atualParts[0], atualParts[1] - 1, atualParts[2])
    const diffDias = Math.floor((dataAtual - dataInicio) / (1000 * 60 * 60 * 24))
    
    if (diffDias < 0) return []
    const idx = diffDias * capsPorDia
    return listaAtual.slice(idx, idx + capsPorDia)
  }
  const metaCalendario = calcularMetaDoDiaCalendario(dataConsulta)

  const toggleCapitulo = (indexNoBatch) => {
    if (!podeRegistrar) return alert("Faça login para marcar a leitura.")

    const indiceReal = inicioBatch + indexNoBatch

    if (indiceReal === config.capitulosLidos) {
        setConfig(prev => ({ ...prev, capitulosLidos: prev.capitulosLidos + 1 }))
    } else if (indiceReal === config.capitulosLidos - 1) {
        setConfig(prev => ({ ...prev, capitulosLidos: prev.capitulosLidos - 1 }))
    } else {
        // Se clicar fora de ordem, apenas avisa ou ignora
        // alert("Por favor, marque os capítulos na ordem.")
    }
  }

  const reiniciarPlano = () => {
    if(confirm("Deseja reiniciar seu plano do zero?")) {
        setConfig({
            diasPlano: 365,
            capitulosLidos: 0,
            dataInicio: pegarDataHojeLocal(),
            tipoOrdem: 'BIBLICA'
        })
    }
  }

  return (
    <div className="plano-container card">
      <div 
        className="plano-header" 
        onClick={() => setPlanoAberto(!planoAberto)}
        title={planoAberto ? "Esconder" : "Ver Plano"}
      >
        <div className="plano-titulo-wrapper">
            <h2>📅 Plano de Leitura</h2>
            <span className={`seta-plano ${planoAberto ? 'aberta' : ''}`}>▼</span>
        </div>
      </div>

      {planoAberto && (
        <div className="plano-conteudo-animado">
            {/* Configuração */}
            <div className="plano-config">
                <div>
                    <label>Ordem:</label>
                    <select 
                        value={config.tipoOrdem || 'BIBLICA'} 
                        onChange={(e) => setConfig({...config, tipoOrdem: e.target.value})}
                        className="select-plano"
                    >
                        <option value="BIBLICA">Bíblica (Gênesis a Apocalipse)</option>
                        <option value="CRONOLOGICA">Cronológica (Histórica)</option>
                    </select>
                </div>
                <div>
                    <label>Meta:</label>
                    <select 
                        value={config.diasPlano} 
                        onChange={(e) => setConfig({...config, diasPlano: Number(e.target.value)})}
                        className="select-plano"
                    >
                        <option value={365}>1 Ano</option>
                        <option value={180}>6 Meses</option>
                        <option value={90}>3 Meses</option>
                    </select>
                </div>
                <div>
                    <label>Início:</label>
                    <input 
                        type="date" 
                        value={config.dataInicio}
                        onChange={(e) => setConfig({...config, dataInicio: e.target.value})}
                        className="input-data"
                    />
                </div>
            </div>

            <div className="barra-progresso-container">
                <div className="barra-progresso-fill" style={{width: `${porcentagem}%`}}></div>
                <span className="barra-texto">{porcentagem}% Concluído ({config.capitulosLidos}/1189)</span>
            </div>

            {/* --- ÁREA DE LEITURA ATUAL (BOTÕES DUPLOS) --- */}
            <div className="meta-leitura atual">
                {config.capitulosLidos >= 1189 ? (
                    <div className="concluido-msg">
                        <h3>🏆 PARABÉNS!</h3>
                        <p>Bíblia Concluída!</p>
                        <button className="btn-edit" onClick={() => setConfig({...config, capitulosLidos: 0})}>Reiniciar</button>
                    </div>
                ) : (
                    <>
                        <p className="meta-titulo">
                            Sua Meta de Hoje (Dia {indiceDiaAtual + 1}):
                        </p>
                        <div className="meta-lista">
                            {capitulosDoDia.map((item, index) => {
                                const estaLido = (inicioBatch + index) < config.capitulosLidos
                                
                                return (
                                    <div key={index} className={`chip-split ${estaLido ? 'lido' : ''}`}>
                                        
                                        {/* LADO ESQUERDO: Checkbox (Marca/Desmarca) */}
                                        <div 
                                            className="chip-part-check"
                                            onClick={() => toggleCapitulo(index)}
                                            title={estaLido ? "Desmarcar" : "Marcar como concluído"}
                                        >
                                            {estaLido ? '✅' : '⬜'}
                                        </div>

                                        {/* LADO DIREITO: Texto (Abre o Leitor) */}
                                        <div 
                                            className="chip-part-text"
                                            onClick={() => aoSelecionarCapitulo(item.livro, item.cap)}
                                            title="Ler este capítulo agora"
                                        >
                                            {item.livro} {item.cap}
                                        </div>

                                    </div>
                                )
                            })}
                        </div>
                        <p style={{fontSize:'0.8rem', color:'#888', marginTop:'10px'}}>
                            * Clique no <b>quadrado</b> para marcar e no <b>nome</b> para ler.
                        </p>
                    </>
                )}
            </div>

            {/* Calendário de Consulta */}
            <div className="calendario-area">
                <hr className="divisor-leve"/>
                <div style={{display:'flex', justifyContent:'center', alignItems:'center', gap:'10px', marginBottom:'10px'}}>
                    <label style={{marginBottom:0, fontSize:'0.9rem'}}>Consultar datas:</label>
                    <input 
                        type="date" 
                        value={dataConsulta} 
                        onChange={(e) => setDataConsulta(e.target.value)}
                        className="input-data destaque"
                    />
                </div>
                
                <div className="meta-lista pequena">
                    {metaCalendario.map((item, index) => (
                        <span key={index} className="chip-simples">
                            {item.livro} {item.cap}
                        </span>
                    ))}
                </div>
            </div>
        </div>
      )}
    </div>
  )
}

export default PlanoLeitura