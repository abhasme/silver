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
exports.CgInventoryController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const cg_inventory_service_1 = require("../../services/Silver/cg-inventory.service");
const request_cgInventroy_dto_1 = require("./dto/request-cgInventroy.dto");
const response_cgInventory_dto_1 = require("./dto/response-cgInventory.dto");
const transform_interceptor_1 = require("../../common/dispatchers/transform.interceptor");
const mongoose_1 = require("mongoose");
const pagination_dto_1 = require("../../dto/pagination-dto");
let CgInventoryController = class CgInventoryController {
    constructor(cgInventoryService) {
        this.cgInventoryService = cgInventoryService;
    }
    async createInventory(req, createInventoryDto) {
        return this.cgInventoryService.createInventory(createInventoryDto, req);
    }
    ;
    async getAllInventory(req, paginationDto) {
        const data = await this.cgInventoryService.getAllInventory(paginationDto, req);
        return { data };
    }
    async getInventoryInfo(id) {
        if (!mongoose_1.Types.ObjectId.isValid(id)) {
            throw new common_1.BadRequestException('Invalid industry ID');
        }
        const data = await this.cgInventoryService.getInventoryInfo(id);
        return { data };
    }
    ;
    async updateInventoryStatus(id, updateStatusInventoryDto) {
        const data = await this.cgInventoryService.updateInventoryStatus(id, updateStatusInventoryDto);
        return { data };
    }
    ;
    async UpdateInventory(id, updateCgInventoryDto, req) {
        const data = await this.cgInventoryService.UpdateInventory(id, updateCgInventoryDto, req);
        return { data };
    }
    ;
    async getDashBoardInventoryInfo(getDashBoardCgInventoryInfo, req) {
        const data = await this.cgInventoryService.getDashBoardInventoryInfo(getDashBoardCgInventoryInfo, req);
        return { data };
    }
    ;
    async getInventoryDropDown(req) {
        const data = await this.cgInventoryService.getInventoryDropDown(req);
        return { data };
    }
    ;
    async importInventory(createInventoryDto, req) {
        const data = await this.cgInventoryService.importInventory(createInventoryDto, req);
        return { data };
    }
    ;
    async getInventoryMoreInfo(viewotherCgInventoryDto) {
        const data = await this.cgInventoryService.getInventoryMoreInfo(viewotherCgInventoryDto);
        return { data };
    }
    ;
    async getProductDropDown(req, searchDto) {
        const data = await this.cgInventoryService.getProductDropDown(searchDto, req);
        return { data };
    }
    ;
    async UpdateTogToggle(id, updateTogToggleDto, req) {
        const data = await this.cgInventoryService.UpdateTogToggle(id, updateTogToggleDto, req);
        return { data };
    }
    ;
    async changeTog(id, changeTogDto) {
        const data = await this.cgInventoryService.changeTog(id, changeTogDto);
        return { data };
    }
    ;
};
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Add inventory' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Success', type: response_cgInventory_dto_1.GetAllCgInventoryDto }),
    (0, swagger_1.ApiForbiddenResponse)({ description: 'Inventory already exist' }),
    (0, swagger_1.ApiInternalServerErrorResponse)({ description: 'Internal server error' }),
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, request_cgInventroy_dto_1.CreateCgInventoryDto]),
    __metadata("design:returntype", Promise)
], CgInventoryController.prototype, "createInventory", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get all inventory' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: response_cgInventory_dto_1.GetCgInventoryInfoDto }),
    (0, common_1.Post)('/all'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe()),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, request_cgInventroy_dto_1.FilterPaginationCgInventoryDto]),
    __metadata("design:returntype", Promise)
], CgInventoryController.prototype, "getAllInventory", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get paticular inventory details' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Login required' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Invalid inventory id' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Success', type: response_cgInventory_dto_1.GetCgInventoryInfoDto }),
    (0, common_1.Get)('/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CgInventoryController.prototype, "getInventoryInfo", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Update status' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Login required' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Invalid inventory id' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Success', type: response_cgInventory_dto_1.GetCgInventoryInfoDto }),
    (0, common_1.Patch)('/status/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, request_cgInventroy_dto_1.UpdateStatusCgInventoryDto]),
    __metadata("design:returntype", Promise)
], CgInventoryController.prototype, "updateInventoryStatus", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Update inventory' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Success', type: request_cgInventroy_dto_1.UpdateCgInventoryDto }),
    (0, swagger_1.ApiInternalServerErrorResponse)({ description: 'Internal server error' }),
    (0, common_1.Put)('/:id'),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, request_cgInventroy_dto_1.UpdateCgInventoryDto, Object]),
    __metadata("design:returntype", Promise)
], CgInventoryController.prototype, "UpdateInventory", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get dahboard inventory details' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Login required' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Invalid inventory id' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Success', type: response_cgInventory_dto_1.GetCgInventoryInfoDto }),
    (0, common_1.Post)("dashboard"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_cgInventroy_dto_1.GetDashBoardCgInventoryInfo, Object]),
    __metadata("design:returntype", Promise)
], CgInventoryController.prototype, "getDashBoardInventoryInfo", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get products drop down' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Success', type: response_cgInventory_dto_1.GetCgInventoryInfoDto }),
    (0, common_1.Post)("/dropdown"),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CgInventoryController.prototype, "getInventoryDropDown", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Add Multiple inventory' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Success', type: response_cgInventory_dto_1.GetCgInventoryInfoDto }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Invalid id or password' }),
    (0, swagger_1.ApiForbiddenResponse)({ description: 'Your email is not verified! Please verify your email address.' }),
    (0, swagger_1.ApiInternalServerErrorResponse)({ description: 'Internal server error' }),
    (0, common_1.Post)('import'),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, Object]),
    __metadata("design:returntype", Promise)
], CgInventoryController.prototype, "importInventory", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Add Multiple inventory' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Success', type: response_cgInventory_dto_1.GetCgInventoryInfoDto }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Invalid id or password' }),
    (0, swagger_1.ApiForbiddenResponse)({ description: 'Your email is not verified! Please verify your email address.' }),
    (0, swagger_1.ApiInternalServerErrorResponse)({ description: 'Internal server error' }),
    (0, common_1.Post)('view'),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_cgInventroy_dto_1.ViewOtherCgInventoryDto]),
    __metadata("design:returntype", Promise)
], CgInventoryController.prototype, "getInventoryMoreInfo", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get products drop down' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Success', type: response_cgInventory_dto_1.GetCgInventoryInfoDto }),
    (0, common_1.Get)("/product/dropdown"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, pagination_dto_1.SearchDto]),
    __metadata("design:returntype", Promise)
], CgInventoryController.prototype, "getProductDropDown", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Update Tog toggle' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Success', type: request_cgInventroy_dto_1.UpdateTogToggleDto }),
    (0, swagger_1.ApiInternalServerErrorResponse)({ description: 'Internal server error' }),
    (0, common_1.Put)('/:id/tog-toggle'),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, request_cgInventroy_dto_1.UpdateTogToggleDto, Object]),
    __metadata("design:returntype", Promise)
], CgInventoryController.prototype, "UpdateTogToggle", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Update status' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Login required' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Invalid inventory id' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Success', type: response_cgInventory_dto_1.GetCgInventoryInfoDto }),
    (0, common_1.Patch)('/change-tog/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, request_cgInventroy_dto_1.ChangeTogDto]),
    __metadata("design:returntype", Promise)
], CgInventoryController.prototype, "changeTog", null);
CgInventoryController = __decorate([
    (0, common_1.Controller)('cg-inventory'),
    (0, swagger_1.ApiInternalServerErrorResponse)({ description: 'Internal server error' }),
    (0, common_1.UseInterceptors)(transform_interceptor_1.TransformInterceptor),
    __metadata("design:paramtypes", [cg_inventory_service_1.CgInventoryService])
], CgInventoryController);
exports.CgInventoryController = CgInventoryController;
//# sourceMappingURL=cg-inventory.controller.js.map