import React, { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import '../../App.css'

function GerenciarUsuarios() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [usuarios, setUsuarios] = useState([])

  // Proteção: Se não for admin, chuta para home
  useEffect(() => {
    if (!user || user.role !== 'ADMIN') {
        alert("Acesso negado.")
        navigate('/')
    } else {
        carregarUsuarios()
    }
  }, [user])

  const carregarUsuarios = () => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080'
    fetch(`${apiUrl}/api/usuarios`)
      .then(res => res.json())
      .then(data => setUsuarios(data))
      .catch(console.error)
  }

  const alterarPermissao = (id, roleAtual) => {
    const novaRole = roleAtual === 'ADMIN' ? 'MEMBER' : 'ADMIN'
    const acao = novaRole === 'ADMIN' ? 'promover para PASTOR/ADMIN' : 'rebaixar para MEMBRO'
    
    if (confirm(`Tem certeza que deseja ${acao}?`)) {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080'
        
        fetch(`${apiUrl}/api/usuarios/${id}/role`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(novaRole)
        })
        .then(() => {
            alert("Permissão alterada com sucesso!")
            carregarUsuarios()
        })
    }
  }

  return (
    <div className="main-content">
      <h1 className="page-title">Gerenciar Usuários</h1>
      
      <div className="cards-grid">
        {usuarios.map(u => (
            <div key={u.id} className="card" style={{borderLeft: u.role === 'ADMIN' ? '4px solid #2b0505' : '4px solid #ccc'}}>
                <h3>{u.nome}</h3>
                <p>{u.email}</p>
                <p><strong>Status:</strong> {u.role === 'ADMIN' ? 'Pastor/Admin' : 'Membro'}</p>
                
                {/* Não permite alterar o próprio usuário para não se trancar para fora */}
                {u.email !== user?.email && (
                    <div className="card-actions">
                        <button 
                            className={u.role === 'ADMIN' ? 'btn-delete' : 'btn-save'}
                            onClick={() => alterarPermissao(u.id, u.role)}
                        >
                            {u.role === 'ADMIN' ? 'Remover Admin' : 'Tornar Admin'}
                        </button>
                    </div>
                )}
            </div>
        ))}
      </div>
    </div>
  )
}

export default GerenciarUsuarios