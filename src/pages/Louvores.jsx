import { useState, useEffect } from 'react'
import CardLouvor from '../components/louvores/CardLouvor'
import FormLouvor from '../components/louvores/FormLouvor'
import ModalLetra from '../components/louvores/ModalLetra'

// Note: Não importamos CSS aqui, pois cada componente já tem o seu
// Apenas o CSS global de layout (grids) que ainda pode estar no App.css

function Louvores() {
  const [louvores, setLouvores] = useState([])
  const [busca, setBusca] = useState('')
  const [filtroEstilo, setFiltroEstilo] = useState('TODOS')
  
  const [mostrarForm, setMostrarForm] = useState(false)
  const [louvorModal, setLouvorModal] = useState(null) // Para o Modal

  const [form, setForm] = useState({
    id: null, nomeMusica: '', nomeCantor: '', estilo: 'AGITADA', letra: ''
  })

  useEffect(() => { carregarLouvores() }, [])

  const carregarLouvores = () => {
    fetch('http://localhost:8080/api/louvores')
      .then(res => res.json())
      .then(data => setLouvores(data))
      .catch(err => console.error(err))
  }

  const handleSalvar = (e) => {
    e.preventDefault()
    const metodo = form.id ? 'PUT' : 'POST'
    const url = form.id ? `http://localhost:8080/api/louvores/${form.id}` : 'http://localhost:8080/api/louvores'

    fetch(url, {
      method: metodo,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
    .then(res => { if(res.ok) return res.json(); throw new Error() })
    .then(() => {
      alert('Salvo com sucesso!')
      setMostrarForm(false)
      limparForm()
      carregarLouvores()
    })
    .catch(() => alert('Erro ao salvar.'))
  }

  const handleExcluir = (id) => {
    if (confirm('Tem certeza?')) {
      fetch(`http://localhost:8080/api/louvores/${id}`, { method: 'DELETE' })
        .then(() => carregarLouvores())
    }
  }

  const handleEditar = (louvor) => {
    setForm({ ...louvor, letra: louvor.letra || '' }) 
    setMostrarForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const limparForm = () => {
    setForm({ id: null, nomeMusica: '', nomeCantor: '', estilo: 'AGITADA', letra: '' })
  }

  // Lógica de Filtro
  const louvoresFiltrados = louvores.filter(l => {
    const texto = busca.toLowerCase()
    const matchTexto = l.nomeMusica.toLowerCase().includes(texto) || l.nomeCantor.toLowerCase().includes(texto) || (l.letra && l.letra.toLowerCase().includes(texto))
    const matchEstilo = filtroEstilo === 'TODOS' || l.estilo === filtroEstilo
    return matchTexto && matchEstilo
  })

  return (
    <div className="main-content">
      <h1>Ministério de Louvor</h1>

      {/* Barra de Ações (Pode virar componente depois se quiser) */}
      <div className="actions-bar">
        <input 
          type="text" placeholder="Buscar música, cantor ou trecho..." 
          value={busca} onChange={(e) => setBusca(e.target.value)}
          className="search-input"
        />
        <select className="filter-select" value={filtroEstilo} onChange={(e) => setFiltroEstilo(e.target.value)}>
            <option value="TODOS">Todos os Estilos</option>
            <option value="AGITADA">Agitadas</option>
            <option value="LENTA">Lentas</option>
        </select>
        <button className="btn-primary" onClick={() => { limparForm(); setMostrarForm(!mostrarForm) }}>
          {mostrarForm ? 'Cancelar' : '+ Novo'}
        </button>
      </div>

      {/* Renderiza o Formulário ou a Lista */}
      {mostrarForm && (
        <FormLouvor 
            form={form} 
            setForm={setForm} 
            aoSalvar={handleSalvar} 
            aoCancelar={() => setMostrarForm(false)} 
        />
      )}

      <div className="cards-grid">
        {louvoresFiltrados.length === 0 && <p style={{textAlign:'center'}}>Nenhum louvor encontrado.</p>}
        
        {louvoresFiltrados.map((louvor) => (
          <CardLouvor 
            key={louvor.id} 
            louvor={louvor}
            aoEditar={handleEditar}
            aoExcluir={handleExcluir}
            aoVerLetra={setLouvorModal} // Passa a função que abre o modal
          />
        ))}
      </div>

      {/* Modal fica aqui quietinho esperando ser chamado */}
      <ModalLetra 
        louvor={louvorModal} 
        aoFechar={() => setLouvorModal(null)} 
      />

    </div>
  )
}

export default Louvores