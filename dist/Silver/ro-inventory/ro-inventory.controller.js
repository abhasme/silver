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
exports.RoInventoryController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const ro_inventory_service_1 = require("../../services/Silver/ro-inventory.service");
const request_roInventroy_dto_1 = require("./dto/request-roInventroy.dto");
const response_roInventory_dto_1 = require("./dto/response-roInventory.dto");
const transform_interceptor_1 = require("../../common/dispatchers/transform.interceptor");
const mongoose_1 = require("mongoose");
const pagination_dto_1 = require("../../dto/pagination-dto");
let RoInventoryController = class RoInventoryController {
    constructor(roInventoryService) {
        this.roInventoryService = roInventoryService;
    }
    async createInventory(req, createInventoryDto) {
        return this.roInventoryService.createInventory(createInventoryDto, req);
    }
    ;
    async getAllInventory(req, paginationDto) {
        const data = await this.roInventoryService.getAllInventory(paginationDto, req);
        return { data };
    }
    async getInventoryInfo(id) {
        if (!mongoose_1.Types.ObjectId.isValid(id)) {
            throw new common_1.BadRequestException('Invalid industry ID');
        }
        const data = await this.roInventoryService.getInventoryInfo(id);
        return { data };
    }
    ;
    async updateInventoryStatus(id, updateStatusInventoryDto) {
        const data = await this.roInventoryService.updateInventoryStatus(id, updateStatusInventoryDto);
        return { data };
    }
    ;
    async changeTog(id, changeTogDto) {
        const data = await this.roInventoryService.changeTog(id, changeTogDto);
        return { data };
    }
    ;
    async UpdateInventory(id, updateInventoryDto, req) {
        const data = await this.roInventoryService.UpdateInventory(id, updateInventoryDto, req);
        return { data };
    }
    ;
    async getDashBoardInventoryInfo(getDashBoardInventoryInfo, req) {
        const data = await this.roInventoryService.getDashBoardInventoryInfo(getDashBoardInventoryInfo, req);
        return { data };
    }
    ;
    async getInventoryDropDown(req, addRoIdInfo) {
        const data = await this.roInventoryService.getInventoryDropDown(req, addRoIdInfo);
        return { data };
    }
    ;
    async importInventory(createInventoryDto, req) {
        const data = await this.roInventoryService.importInventory(createInventoryDto, req);
        return { data };
    }
    ;
    async importInventoryAndUpdateStock(createInventoryDto, req) {
        const data = await this.roInventoryService.importInventoryAndUpdateStock(createInventoryDto, req);
        return { data };
    }
    ;
    async getInventoryMoreInfo(viewotherInventoryDto) {
        const data = await this.roInventoryService.getInventoryMoreInfo(viewotherInventoryDto);
        return { data };
    }
    ;
    async getProductDropDown(req, searchDto) {
        const data = await this.roInventoryService.getProductDropDown(searchDto, req);
        return { data };
    }
    ;
    async UpdateTogToggle(id, updateTogToggleDto, req) {
        const data = await this.roInventoryService.UpdateTogToggle(id, updateTogToggleDto, req);
        return { data };
    }
    ;
    async UpdateTogRecommendation() {
        const data = await this.roInventoryService.UpdateTogRecommendation();
        return { data };
    }
    ;
};
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Add inventory' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Success', type: response_roInventory_dto_1.GetAllRoInventoryDto }),
    (0, swagger_1.ApiForbiddenResponse)({ description: 'Inventory already exist' }),
    (0, swagger_1.ApiInternalServerErrorResponse)({ description: 'Internal server error' }),
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, request_roInventroy_dto_1.CreateRoInventoryDto]),
    __metadata("design:returntype", Promise)
], RoInventoryController.prototype, "createInventory", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get all inventory' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: response_roInventory_dto_1.GetRoInventoryInfoDto }),
    (0, common_1.Post)('/all'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe()),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, request_roInventroy_dto_1.FilterPaginationRoInventoryDto]),
    __metadata("design:returntype", Promise)
], RoInventoryController.prototype, "getAllInventory", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get paticular inventory details' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Login required' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Invalid inventory id' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Success', type: response_roInventory_dto_1.GetRoInventoryInfoDto }),
    (0, common_1.Get)('/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RoInventoryController.prototype, "getInventoryInfo", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Update status' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Login required' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Invalid inventory id' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Success', type: response_roInventory_dto_1.GetRoInventoryInfoDto }),
    (0, common_1.Patch)('/status/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, request_roInventroy_dto_1.UpdateStatusRoInventoryDto]),
    __metadata("design:returntype", Promise)
], RoInventoryController.prototype, "updateInventoryStatus", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Update status' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Login required' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Invalid inventory id' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Success', type: response_roInventory_dto_1.GetRoInventoryInfoDto }),
    (0, common_1.Patch)('/change-tog/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, request_roInventroy_dto_1.ChangeTogDto]),
    __metadata("design:returntype", Promise)
], RoInventoryController.prototype, "changeTog", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Update inventory' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Success', type: request_roInventroy_dto_1.UpdateRoInventoryDto }),
    (0, swagger_1.ApiInternalServerErrorResponse)({ description: 'Internal server error' }),
    (0, common_1.Put)('/:id'),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, request_roInventroy_dto_1.UpdateRoInventoryDto, Object]),
    __metadata("design:returntype", Promise)
], RoInventoryController.prototype, "UpdateInventory", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get dahboard inventory details' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Login required' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Invalid inventory id' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Success', type: response_roInventory_dto_1.GetRoInventoryInfoDto }),
    (0, common_1.Post)("dashboard"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_roInventroy_dto_1.GetDashBoardRoInventoryInfo, Object]),
    __metadata("design:returntype", Promise)
], RoInventoryController.prototype, "getDashBoardInventoryInfo", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get products drop down' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Success', type: response_roInventory_dto_1.GetRoInventoryInfoDto }),
    (0, common_1.Post)("/dropdown"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, request_roInventroy_dto_1.AddRoIdInfo]),
    __metadata("design:returntype", Promise)
], RoInventoryController.prototype, "getInventoryDropDown", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Add Multiple inventory' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Success', type: response_roInventory_dto_1.GetRoInventoryInfoDto }),
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
], RoInventoryController.prototype, "importInventory", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Update stock of inventory' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Success', type: response_roInventory_dto_1.GetRoInventoryInfoDto }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Invalid id or password' }),
    (0, swagger_1.ApiForbiddenResponse)({ description: 'Your email is not verified! Please verify your email address.' }),
    (0, swagger_1.ApiInternalServerErrorResponse)({ description: 'Internal server error' }),
    (0, common_1.Post)('update-stock'),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, Object]),
    __metadata("design:returntype", Promise)
], RoInventoryController.prototype, "importInventoryAndUpdateStock", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Add Multiple inventory' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Success', type: response_roInventory_dto_1.GetRoInventoryInfoDto }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Invalid id or password' }),
    (0, swagger_1.ApiForbiddenResponse)({ description: 'Your email is not verified! Please verify your email address.' }),
    (0, swagger_1.ApiInternalServerErrorResponse)({ description: 'Internal server error' }),
    (0, common_1.Post)('view'),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_roInventroy_dto_1.ViewotherRoInventoryDto]),
    __metadata("design:returntype", Promise)
], RoInventoryController.prototype, "getInventoryMoreInfo", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get products drop down' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Success', type: response_roInventory_dto_1.GetRoInventoryInfoDto }),
    (0, common_1.Post)("/product/dropdown"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, pagination_dto_1.SearchDto]),
    __metadata("design:returntype", Promise)
], RoInventoryController.prototype, "getProductDropDown", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Update Tog toggle' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Success', type: request_roInventroy_dto_1.UpdateTogToggleDto }),
    (0, swagger_1.ApiInternalServerErrorResponse)({ description: 'Internal server error' }),
    (0, common_1.Put)('/:id/tog-toggle'),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, request_roInventroy_dto_1.UpdateTogToggleDto, Object]),
    __metadata("design:returntype", Promise)
], RoInventoryController.prototype, "UpdateTogToggle", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Update Tog Recommendation ' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Success', type: request_roInventroy_dto_1.UpdateTogToggleDto }),
    (0, swagger_1.ApiInternalServerErrorResponse)({ description: 'Internal server error' }),
    (0, common_1.Put)('/tog-recommendation'),
    (0, common_1.HttpCode)(200),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RoInventoryController.prototype, "UpdateTogRecommendation", null);
RoInventoryController = __decorate([
    (0, common_1.Controller)('ro-inventory'),
    (0, swagger_1.ApiInternalServerErrorResponse)({ description: 'Internal server error' }),
    (0, common_1.UseInterceptors)(transform_interceptor_1.TransformInterceptor),
    __metadata("design:paramtypes", [ro_inventory_service_1.RoInventoryService])
], RoInventoryController);
exports.RoInventoryController = RoInventoryController;
//# sourceMappingURL=ro-inventory.controller.js.map