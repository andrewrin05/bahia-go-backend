import { AuthService } from './auth.service';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    requestOtp(body: {
        email: string;
    }): Promise<{
        message: string;
    }>;
    verifyOtp(body: {
        email: string;
        code: string;
    }): Promise<{
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
    registerPassword(body: {
        email: string;
        password: string;
    }): Promise<{
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
    loginPassword(body: {
        email: string;
        password: string;
    }): Promise<{
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
    profile(req: any): Promise<any>;
}
