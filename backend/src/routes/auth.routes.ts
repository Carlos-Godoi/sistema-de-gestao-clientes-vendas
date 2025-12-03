import { Router } from 'express';
import { loginUser, registerUser, protect } from '../controllers/auth.controller';

const router = Router();

// Rotas públicas: Cadastro e Login
router.post('/register', registerUser);
router.post('/login', loginUser);

// Rota de teste protegida (para verificar o middleware)
router.get('/profile', protect, (req, res) => {
    // Se chegou aqui, o middleware 'protect' passou
    res.json({
        message: 'Acesso ao perfil concedido.',
        user: (req as any).user // Dados do usuário injetados pelo middleware
    });
});

export const AuthRoutes = router;