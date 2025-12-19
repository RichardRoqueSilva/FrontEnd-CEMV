import React, { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import './GerenciarUsuarios.css'

function GerenciarUsuarios() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [usuarios, setUsuarios] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // SEGURANÇA: Só PASTOR entra aqui
    if (!user || user.role !== 'PASTOR') {
        alert("Área restrita à liderança pastoral.")
        navigate('/')
    } else {
        carregarUsuarios()
    }
  }, [user])

  const carregarUsuarios = () => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080'
    setLoading(true)
    
    fetch(`${apiUrl}/api/usuarios`, {
        method: 'GET',
        headers: {
            // --- ENVIO DO TOKEN JWT ---
            'Authorization': `Bearer ${user.token}`
        }
    })
      .then(res => {
          if (res.status === 403) throw new Error("Sem permissão.")
          return res.json()
      })
      .then(data => {
          // Ordena: Pastor primeiro, depois Admin, depois Membro
          const ordem = { 'PASTOR': 1, 'ADMIN': 2, 'MEMBER': 3 }
          const ordenados = data.sort((a, b) => ordem[a.role] - ordem[b.role])
          setUsuarios(ordenados)
          setLoading(false)
      })
      .catch(err => {
          console.error(err)
          alert("Erro ao carregar lista de usuários.")
          setLoading(false)
      })
  }

  const mudarCargo = (id, novoCargo, nomeUsuario) => {
    if (confirm(`Confirmar alteração de ${nomeUsuario} para ${novoCargo}?`)) {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080'
        
        fetch(`${apiUrl}/api/usuarios/${id}/role`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                // --- ENVIO DO TOKEN JWT ---
                'Authorization': `Bearer ${user.token}`
            },
            body: JSON.stringify(novoCargo) // Envia a string (ex: "ADMIN")
        })
        .then(res => {
            if (res.ok) {
                carregarUsuarios() // Recarrega a lista para atualizar a tela
            } else {
                alert("Erro ao alterar cargo.")
            }
        })
        .catch(err => alert("Erro de conexão."))
    }
  }

  return (
    <div className="main-content">
      <h1 className="page-title">Gestão Pastoral</h1>
      
      {loading ? (
          <p style={{textAlign:'center'}}>Carregando equipe...</p>
      ) : (
          <div className="gestao-container">
            <div className="users-grid">
                {usuarios.map(u => (
                    <div key={u.id} className={`user-card ${u.role.toLowerCase()}`}>
                        <div className="user-header">
                            <div className="user-avatar">
                                {u.role === 'PASTOR' ? '✝️' : u.role === 'ADMIN' ? '🛠️' : '👤'}
                            </div>
                            
                            {/* BADGES */}
                            {u.role === 'PASTOR' && <span className="badge badge-pastor">Pastor</span>}
                            {u.role === 'ADMIN' && <span className="badge badge-admin">Liderança/Mídia</span>}
                            {u.role === 'MEMBER' && <span className="badge badge-member">Membro</span>}
                        </div>

                        <div className="user-info">
                            <h3>{u.nome}</h3>
                            <span className="user-email">{u.email}</span>
                        </div>
                        
                        <div className="user-actions">
                            {/* Não permite alterar o próprio cargo para evitar trancar a si mesmo fora */}
                            {u.email === user?.email ? (
                                <span className="user-self">Você (Logado)</span>
                            ) : (
                                <div style={{display:'flex', flexDirection:'column', gap:'5px'}}>
                                    <label style={{fontSize:'0.8rem', fontWeight:'bold', color:'#555'}}>Alterar Cargo:</label>
                                    <select 
                                        value={u.role} 
                                        onChange={(e) => mudarCargo(u.id, e.target.value, u.nome)}
                                        className="select-cargo"
                                    >
                                        <option value="MEMBER">Membro</option>
                                        <option value="ADMIN">Admin (Mídia)</option>
                                        <option value="PASTOR">Pastor</option>
                                    </select>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
          </div>
      )}
    </div>
  )
}

export default GerenciarUsuarios