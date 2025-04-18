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
exports.CgConsumptionController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const transform_interceptor_1 = require("../../common/dispatchers/transform.interceptor");
const cg_consumption_service_1 = require("../../services/Silver/cg-consumption.service");
const request_cgConsumption_dto_1 = require("./dto/request-cgConsumption.dto");
const response_cgConsumption_dto_1 = require("./dto/response-cgConsumption.dto");
const cg_consumption_dto_1 = require("../../dto/cg-consumption.dto");
let CgConsumptionController = class CgConsumptionController {
    constructor(cgConsumptionService) {
        this.cgConsumptionService = cgConsumptionService;
    }
    async createChannelPartner(req, createConsumptionDto) {
        return this.cgConsumptionService.createConsumption(createConsumptionDto, req);
    }
    ;
    async getAllConsumption(req, paginationDto) {
        const data = await this.cgConsumptionService.getAllConsumption(paginationDto, req);
        return { data };
    }
    ;
    async getConsumptionInfo(id) {
        const data = await this.cgConsumptionService.getConsumptionInfo(id);
        return { data };
    }
    ;
    async UpdateConsumption(req, updateCgConsumptionDto) {
        const data = await this.cgConsumptionService.UpdateConsumption(updateCgConsumptionDto, req);
        return { data };
    }
    ;
    async importConsumption(req, importCgConsumptionDto) {
        try {
            const data = await this.cgConsumptionService.importConsumption(req, importCgConsumptionDto);
            return { data };
        }
        catch (err) {
            console.log(err);
            throw new common_1.InternalServerErrorException(err);
        }
    }
    ;
    async updateConsumptionStatus(id, updateConsumptionStatusDto) {
        const data = await this.cgConsumptionService.updateConsumptionStatus(id, updateConsumptionStatusDto);
        return { data };
    }
    ;
    async getConsumptionDropDown(req) {
        const data = await this.cgConsumptionService.getConsumptionDropDown(req);
        return { data };
    }
    ;
    async getCgInventoryList(req) {
        const data = await this.cgConsumptionService.getCgInventoryList(req);
        return { data };
    }
    ;
};
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Add consumption' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'consumption quantity more then hand on stock' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Success', type: request_cgConsumption_dto_1.CreateCgConsumptionDto }),
    (0, swagger_1.ApiInternalServerErrorResponse)({ description: 'Internal server error' }),
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(200),
    (0, common_1.UsePipes)(common_1.ValidationPipe),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, request_cgConsumption_dto_1.CreateCgConsumptionDto]),
    __metadata("design:returntype", Promise)
], CgConsumptionController.prototype, "createChannelPartner", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get all consumption' }),
    (0, swagger_1.ApiResponse)({ status: 200 }),
    (0, common_1.Post)("all"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, cg_consumption_dto_1.FilterPaginationCgConsumptionDto]),
    __metadata("design:returntype", Promise)
], CgConsumptionController.prototype, "getAllConsumption", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get paticular consumption details' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Login required' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Invalid consumption id' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Success', type: response_cgConsumption_dto_1.GetCgConsumptionInfoDto }),
    (0, common_1.Get)('/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CgConsumptionController.prototype, "getConsumptionInfo", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Update consumption' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Success', type: request_cgConsumption_dto_1.UpdateCgConsumptionDto }),
    (0, swagger_1.ApiInternalServerErrorResponse)({ description: 'Internal server error' }),
    (0, common_1.Put)('update'),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, request_cgConsumption_dto_1.UpdateCgConsumptionDto]),
    __metadata("design:returntype", Promise)
], CgConsumptionController.prototype, "UpdateConsumption", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Import Cunsumptions' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Login required' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: '' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Success', type: response_cgConsumption_dto_1.GetCgConsumptionInfoDto }),
    (0, common_1.Post)('import'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Array]),
    __metadata("design:returntype", Promise)
], CgConsumptionController.prototype, "importConsumption", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Update status' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Login required' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Invalid consumption id' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Success', type: response_cgConsumption_dto_1.GetCgConsumptionInfoDto }),
    (0, common_1.Patch)('/status/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, request_cgConsumption_dto_1.updateStatusCgConsumptionDto]),
    __metadata("design:returntype", Promise)
], CgConsumptionController.prototype, "updateConsumptionStatus", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get cg  drop down' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Success', type: response_cgConsumption_dto_1.GetCgConsumptionInfoDto }),
    (0, common_1.Post)("/dropdown"),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CgConsumptionController.prototype, "getConsumptionDropDown", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get cg  drop down' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Success', type: response_cgConsumption_dto_1.GetCgConsumptionInfoDto }),
    (0, common_1.Post)("/inventory-dropdown"),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CgConsumptionController.prototype, "getCgInventoryList", null);
CgConsumptionController = __decorate([
    (0, common_1.Controller)('cg-consumption'),
    (0, swagger_1.ApiInternalServerErrorResponse)({ description: 'Internal server error' }),
    (0, common_1.UseInterceptors)(transform_interceptor_1.TransformInterceptor),
    __metadata("design:paramtypes", [cg_consumption_service_1.CgConsumptionService])
], CgConsumptionController);
exports.CgConsumptionController = CgConsumptionController;
//# sourceMappingURL=cg-consumption.controller.js.map