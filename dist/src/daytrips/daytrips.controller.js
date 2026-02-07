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
exports.DaytripsController = void 0;
const common_1 = require("@nestjs/common");
const daytrips_service_1 = require("./daytrips.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let DaytripsController = class DaytripsController {
    constructor(daytripsService) {
        this.daytripsService = daytripsService;
    }
    getAllDaytrips() {
        return this.daytripsService.getAllDaytrips();
    }
    createReservation(body, req) {
        return this.daytripsService.createReservation(body, req.user.userId);
    }
    getMyDaytrips(req) {
        return this.daytripsService.getMyDaytrips(req.user.userId);
    }
    createDaytrip(body, req) {
        return this.daytripsService.createDaytrip(body, req.user.userId);
    }
    getDaytrip(id) {
        return this.daytripsService.getDaytrip(id);
    }
    updateDaytrip(id, body, req) {
        return this.daytripsService.updateDaytrip(id, body, req.user.userId, req.user.role);
    }
    deleteDaytrip(id, req) {
        return this.daytripsService.deleteDaytrip(id, req.user.userId);
    }
};
exports.DaytripsController = DaytripsController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DaytripsController.prototype, "getAllDaytrips", null);
__decorate([
    (0, common_1.Post)('reservations'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], DaytripsController.prototype, "createReservation", null);
__decorate([
    (0, common_1.Get)('mine'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], DaytripsController.prototype, "getMyDaytrips", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], DaytripsController.prototype, "createDaytrip", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DaytripsController.prototype, "getDaytrip", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], DaytripsController.prototype, "updateDaytrip", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], DaytripsController.prototype, "deleteDaytrip", null);
exports.DaytripsController = DaytripsController = __decorate([
    (0, common_1.Controller)('daytrips'),
    __metadata("design:paramtypes", [daytrips_service_1.DaytripsService])
], DaytripsController);
//# sourceMappingURL=daytrips.controller.js.map