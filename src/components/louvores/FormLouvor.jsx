import React from 'react'
import './FormLouvor.css'

function FormLouvor({ form, setForm, aoSalvar, aoCancelar }) {
  return (
    <form className="form-box" onSubmit={aoSalvar}>
      <h2>{form.id ? 'Editar' : 'Cadastrar'} Louvor</h2>
      
      <input 
        type="text" placeholder="Nome da Música" required 
        value={form.nomeMusica}
        onChange={e => setForm({...form, nomeMusica: e.target.value})} 
      />
      
      <input 
        type="text" placeholder="Nome do Cantor/Banda" required 
        value={form.nomeCantor}
        onChange={e => setForm({...form, nomeCantor: e.target.value})} 
      />
      
      <select 
        value={form.estilo} 
        onChange={e => setForm({...form, estilo: e.target.value})}
      >
        <option value="AGITADA">Agitada</option>
        <option value="LENTA">Lenta</option>
      </select>

      <textarea 
        placeholder="Cole a letra da música aqui..." 
        rows="5" 
        value={form.letra}
        onChange={e => setForm({...form, letra: e.target.value})} 
        className="textarea-letra"
      ></textarea>

      <div style={{display: 'flex', gap: '10px'}}>
        <button type="button" className="btn-cancel" onClick={aoCancelar}>Cancelar</button>
        <button type="submit" className="btn-save">Salvar</button>
      </div>
    </form>
  )
}

export default FormLouvor