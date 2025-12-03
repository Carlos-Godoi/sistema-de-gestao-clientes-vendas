import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { LoginData, RegisterData } from '../types/UserTypes';

// --- Componente para Login e Cadastro ---

export const UserForm: React.FC = () => {
  const { login, register, isLoading, error } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState<LoginData | RegisterData>({
    email: '',
    password: '',
    name: '', // Apenas para cadastro
  });
  const [message, setMessage] = useState<string | null>(null);
  
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    
    try {
      if (isLogin) {
        await login(formData as LoginData);
        setMessage('Login realizado com sucesso!');
      } else {
        // Envia apenas os campos necessários para o registro
        const { name, email, password } = formData as RegisterData;
        await register({ name, email, password }); 
        setMessage('Cadastro e Login realizados com sucesso!');
      }
    } catch (err: any) {
      // O erro já está no estado do AuthContext, mas podemos pegar a mensagem do throw
      setMessage(err.message || 'Ocorreu um erro.');
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-xl rounded-xl">
      <h2 className="text-3xl font-bold text-center mb-6 text-indigo-700">
        {isLogin ? 'Entrar no Sistema' : 'Novo Cadastro'}
      </h2>
      
      {message && (
        <div className={`p-3 mb-4 rounded-lg ${error ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {!isLogin && (
          <input
            type="text"
            name="name"
            placeholder="Nome Completo"
            onChange={handleChange}
            required={!isLogin}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 transition duration-150"
          />
        )}
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          required
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 transition duration-150"
        />
        <input
          type="password"
          name="password"
          placeholder="Senha"
          onChange={handleChange}
          required
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 transition duration-150"
        />

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 px-4 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Processando...' : isLogin ? 'Fazer Login' : 'Cadastrar e Entrar'}
        </button>
      </form>

      <div className="mt-6 text-center">
        <button
          onClick={() => {
            setIsLogin(!isLogin);
            //setError(null);
            setMessage(null);
          }}
          className="text-indigo-600 hover:text-indigo-800 transition duration-150 text-sm"
        >
          {isLogin ? 'Precisa de uma conta? Cadastre-se' : 'Já tem uma conta? Faça login'}
        </button>
      </div>
    </div>
  );
};