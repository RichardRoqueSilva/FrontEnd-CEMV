import { createContext, useState, useEffect, useContext } from 'react';
import { preCarregarLeituraDiaria } from '../utils/bibliaPreloader'; // <--- IMPORTANTE

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // null = Visitante

  useEffect(() => {
    // Ao abrir o site, verifica se tem usuário salvo
    const savedUser = localStorage.getItem('cemv_user');
    
    if (savedUser) {
      setUser(JSON.parse(savedUser));

      // --- PERFORMANCE: PRÉ-CARREGAMENTO ---
      // Se o usuário já está logado, esperamos 1 segundo (para o site renderizar)
      // e então começamos a baixar os capítulos da Bíblia de hoje em background.
      setTimeout(() => {
          preCarregarLeituraDiaria();
      }, 1000);
    }
  }, []);

  const login = async (email, senha) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080'
      const response = await fetch(`${apiUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha })
      });

      if (response.ok) {
        const data = await response.json(); 
        // data agora contém: { token, nome, role, email }
        
        setUser(data);
        localStorage.setItem('cemv_user', JSON.stringify(data));
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error("Erro no login:", error);
      return false;
    }
  };

  const logout = () => {
    if (window.confirm("Tem certeza que deseja sair da sua conta?")) {
        setUser(null);
        localStorage.removeItem('cemv_user');
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}