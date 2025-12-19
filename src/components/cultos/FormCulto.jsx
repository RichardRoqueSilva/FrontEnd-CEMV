import React, { useState } from 'react'
import '../../App.css'

function FormCulto({ aoSalvar, aoCancelar }) {
  const [form, setForm] = useState({ urlImagem: '', descricao: '', tipo: 'PREGACAO' })
  const [preview, setPreview] = useState(null) // Para mostrar a foto antes de salvar

  // Função mágica que converte Arquivo -> Texto (Base64)
  const handleArquivo = (e) => {
    const file = e.target.files[0]
    
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        // O resultado é uma string gigante: "data:image/jpeg;base64,/9j/4AAQSk..."
        setForm({ ...form, urlImagem: reader.result })
        setPreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.urlImagem) return alert("Por favor, escolha uma imagem.")
    aoSalvar(form)
  }

  return (
    <form className="form-box" onSubmit={handleSubmit} style={{marginBottom:'40px'}}>
      <h3 style={{textAlign:'center', color:'#2b0505'}}>Adicionar Foto</h3>
      
      <label style={{fontWeight:'bold'}}>Categoria:</label>
      <select 
        value={form.tipo} 
        onChange={e => setForm({...form, tipo: e.target.value})}
        style={{width:'100%', padding:'10px', marginBottom:'15px', borderRadius:'4px', border:'1px solid #ddd'}}
      >
        <option value="PREGACAO">Momento da Pregação</option>
        <option value="LOUVOR">Momento do Louvor</option>
      </select>

      {/* CAMPO DE UPLOAD */}
      <label style={{fontWeight:'bold'}}>Escolher Imagem:</label>
      <input 
        type="file" 
        accept="image/*" // Aceita apenas imagens
        onChange={handleArquivo}
        style={{width:'100%', padding:'10px', marginBottom:'10px'}}
        required
      />

      {/* Pré-visualização da imagem */}
      {preview && (
        <div style={{textAlign:'center', marginBottom:'15px'}}>
            <img 
                src={preview} 
                alt="Prévia" 
                style={{maxWidth:'100%', maxHeight:'200px', borderRadius:'8px', border:'2px solid #ddd'}} 
            />
        </div>
      )}

      <label style={{fontWeight:'bold'}}>Legenda:</label>
      <textarea 
        rows="3" placeholder="Descrição do momento..." required
        value={form.descricao}
        onChange={e => setForm({...form, descricao: e.target.value})}
        style={{width:'100%', padding:'10px', borderRadius:'4px', border:'1px solid #ddd'}}
      ></textarea>

      <div style={{display:'flex', gap:'10px', marginTop:'15px', justifyContent:'flex-end'}}>
        <button type="button" className="btn-stop" onClick={aoCancelar}>Cancelar</button>
        <button type="submit" className="btn-save" style={{width:'auto'}}>Salvar</button>
      </div>
    </form>
  )
}

export default FormCulto