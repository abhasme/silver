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
exports.CronService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const helper_service_1 = require("../common/utils/helper.service");
let CronService = class CronService {
    constructor(cronHelper) {
        this.cronHelper = cronHelper;
    }
    async cronJobafter() {
        try {
            console.log('Cron job executed cronJobAfter ! ');
            await this.cronHelper.updateGrowthFactor();
            await this.cronHelper.updateValueInRoInventory();
        }
        catch (error) {
            console.error('Error in the cron job:', error);
        }
    }
    ;
    async cronJob2() {
        try {
        }
        catch (error) {
        }
    }
    ;
};
__decorate([
    (0, schedule_1.Cron)("* * 1 * *"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CronService.prototype, "cronJobafter", null);
__decorate([
    (0, schedule_1.Cron)("* * * * *"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CronService.prototype, "cronJob2", null);
CronService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [helper_service_1.CronHelper])
], CronService);
exports.CronService = CronService;
;
//# sourceMappingURL=cron.service.js.map