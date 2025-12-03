import { Request, Response } from 'express';
import { UserModel } from '../models/User';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'i+JsW3EWP4q0KbQ0cdVfRpFGGMbHjBK3Lu2BpBLbaOM=';
const TOKEN_EXPIRATION = '1h';

// Controlador de cadastro
export const registerUser = async (req: Request, res: Response) => {
    const { name, email, password, role } = req.body;

    // Validação
    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Nome, e-mail e senha são obrigatórios.' });
    }

    try {
        // 1. Verificar se a senha já existe
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: 'E-mail já cadastrado.' });
        }

        // 2. Criar novo usuário. O hash da senha é feito no hook 'pre-save' do modelo.
        const newUser = new UserModel({
            name,
            email,
            passwordHash: password,
            role: role || 'user'
        });

        await newUser.save();

        // 3. Gerar JWT e enviar
        const token = jwt.sign(
            { userId: newUser._id, role: newUser.role },
            JWT_SECRET,
            { expiresIn: TOKEN_EXPIRATION }
        );

        return res.status(201).json({
            message: 'Usuário cadastrado com sucesso!',
            token,
            user: { id: newUser._id, name: newUser.name, email: newUser.email, role: newUser.role }
        });

    } catch (error) {
        console.error('Erro no cadastro:', error);
        return res.status(500).json({ message: 'Erro interno do servidor durante o cadastro.' });
    }
};

// CONTROLADOR DE LOGIN
export const loginUser = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    // Validação
    if (!email || !password) {
        return res.status(400).json({ message: 'Informe seu e-mail e senha.' });
    }

    try {
        // 1. Encontrar o usuário pelo e-mail
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Credenciais inválidas.' });
        }

        // 2. Compara a senha (usando o método de instância do modelo)
        const isMatch = await user?.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Credenciais inválidas.' });
        }

        // 3. Gerar JWT
        const token = jwt.sign(
            { userId: user._id, role: user.role },
            JWT_SECRET,
            { expiresIn: TOKEN_EXPIRATION }
        );

        return res.json({
            message: 'Login bem-sucedido!',
            token,
            user: { id: user._id, name: user.name, email: user.email, role: user.role }
        });

    } catch (error) {
        console.error('Erro no login:', error);
        return res.status(500).json({ message: 'Erro interno do servidor durante o login.' });
    }
};

// MIDDLEWARE: verificar o token (Middleware de roteamento avançado)
export const protect = (req: Request, res: Response, next: any) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Pegar o token do cabeçalho 'Bearer [token]'
            token = req.headers.authorization.split(' ')[1];

            // Verificar o token
            const decoded = jwt.verify(token, JWT_SECRET) as { userId: string, role: string };

            // Adicionar o ID e a role do usuário ao objeto req
            (req as any).user = { id: decoded.userId, role: decoded.role };

            next();
        } catch (error) {
            console.error('Erro na autenticação do token:', error);
            return res.status(401).json({ message: 'Não autorizado, token falhou ou expirou.' });
        }
    }

    if (!token) {
        return res.status(401).json({ message: 'Não autorizado, sem token.' });
    }
};