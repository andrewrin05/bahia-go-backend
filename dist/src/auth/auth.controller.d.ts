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
            email: string;
            role: string;
            passwordHash: string | null;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
    registerPassword(body: {
        email: string;
        password: string;
    }): Promise<{
        access_token: string;
        user: {
            id: string;
            email: string;
            role: string;
            passwordHash: string | null;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
    loginPassword(body: {
        email: string;
        password: string;
    }): Promise<{
        access_token: string;
        user: {
            id: string;
            email: string;
            role: string;
            passwordHash: string | null;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
    profile(req: any): Promise<any>;
}
