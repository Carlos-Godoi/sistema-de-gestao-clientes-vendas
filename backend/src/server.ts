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

// Middleware
app.use(cors({ origin: 'http://localhost:3000' })); // Permite acesso do frontend
app.use(express.json()); // Body parser para JSON

// ---------------------------------------------------------------------
// 1. Definição do Modelo Mongoose (UserModel)
// ---------------------------------------------------------------------

// --- Conexão com o MongoDB ---
mongoose.connect(MONGODB_URI)
    .then(() => console.log('Conectado com sucesso ao MongoDB!'))
    .catch(err => {
        console.error('Erro na conexão com o MongoDB:', err);
        process.exit(1);
    });

// --- Roteamento Principal ---

// Rota raiz (verificação de status da API)
app.get('/', (req: Request, res: Response) => {
    return res.json({ message: 'API do CRM/ERP Light está online!', version: '1.0.0' });
});

// Rotas de Autenticação
app.use('/api/auth', AuthRoutes);

// Lançar o Servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
    console.log('Certifique-se de que seu MongoDB Compass esteja aberto.');
});


