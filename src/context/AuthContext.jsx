import { createContext, useState, useEffect, useContext } from 'react';
import { preCarregarLeituraDiaria } from '../utils/bibliaPreloader';
import Swal from 'sweetalert2'; // <--- 1. IMPORTAR AQUI

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('cemv_user');
    
    if (savedUser) {
      setUser(JSON.parse(savedUser));
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
        const userData = await response.json();
        setUser(userData);
        localStorage.setItem('cemv_user', JSON.stringify(userData));
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error("Erro no login:", error);
      return false;
    }
  };

  // --- 2. FUNÇÃO LOGOUT ATUALIZADA (COM SWEETALERT) ---
  const logout = () => {
    Swal.fire({
      title: 'Deseja sair?',
      text: "Você precisará fazer login novamente para acessar a área administrativa.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#2b0505', // Vinho (Cor da Igreja)
      cancelButtonColor: '#6c757d',  // Cinza
      confirmButtonText: 'Sim, sair',
      cancelButtonText: 'Cancelar',
      background: '#fff',
      iconColor: '#f1c40f' // Dourado
    }).then((result) => {
      if (result.isConfirmed) {
        setUser(null);
        localStorage.removeItem('cemv_user');
        
        // Opcional: Feedback visual de saída
        const Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true
        });
        Toast.fire({
          icon: 'success',
          title: 'Logout realizado com sucesso'
        });
      }
    });
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