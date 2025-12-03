import React from 'react';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { UserForm } from './UserForm';

// --- Componente de Dashboard (Para usuários autenticados) ---
const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();

  if (!user) return null; // Não deve acontecer se isAuthenticated for true

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="bg-white p-8 shadow-2xl rounded-xl max-w-lg w-full">
        <h1 className="text-4xl font-extrabold text-indigo-700 mb-4">
          Bem-vindo, {user.name}!
        </h1>
        <p className="text-gray-600 mb-6">
          Você está logado com a permissão: <span className="font-semibold text-indigo-500">{user.role}</span>.
        </p>
        
        <div className="space-y-3 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
            <p className="text-sm text-gray-700"><span className="font-medium">ID de Usuário:</span> {user.id}</p>
            <p className="text-sm text-gray-700"><span className="font-medium">Email:</span> {user.email}</p>
        </div>

        <h2 className="text-xl font-semibold mt-8 text-gray-800">Próximos Passos do Projeto:</h2>
        <ul className="list-disc list-inside text-gray-600 mt-2 space-y-1">
            <li>Desenvolver Modelos de Clientes, Produtos e Pedidos.</li>
            <li>Implementar Rotas de CRUD (Criação, Leitura, Atualização, Deleção) para as novas entidades.</li>
            <li>Criar a lógica complexa de Geração de Faturas Eletrônicas!</li>
            <li>Implementar Testes Unitários e de Integração (Jest/Supertest).</li>
        </ul>

        <button
          onClick={logout}
          className="mt-8 w-full py-3 px-4 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition duration-300 shadow-lg"
        >
          Sair (Logout)
        </button>
      </div>
    </div>
  );
};


// --- Componente Raiz ---
const AppContent: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-4xl">
        {isAuthenticated ? <Dashboard /> : <UserForm />}
      </div>
    </div>
  );
};

// Estrutura principal que injeta o AuthProvider
const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;