import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { LoginData, RegisterData, UserData } from '../types/UserTypes'; 
import axios from 'axios';

// --- Tipos de dados (Tipagem Estática) ---
export interface AuthState {
  user: UserData | null;
  token: string | null;
  isAuthenticated: boolean;
}

export interface AuthContextType extends AuthState {
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
}

// 1. Criação do Contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 2. Provedor do Contexto (Context API)
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const API_URL = 'http://localhost:5000/api/auth';

  // Carregar dados de autenticação do localStorage ao iniciar
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      try {
        const user: UserData = JSON.parse(storedUser);
        setAuthState({
          user,
          token: storedToken,
          isAuthenticated: true,
        });
      } catch (e) {
        console.error('Erro ao restaurar usuário do localStorage', e);
        logout();
      }
    }
  }, []);

  const login = async (data: LoginData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${API_URL}/login`, data);
      const { token, user } = response.data;

      // Armazenar no localStorage (para persistência)
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      setAuthState({ user, token, isAuthenticated: true });
    } catch (err) {
      const message = axios.isAxiosError(err) 
        ? err.response?.data?.message || 'Falha no login.' 
        : 'Erro de conexão.';
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${API_URL}/register`, data);
      const { token, user } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      setAuthState({ user, token, isAuthenticated: true });
    } catch (err) {
      const message = axios.isAxiosError(err) 
        ? err.response?.data?.message || 'Falha no cadastro.' 
        : 'Erro de conexão.';
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setAuthState({ user: null, token: null, isAuthenticated: false });
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, register, logout, isLoading, error }}>
      {children}
    </AuthContext.Provider>
  );
};

// 3. Hook Customizado
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};