import express, { Request, Response } from 'express';
import mongoose from 'mongoose';

import cors from 'cors';
import 

// Variáveis de ambiente
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/salescrm';
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

// Middleware
app.use(cors()); // Permite requisições do frontend
app.use(express.json()); // Permite que o servidor entenda JSON

// ---------------------------------------------------------------------
// 1. Definição do Modelo Mongoose (UserModel)
// ---------------------------------------------------------------------

// Inteface para garantir tipagem estática
interface IUser extends mongoose.Document {
    email: string;
    password?: string; // Opcional para fins de tipagem, mas required no schema
    role: 'employee' | 'manager' | 'admin';
}

// Schema Mongoose
const UserSchema = new mongoose.Schema<IUser>({
    email: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true, select: false}
})