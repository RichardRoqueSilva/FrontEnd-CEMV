import { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('cemv_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // LOGIN REAL
  const login = async (email, senha) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080'
      const response = await fetch(`${apiUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha })
      });

      if (response.ok) {
        const userData = await response.json(); // Recebe { nome, role, email... } do Java
        setUser(userData);
        localStorage.setItem('cemv_user', JSON.stringify(userData));
        return true; // Sucesso
      } else {
        return false; // Falha
      }
    } catch (error) {
      console.error("Erro no login:", error);
      return false;
    }
  };

  const logout = () => {
    // Confirmação antes de sair
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