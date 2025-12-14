import { useState, useEffect } from 'react'
import { BIBLIA_COMPLETA, BIBLIA_CRONOLOGICA } from '../../utils/dadosBiblia'
import './PlanoLeitura.css'

function PlanoLeitura({ aoSelecionarCapitulo }) {
  
  // Função auxiliar para pegar a data de HOJE no formato YYYY-MM-DD local (Brasil)
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
      dataInicio: pegarDataHojeLocal(), // Usa data local corrigida
      tipoOrdem: 'BIBLICA'
    }
  })

  const [planoAberto, setPlanoAberto] = useState(false)
  const [dataConsulta, setDataConsulta] = useState(pegarDataHojeLocal()) // Inicia com hoje

  useEffect(() => {
    localStorage.setItem('cemv_plano', JSON.stringify(config))
  }, [config])

  const listaAtual = config.tipoOrdem === 'CRONOLOGICA' ? BIBLIA_CRONOLOGICA : BIBLIA_COMPLETA
  const capsPorDia = Math.ceil(1189 / config.diasPlano)
  const porcentagem = Math.min(100, Math.floor((config.capitulosLidos / 1189) * 100))

  // --- CÁLCULO DE DIAS CORRIGIDO (Ignora horas para não errar o dia) ---
  const calcularMetaDoDia = (data) => {
    // Cria datas "limpas" (meia-noite) para evitar erro de fuso horário
    const inicioParts = config.dataInicio.split('-')
    const dataInicio = new Date(inicioParts[0], inicioParts[1] - 1, inicioParts[2])

    const atualParts = data.split('-')
    const dataAtual = new Date(atualParts[0], atualParts[1] - 1, atualParts[2])
    
    // Diferença em milissegundos
    const diffTempo = dataAtual - dataInicio
    // Converte para dias (arredondando para baixo para ser exato)
    const diffDias = Math.floor(diffTempo / (1000 * 60 * 60 * 24))
    
    if (diffDias < 0) return []

    const indiceInicial = diffDias * capsPorDia
    return listaAtual.slice(indiceInicial, indiceInicial + capsPorDia)
  }

  const metaCalendario = calcularMetaDoDia(dataConsulta)

  const marcarComoLido = () => {
    if (config.capitulosLidos >= 1189) return alert("Parabéns! Bíblia Concluída!")
    setConfig(prev => ({
      ...prev,
      capitulosLidos: Math.min(1189, prev.capitulosLidos + capsPorDia)
    }))
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
            {/* Configuração do Plano */}
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
                        <option value={365}>1 Ano (Anual)</option>
                        <option value={180}>6 Meses</option>
                        <option value={90}>3 Meses</option>
                    </select>
                </div>
                
                {/* AQUI ESTÁ O INICIADOR QUE VOCÊ PEDIU */}
                <div>
                    <label>Início do Plano:</label>
                    <input 
                        type="date" 
                        value={config.dataInicio}
                        onChange={(e) => setConfig({...config, dataInicio: e.target.value})}
                        className="input-data"
                    />
                </div>
            </div>

            {/* Barra de Progresso */}
            <div className="barra-progresso-container">
                <div className="barra-progresso-fill" style={{width: `${porcentagem}%`}}></div>
                <span className="barra-texto">{porcentagem}% Concluído ({config.capitulosLidos}/1189)</span>
            </div>

            {/* Calendário de Consulta */}
            <div className="calendario-area">
                <hr className="divisor-leve"/>
                
                <div style={{display:'flex', justifyContent:'center', alignItems:'center', gap:'10px', marginBottom:'15px'}}>
                    <label style={{marginBottom:0}}>Ver leitura do dia:</label>
                    <input 
                        type="date" 
                        value={dataConsulta} 
                        onChange={(e) => setDataConsulta(e.target.value)}
                        className="input-data destaque"
                    />
                </div>
                
                <div className="meta-leitura">
                    {metaCalendario.length > 0 ? (
                        <>
                            <p className="meta-titulo">
                                Leitura para {new Date(dataConsulta.split('-')).toLocaleDateString('pt-BR')} <br/>
                                <small style={{fontWeight:'normal', fontSize:'0.9rem'}}>
                                    (Ordem {config.tipoOrdem === 'CRONOLOGICA' ? 'Cronológica' : 'Bíblica'})
                                </small>
                            </p>
                            
                            <div className="meta-lista">
                                {metaCalendario.map((item, index) => (
                                    <button 
                                        key={index} 
                                        className="chip-capitulo"
                                        onClick={() => aoSelecionarCapitulo(item.livro, item.cap)}
                                    >
                                        {item.livro} {item.cap}
                                    </button>
                                ))}
                            </div>
                        </>
                    ) : (
                        <p style={{color: '#999'}}>
                            Esta data é anterior ao início do seu plano ({new Date(config.dataInicio.split('-')).toLocaleDateString('pt-BR')}).
                        </p>
                    )}

                    <button className="btn-save" onClick={marcarComoLido}>
                        ✅ Marcar Leitura de Hoje como Lida
                    </button>
                    
                    {config.capitulosLidos > 0 && (
                         <button className="btn-link" style={{fontSize: '0.8rem', marginTop:'10px', alignSelf:'center'}} onClick={reiniciarPlano}>
                            Reiniciar Plano
                         </button>
                    )}
                </div>
            </div>
        </div>
      )}
    </div>
  )
}

export default PlanoLeitura