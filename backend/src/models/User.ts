import { Schema, model, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

// 1. Definição da Interface TS 
export interface IUser extends Document {
    name: string;
    email: string;
    passwordHash: string;
    role: 'admin' | 'user' | 'manager';
    comparePassword(candidatePassword: string): Promise<boolean>;
}

// 2. Definição do esquema Mongoose
const UserSchema = new Schema<IUser>({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['admin', 'user', 'manager'], default: 'user' },
}, {
    timestamps: true // createdAt e updatedAt automaticamente
});

// 3. Middlewares (Hooks) - Pré-salvamento para hash de senha
UserSchema.pre<IUser>('save', async function () {
    if (!this.isModified('passwordHash')) {
        return;
    }

    const salt = await bcrypt.genSalt(10);
    this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
});

// 4. Método de Instância (Para praticar métodos e hooks)
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.passwordHash);
};

export const UserModel = model<IUser>('User', UserSchema);