"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const prisma_service_1 = require("../prisma/prisma.service");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
let AuthService = class AuthService {
    constructor(prisma, jwt) {
        this.prisma = prisma;
        this.jwt = jwt;
        this.emailTransporter = null;
        const emailUser = process.env.EMAIL_USER;
        const emailPass = process.env.EMAIL_PASS;
        if (emailUser && emailPass) {
            this.emailTransporter = nodemailer.createTransport({
                host: 'smtp.ethereal.email',
                port: 587,
                secure: false,
                auth: {
                    user: emailUser,
                    pass: emailPass,
                },
            });
        }
    }
    async requestOtp(email) {
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
        await this.prisma.otp.create({
            data: {
                email,
                code,
                expiresAt,
            },
        });
        if (this.emailTransporter) {
            try {
                await this.emailTransporter.sendMail({
                    from: process.env.EMAIL_USER,
                    to: email,
                    subject: 'Código de verificación Bahía Go',
                    html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #00C853;">Bahía Go</h2>
              <p>Tu código de verificación es:</p>
              <h1 style="color: #00C853; font-size: 32px; letter-spacing: 5px;">${code}</h1>
              <p>Este código expira en 10 minutos.</p>
              <p>Si no solicitaste este código, ignora este mensaje.</p>
            </div>
          `,
                });
                console.log(`OTP code sent to ${email}: ${code}`);
                return { message: 'OTP sent to email' };
            }
            catch (error) {
                console.error('Error sending email:', error);
            }
        }
        console.log(`OTP code saved for ${email}: ${code}`);
        return { message: 'OTP saved' };
    }
    async verifyOtp(email, code) {
        const otp = await this.prisma.otp.findFirst({
            where: {
                email,
                code,
                used: false,
                expiresAt: {
                    gt: new Date(),
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
        if (!otp) {
            throw new Error('Invalid or expired code');
        }
        await this.prisma.otp.update({
            where: { id: otp.id },
            data: { used: true },
        });
        let user = await this.prisma.user.findUnique({ where: { email } });
        const adminEmails = (process.env.ADMIN_EMAILS || '').split(',').map(e => e.trim().toLowerCase()).filter(Boolean);
        const shouldBeAdmin = adminEmails.includes(email.toLowerCase());
        if (!user) {
            user = await this.prisma.user.create({ data: { email, role: shouldBeAdmin ? 'ADMIN' : 'USER' } });
        }
        else if (shouldBeAdmin && user.role !== 'ADMIN') {
            user = await this.prisma.user.update({ where: { email }, data: { role: 'ADMIN' } });
        }
        const payload = { userId: user.id, email: user.email, role: user.role };
        const token = this.jwt.sign(payload);
        return { access_token: token, user };
    }
    assignRole(email, currentRole) {
        const adminEmails = (process.env.ADMIN_EMAILS || '')
            .split(',')
            .map((e) => e.trim().toLowerCase())
            .filter(Boolean);
        const shouldBeAdmin = adminEmails.includes(email.toLowerCase());
        if (shouldBeAdmin)
            return 'ADMIN';
        return currentRole || 'USER';
    }
    async registerPassword(email, password) {
        const hash = await bcrypt.hash(password, 10);
        const role = this.assignRole(email);
        const existing = await this.prisma.user.findUnique({ where: { email } });
        if (existing && existing.passwordHash) {
            throw new Error('El usuario ya tiene contraseña');
        }
        const user = existing
            ? await this.prisma.user.update({ where: { email }, data: { passwordHash: hash, role } })
            : await this.prisma.user.create({ data: { email, passwordHash: hash, role } });
        const payload = { userId: user.id, email: user.email, role: user.role };
        const token = this.jwt.sign(payload);
        return { access_token: token, user };
    }
    async loginPassword(email, password) {
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user || !user.passwordHash) {
            throw new Error('Usuario o contraseña inválidos');
        }
        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok) {
            throw new Error('Usuario o contraseña inválidos');
        }
        const role = this.assignRole(email, user.role);
        const updated = role !== user.role
            ? await this.prisma.user.update({ where: { email }, data: { role } })
            : user;
        console.log('Login: email', email, 'rol asignado:', role);
        const payload = { userId: updated.id, email: updated.email, role: updated.role };
        const token = this.jwt.sign(payload);
        console.log('Token generado:', payload);
        return { access_token: token, user: updated };
    }
    async profile(userId) {
        console.log('AuthService.profile called with userId:', userId);
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        console.log('User found:', user);
        if (!user) {
            console.error('User not found for userId:', userId);
            throw new Error('User not found');
        }
        const { passwordHash, ...rest } = user;
        return rest;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map