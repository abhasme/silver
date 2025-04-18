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
exports.UnitController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const unit_service_1 = require("../../services/Silver/unit.service");
const request_unit_dto_1 = require("./dto/request-unit.dto");
const response_unit_dto_1 = require("./dto/response-unit.dto");
const transform_interceptor_1 = require("../../common/dispatchers/transform.interceptor");
const mongoose_1 = require("mongoose");
const pagination_dto_1 = require("../../dto/pagination-dto");
let UnitController = class UnitController {
    constructor(unitService) {
        this.unitService = unitService;
    }
    async createUnit(req, createUnitDto) {
        return this.unitService.createUnit(createUnitDto, req);
    }
    ;
    async getAllUnits(req, paginationDto) {
        const data = await this.unitService.getAllUnits(paginationDto, req);
        return { data };
    }
    ;
    async getUnitInfo(id) {
        if (!mongoose_1.Types.ObjectId.isValid(id)) {
            throw new common_1.BadRequestException('Invalid unit ID');
        }
        const data = await this.unitService.getUnitInfo(id);
        return { data };
    }
    ;
    async deleteUnit(id) {
        return await this.unitService.deleteUnit(id);
    }
    ;
    async UpdateUnit(id, updateUnitIdDto) {
        const data = await this.unitService.UpdateUnit(id, updateUnitIdDto);
        return { data };
    }
    ;
    async getUnitDropDown(req, searchDto) {
        const data = await this.unitService.getUnitDropDown(searchDto, req);
        return { data };
    }
    ;
    async updateUnitStatus(id, updateUnitStatusDto) {
        const data = await this.unitService.updateUnitStatus(id, updateUnitStatusDto);
        return { data };
    }
    ;
    async test() {
        const data = await this.unitService.test();
        return { data };
    }
    ;
};
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Add unit' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Success', type: response_unit_dto_1.GetUnitInfoDto }),
    (0, swagger_1.ApiForbiddenResponse)({ description: 'Unit already exist' }),
    (0, swagger_1.ApiInternalServerErrorResponse)({ description: 'Internal server error' }),
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, request_unit_dto_1.CreateUnitDto]),
    __metadata("design:returntype", Promise)
], UnitController.prototype, "createUnit", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get all unit' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: response_unit_dto_1.GetUnitInfoDto }),
    (0, common_1.Post)('/all'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, request_unit_dto_1.FilterPaginationUnitDto]),
    __metadata("design:returntype", Promise)
], UnitController.prototype, "getAllUnits", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get paticular unit details' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Login required' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Invalid unit id' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Success', type: response_unit_dto_1.GetUnitInfoDto }),
    (0, common_1.Get)('/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UnitController.prototype, "getUnitInfo", null);
__decorate([
    (0, common_1.Delete)('/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UnitController.prototype, "deleteUnit", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Update unit' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Success', type: request_unit_dto_1.UpdateUnitDto }),
    (0, swagger_1.ApiForbiddenResponse)({ description: 'Unit already exist' }),
    (0, swagger_1.ApiInternalServerErrorResponse)({ description: 'Internal server error' }),
    (0, common_1.Put)('/:id'),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, request_unit_dto_1.UpdateUnitDto]),
    __metadata("design:returntype", Promise)
], UnitController.prototype, "UpdateUnit", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get unit DropDown' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'unit is available', type: response_unit_dto_1.GetUnitInfoDto }),
    (0, common_1.Get)('/dropdown/list'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, pagination_dto_1.SearchDto]),
    __metadata("design:returntype", Promise)
], UnitController.prototype, "getUnitDropDown", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Update status' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Login required' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Invalid unit id' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Success', type: response_unit_dto_1.GetUnitInfoDto }),
    (0, common_1.Patch)('/status/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, request_unit_dto_1.UpdateStatusUnitDto]),
    __metadata("design:returntype", Promise)
], UnitController.prototype, "updateUnitStatus", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get unit DropDown' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'unit is available', type: response_unit_dto_1.GetUnitInfoDto }),
    (0, common_1.Post)('/test-data'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UnitController.prototype, "test", null);
UnitController = __decorate([
    (0, common_1.Controller)('silver-unit'),
    (0, swagger_1.ApiInternalServerErrorResponse)({ description: 'Internal server error' }),
    (0, common_1.UseInterceptors)(transform_interceptor_1.TransformInterceptor),
    __metadata("design:paramtypes", [unit_service_1.UnitService])
], UnitController);
exports.UnitController = UnitController;
//# sourceMappingURL=unit.controller.js.map