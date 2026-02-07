import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
export declare class AuthService {
    private prisma;
    private jwt;
    private emailTransporter;
    constructor(prisma: PrismaService, jwt: JwtService);
    requestOtp(email: string): Promise<{
        message: string;
    }>;
    verifyOtp(email: string, code: string): Promise<{
        access_token: string;
        user: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            role: string;
            passwordHash: string | null;
        };
    }>;
    private assignRole;
    registerPassword(email: string, password: string): Promise<{
        access_token: string;
        user: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            role: string;
            passwordHash: string | null;
        };
    }>;
    loginPassword(email: string, password: string): Promise<{
        access_token: string;
        user: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            role: string;
            passwordHash: string | null;
        };
    }>;
    profile(userId: string): Promise<any>;
}
