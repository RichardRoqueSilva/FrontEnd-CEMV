import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Louvores from './pages/Louvores'
import Biblia from './pages/Biblia'
import Contato from './pages/Contato' 
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <div className="container">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/louvores" element={<Louvores />} />    
          <Route path="/biblia" element={<Biblia />} />
          <Route path="/cultos" element={<div className="main-content"><h1>Cultos</h1></div>} />
          <Route path="/contato" element={<Contato />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App