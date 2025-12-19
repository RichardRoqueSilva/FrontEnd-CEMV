import React, { useState, useEffect } from 'react'
import Carrossel from '../components/cultos/Carrossel'
import FormCulto from '../components/cultos/FormCulto'
import { useAuth } from '../context/AuthContext'
import '../App.css'

function Cultos() {
  const { user } = useAuth()
  // Verifica permissão (Pastor ou Admin)
  const isStaff = user?.role === 'PASTOR' || user?.role === 'ADMIN'

  const [cultos, setCultos] = useState([])
  const [mostrarForm, setMostrarForm] = useState(false)

  useEffect(() => {
    carregarCultos()
  }, [])

  const carregarCultos = () => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080'
    fetch(`${apiUrl}/api/cultos`)
      .then(res => res.json())
      .then(data => setCultos(data))
      .catch(console.error)
  }

  const handleSalvar = (dadosForm) => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080'
    
    fetch(`${apiUrl}/api/cultos`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify(dadosForm)
    })
    .then(res => {
        if(res.ok) {
            alert("Foto adicionada com sucesso!")
            setMostrarForm(false)
            carregarCultos()
        } else {
            alert("Erro ao salvar.")
        }
    })
  }

  const handleExcluir = (id) => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080'
    fetch(`${apiUrl}/api/cultos/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${user.token}` }
    })
    .then(() => carregarCultos())
  }

  // --- FILTROS (Separa os dados em duas listas) ---
  // Se o culto não tiver tipo (antigos), assume PREGACAO por padrão
  const listaPregacao = cultos.filter(c => c.tipo === 'PREGACAO' || !c.tipo)
  const listaLouvor = cultos.filter(c => c.tipo === 'LOUVOR')

  return (
    <div className="main-content">
      <h1 className="page-title">Momentos dos Cultos</h1>
      <p style={{textAlign: 'center', marginBottom: '30px', color: '#666'}}>
        Venha participar e ser abençoado pela palavra de Deus.
      </p>

      {/* BOTÃO DE ADICIONAR (Visível apenas para Staff) */}
      {isStaff && (
        <div style={{textAlign:'center', marginBottom:'40px'}}>
            <button className="btn-primary" onClick={() => setMostrarForm(!mostrarForm)}>
                {mostrarForm ? 'Cancelar' : '+ Adicionar Nova Foto'}
            </button>
        </div>
      )}

      {/* Formulário (Aparece ao clicar no botão) */}
      {mostrarForm && isStaff && (
        <FormCulto 
            aoSalvar={handleSalvar} 
            aoCancelar={() => setMostrarForm(false)} 
        />
      )}

      {/* --- CARROSSEL 1: PREGAÇÃO --- */}
      <section style={{marginBottom: '60px'}}>
        <Carrossel 
            titulo="Pregação" 
            dados={listaPregacao} 
            podeEditar={isStaff}
            aoExcluir={handleExcluir}
        />
      </section>

      {/* --- CARROSSEL 2: LOUVOR --- */}
      <section style={{marginBottom: '60px'}}>
        <Carrossel 
            titulo="Louvor" 
            dados={listaLouvor} 
            podeEditar={isStaff}
            aoExcluir={handleExcluir}
        />
      </section>

    </div>
  )
}

export default Cultos