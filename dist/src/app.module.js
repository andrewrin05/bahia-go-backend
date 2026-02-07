"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const prisma_module_1 = require("./prisma/prisma.module");
const auth_module_1 = require("./auth/auth.module");
const boats_module_1 = require("./boats/boats.module");
const bookings_module_1 = require("./bookings/bookings.module");
const favorites_module_1 = require("./favorites/favorites.module");
const saved_searches_module_1 = require("./saved-searches/saved-searches.module");
const payments_module_1 = require("./payments/payments.module");
const daytrips_module_1 = require("./daytrips/daytrips.module");
const admin_daytrips_module_1 = require("./admin/daytrips/admin.daytrips.module");
const notifications_module_1 = require("./notifications/notifications.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot(),
            prisma_module_1.PrismaModule,
            auth_module_1.AuthModule,
            boats_module_1.BoatsModule,
            bookings_module_1.BookingsModule,
            favorites_module_1.FavoritesModule,
            saved_searches_module_1.SavedSearchesModule,
            payments_module_1.PaymentsModule,
            daytrips_module_1.DaytripsModule,
            admin_daytrips_module_1.AdminDaytripsModule,
            notifications_module_1.NotificationsModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map