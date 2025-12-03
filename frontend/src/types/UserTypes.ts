// Tipos definidos para manter a tipagem estática (TS)

export type UserRole = 'admin' | 'user' | 'manager';

// Dados do usuário retornados após o login/cadastro
export interface UserData {
    id: string;
    name: string;
    email: string;
    role: UserRole;
}

// Dados para o login
export interface LoginData {
    email: string;
    password: string;
}

// Dados para o cadastro
export interface RegisterData extends LoginData {
    name: string;
    // role é opcional no formulário de front, o backend define o default
}