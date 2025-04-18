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
exports.RoConsumptionController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const transform_interceptor_1 = require("../../common/dispatchers/transform.interceptor");
const ro_consumption_service_1 = require("../../services/Silver/ro-consumption.service");
const request_roConsumption_dto_1 = require("./dto/request-roConsumption.dto");
const response_roConsumption_dto_1 = require("./dto/response-roConsumption.dto");
const ro_consumption_dto_1 = require("../../dto/ro-consumption.dto");
let RoConsumptionController = class RoConsumptionController {
    constructor(roConsumptionService) {
        this.roConsumptionService = roConsumptionService;
    }
    async createChannelPartner(req, createConsumptionDto) {
        return this.roConsumptionService.createConsumption(createConsumptionDto, req);
    }
    ;
    async getAllConsumption(req, paginationDto) {
        const data = await this.roConsumptionService.getAllConsumption(paginationDto, req);
        return { data };
    }
    ;
    async getConsumptionInfo(id) {
        const data = await this.roConsumptionService.getConsumptionInfo(id);
        return { data };
    }
    ;
    async UpdateConsumption(req, updateConsumptionDto) {
        const data = await this.roConsumptionService.UpdateConsumption(updateConsumptionDto, req);
        return { data };
    }
    ;
    async importConsumption(req, createConsumptionDto) {
        try {
            const data = await this.roConsumptionService.importConsumption(req, createConsumptionDto);
            return { data };
        }
        catch (err) {
            console.log(err);
            throw new common_1.InternalServerErrorException(err);
        }
    }
    ;
    async updateConsumptionStatus(id, updateConsumptionStatusDto) {
        const data = await this.roConsumptionService.updateConsumptionStatus(id, updateConsumptionStatusDto);
        return { data };
    }
    ;
    async getConsumptionDropDown(req) {
        const data = await this.roConsumptionService.getConsumptionDropDown(req);
        return { data };
    }
    ;
    async getRoInventoryList(req, addRoConsumptionDto) {
        const data = await this.roConsumptionService.getRoInventoryList(req, addRoConsumptionDto);
        return { data };
    }
    ;
};
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Add ro consumption' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'consumption quantity more then hand on stock' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Success', type: request_roConsumption_dto_1.CreateRoConsumptionDto }),
    (0, swagger_1.ApiInternalServerErrorResponse)({ description: 'Internal server error' }),
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(200),
    (0, common_1.UsePipes)(common_1.ValidationPipe),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, request_roConsumption_dto_1.CreateRoConsumptionDto]),
    __metadata("design:returntype", Promise)
], RoConsumptionController.prototype, "createChannelPartner", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get all consumption' }),
    (0, swagger_1.ApiResponse)({ status: 200 }),
    (0, common_1.Post)("all"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, ro_consumption_dto_1.FilterPaginationRoConsumptionDto]),
    __metadata("design:returntype", Promise)
], RoConsumptionController.prototype, "getAllConsumption", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get paticular consumption details' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Login required' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Invalid consumption id' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Success', type: response_roConsumption_dto_1.GetRoConsumptionInfoDto }),
    (0, common_1.Get)('/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RoConsumptionController.prototype, "getConsumptionInfo", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Update consumption' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Success', type: request_roConsumption_dto_1.UpdateRoConsumptionDto }),
    (0, swagger_1.ApiInternalServerErrorResponse)({ description: 'Internal server error' }),
    (0, common_1.Put)('update'),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, request_roConsumption_dto_1.UpdateRoConsumptionDto]),
    __metadata("design:returntype", Promise)
], RoConsumptionController.prototype, "UpdateConsumption", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Import Cunsumptions' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Login required' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: '' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Success', type: response_roConsumption_dto_1.GetRoConsumptionInfoDto }),
    (0, common_1.Post)('import'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Array]),
    __metadata("design:returntype", Promise)
], RoConsumptionController.prototype, "importConsumption", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Update status' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Login required' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Invalid consumption id' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Success', type: response_roConsumption_dto_1.GetRoConsumptionInfoDto }),
    (0, common_1.Patch)('/status/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, request_roConsumption_dto_1.updateStatusRoConsumptionDto]),
    __metadata("design:returntype", Promise)
], RoConsumptionController.prototype, "updateConsumptionStatus", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get cp  drop down' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Success', type: response_roConsumption_dto_1.GetRoConsumptionInfoDto }),
    (0, common_1.Post)("/dropdown"),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RoConsumptionController.prototype, "getConsumptionDropDown", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get ro  drop down' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Success', type: response_roConsumption_dto_1.GetRoConsumptionInfoDto }),
    (0, common_1.Post)("/inventory-dropdown"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, request_roConsumption_dto_1.AddRoConsumptionDto]),
    __metadata("design:returntype", Promise)
], RoConsumptionController.prototype, "getRoInventoryList", null);
RoConsumptionController = __decorate([
    (0, common_1.Controller)('ro-consumption'),
    (0, swagger_1.ApiInternalServerErrorResponse)({ description: 'Internal server error' }),
    (0, common_1.UseInterceptors)(transform_interceptor_1.TransformInterceptor),
    __metadata("design:paramtypes", [ro_consumption_service_1.RoConsumptionService])
], RoConsumptionController);
exports.RoConsumptionController = RoConsumptionController;
//# sourceMappingURL=ro-consumption.controller.js.map