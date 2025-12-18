import { useState, useEffect } from 'react'
import CardLouvor from '../components/louvores/CardLouvor'
import FormLouvor from '../components/louvores/FormLouvor'
import ModalLetra from '../components/louvores/ModalLetra'
import { useAuth } from '../context/AuthContext' // <--- Importar Contexto
import '../App.css'

function Louvores() {
  const { user } = useAuth() // Pega o usuário logado
  const isAdmin = user?.role === 'ADMIN' // Verifica permissão

  const [louvores, setLouvores] = useState([])
  const [busca, setBusca] = useState('')
  const [filtroEstilo, setFiltroEstilo] = useState('TODOS')
  
  const [mostrarForm, setMostrarForm] = useState(false)
  const [louvorModal, setLouvorModal] = useState(null)

  const [form, setForm] = useState({
    id: null, nomeMusica: '', nomeCantor: '', estilo: 'AGITADA', letra: ''
  })

  useEffect(() => { carregarLouvores() }, [])

  const carregarLouvores = () => {
    // Usar variável de ambiente ou localhost
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080'
    fetch(`${apiUrl}/api/louvores`)
      .then(res => res.json())
      .then(data => setLouvores(data))
      .catch(err => console.error(err))
  }

  const handleSalvar = (e) => {
    e.preventDefault()
    // Segurança extra: não deixa salvar se não for admin
    if (!isAdmin) return alert("Apenas administradores podem realizar esta ação.")

    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080'
    const metodo = form.id ? 'PUT' : 'POST'
    const url = form.id ? `${apiUrl}/api/louvores/${form.id}` : `${apiUrl}/api/louvores`

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
    if (!isAdmin) return // Segurança
    if (confirm('Tem certeza?')) {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080'
      fetch(`${apiUrl}/api/louvores/${id}`, { method: 'DELETE' })
        .then(() => carregarLouvores())
    }
  }

  const handleEditar = (louvor) => {
    if (!isAdmin) return // Segurança
    setForm({ ...louvor, letra: louvor.letra || '' }) 
    setMostrarForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const limparForm = () => {
    setForm({ id: null, nomeMusica: '', nomeCantor: '', estilo: 'AGITADA', letra: '' })
  }

  const louvoresFiltrados = louvores.filter(l => {
    const texto = busca.toLowerCase()
    const matchTexto = l.nomeMusica.toLowerCase().includes(texto) || l.nomeCantor.toLowerCase().includes(texto) || (l.letra && l.letra.toLowerCase().includes(texto))
    const matchEstilo = filtroEstilo === 'TODOS' || l.estilo === filtroEstilo
    return matchTexto && matchEstilo
  })

  return (
    <div className="main-content">
      <h1 className="page-title">Ministério de Louvor</h1>

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
        
        {/* BOTÃO NOVO: Só aparece para ADMIN */}
        {isAdmin && (
            <button className="btn-primary" onClick={() => { limparForm(); setMostrarForm(!mostrarForm) }}>
            {mostrarForm ? 'Cancelar' : '+ Novo'}
            </button>
        )}
      </div>

      {mostrarForm && isAdmin && (
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
            aoVerLetra={setLouvorModal}
            adminMode={isAdmin} // <--- Passa a permissão para o card
          />
        ))}
      </div>

      <ModalLetra 
        louvor={louvorModal} 
        aoFechar={() => setLouvorModal(null)} 
      />
    </div>
  )
}

export default Louvores