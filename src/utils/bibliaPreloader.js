import { BIBLIA_COMPLETA, BIBLIA_CRONOLOGICA } from './dadosBiblia'

export const preCarregarLeituraDiaria = async () => {
  console.log("🔄 Iniciando pré-carregamento da Bíblia em background...")

  // 1. Ler a configuração salva do usuário
  const configSalva = localStorage.getItem('cemv_plano')
  
  // Configuração padrão caso não tenha nada salvo
  const config = configSalva ? JSON.parse(configSalva) : {
    diasPlano: 365,
    capitulosLidos: 0,
    dataInicio: new Date().toISOString().split('T')[0],
    tipoOrdem: 'BIBLICA'
  }

  // 2. Determinar qual lista usar
  const listaAtual = config.tipoOrdem === 'CRONOLOGICA' ? BIBLIA_CRONOLOGICA : BIBLIA_COMPLETA
  
  // 3. Calcular a meta de hoje (Igual fizemos no PlanoLeitura)
  const capsPorDia = Math.ceil(1189 / config.diasPlano)
  
  // Descobre onde o usuário está
  // Se ele já leu 10, o próximo lote começa no 10
  const inicioBatch = Math.floor(config.capitulosLidos / capsPorDia) * capsPorDia
  
  // Vamos baixar os capítulos de HOJE e também os de AMANHÃ (para garantir)
  // Baixa ex: 8 capítulos (4 de hoje + 4 de amanhã)
  const qtdParaBaixar = capsPorDia * 2 
  const capitulosParaBaixar = listaAtual.slice(inicioBatch, inicioBatch + qtdParaBaixar)

  if (capitulosParaBaixar.length === 0) return

  // 4. Disparar downloads em paralelo
  const promessas = capitulosParaBaixar.map(async (item) => {
    const chaveCache = `biblia_${item.livro}_${item.cap}`
    
    // Só baixa se NÃO tiver no cache ainda
    if (!sessionStorage.getItem(chaveCache)) {
      try {
        const response = await fetch(`https://bible-api.com/${item.livro}+${item.cap}?translation=almeida`)
        if (response.ok) {
          const data = await response.json()
          // Salva no mesmo lugar que o LeitorBiblia.jsx procura!
          sessionStorage.setItem(chaveCache, JSON.stringify(data.verses))
        }
      } catch (error) {
        console.warn(`Falha ao pré-carregar ${item.livro} ${item.cap}`, error)
      }
    }
  })

  // Espera tudo (opcional, pois roda em background)
  await Promise.all(promessas)
  console.log(`✅ Pré-carregamento concluído: ${capitulosParaBaixar.length} capítulos prontos.`)
}