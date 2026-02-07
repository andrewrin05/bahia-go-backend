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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminDaytripsController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../../auth/jwt-auth.guard");
const admin_daytrips_service_1 = require("./admin.daytrips.service");
const admin_guard_1 = require("../../auth/admin.guard");
let AdminDaytripsController = class AdminDaytripsController {
    constructor(service) {
        this.service = service;
    }
    async getReservations(params, body, req) {
        console.log('ADMIN endpoint /admin/daytrips/reservations called by:', req?.user);
        const reservations = await this.service.getReservations();
        console.log('Total reservas devueltas:', reservations.length);
        return reservations;
    }
    async updateStatus(id, status) {
        return this.service.updateStatus(id, status);
    }
    async updatePayment(id, paymentStatus) {
        return this.service.updatePayment(id, paymentStatus);
    }
};
exports.AdminDaytripsController = AdminDaytripsController;
__decorate([
    (0, common_1.Get)('reservations'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], AdminDaytripsController.prototype, "getReservations", null);
__decorate([
    (0, common_1.Patch)('reservations/:id/status'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AdminDaytripsController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Patch)('reservations/:id/payment'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('paymentStatus')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AdminDaytripsController.prototype, "updatePayment", null);
exports.AdminDaytripsController = AdminDaytripsController = __decorate([
    (0, common_1.Controller)('admin/daytrips'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, admin_guard_1.AdminGuard),
    __metadata("design:paramtypes", [admin_daytrips_service_1.AdminDaytripsService])
], AdminDaytripsController);
//# sourceMappingURL=admin.daytrips.controller.js.map