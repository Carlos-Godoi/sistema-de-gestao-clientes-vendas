import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import { version } from 'os';
import { AuthRoutes } from './routes/auth.routes';


// Variáveis de ambiente
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/salescrm';
const JWT_SECRET = process.env.JWT_SECRET || 'i+JsW3EWP4q0KbQ0cdVfRpFGGMbHjBK3Lu2BpBLbaOM=';

// Configuração do CORS
app.use(cors({ 
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
})); 

// Middlewares essenciais
app.use(express.json()); // Para analisar corpos de solicitações JSON

// Middleware para logging simples (opcional)
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// --- Conexão com o MongoDB ---
mongoose.connect(MONGODB_URI)
    .then(() => console.log('Conectado com sucesso ao MongoDB!'))
    .catch(err => {
        console.error('Erro na conexão com o MongoDB:', err);
        process.exit(1);
    });

// =================================================================
//                      Rotas da API
// =================================================================

// Rotas de Autenticação (não precisa de middleware de autorização)
app.use('/api/auth', AuthRoutes);

// Rotas protegidas (Clientes e produtos)
app.use('/api/clients', clientRoutes);
app.use('/api/products', productRoutes);

// Rota raiz (verificação de status da API)
app.get('/', (req: Request, res: Response) => {
    return res.json({ message: 'API do CRM/ERP Light está online!', version: '1.0.0' });
});

// Tratamento de Erro 404
app.use((req: Request, res: Response) => {
    res.send({ message: 'Endpoint não encontrado.' });
})

// Inicialização do Servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
    console.log('Rotas disponíveis: /api/auth, /api/clients, /api/products');
});


