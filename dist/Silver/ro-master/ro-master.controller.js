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
exports.RoMasterController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const transform_interceptor_1 = require("../../common/dispatchers/transform.interceptor");
const ro_master_service_1 = require("../../services/Silver/ro-master.service");
const request_roMaster_dto_1 = require("./dto/request-roMaster.dto");
const response_roMaster_dto_1 = require("./dto/response-roMaster.dto");
const roMaster_dto_1 = require("../../dto/roMaster.dto");
let RoMasterController = class RoMasterController {
    constructor(roMasterService) {
        this.roMasterService = roMasterService;
    }
    async getAllRoMaster(req, paginationDto) {
        const data = await this.roMasterService.getAllRoMaster(paginationDto);
        return { data };
    }
    async createRo(req, createRoMasterDto) {
        return this.roMasterService.createRo(createRoMasterDto, req);
    }
    async getRoMasterInfo(id) {
        const data = await this.roMasterService.getRoMasterInfo(id);
        return { data };
    }
    ;
    async UpdateRoMaster(id, RoMasterIdDto) {
        const data = await this.roMasterService.UpdateRoMaster(id, RoMasterIdDto);
        return { data };
    }
    async deleteRoMaster(id) {
        return await this.roMasterService.deleteRoMaster(id);
    }
    async importRoMaster(req, importRoMasterDto) {
        const data = await this.roMasterService.importRoMaster(importRoMasterDto);
        return { data };
    }
    async getRoMasterDropDown(req) {
        const data = await this.roMasterService.getRoMasterDropDown();
        return { data };
    }
    ;
    async getCompanyNameDropDown() {
        const data = await this.roMasterService.getCompanyNameDropDown();
        return { data };
    }
    ;
    async updateRoMasterStatus(id, updateStatusRoMasterDto) {
        const data = await this.roMasterService.updateRoMasterStatus(id, updateStatusRoMasterDto);
        return { data };
    }
    ;
};
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get all Ro master' }),
    (0, swagger_1.ApiResponse)({ status: 200 }),
    (0, common_1.Post)("all"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, roMaster_dto_1.FilterPaginationRoMasterDto]),
    __metadata("design:returntype", Promise)
], RoMasterController.prototype, "getAllRoMaster", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Add Ro master' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Success', type: response_roMaster_dto_1.GetRoMasterInfoDto }),
    (0, swagger_1.ApiInternalServerErrorResponse)({ description: 'Internal server error' }),
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(200),
    (0, common_1.UsePipes)(common_1.ValidationPipe),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, request_roMaster_dto_1.CreateRoMasterDto]),
    __metadata("design:returntype", Promise)
], RoMasterController.prototype, "createRo", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get paticular Ro master details' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Login required' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Invalid Ro master id' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Success', type: response_roMaster_dto_1.GetRoMasterInfoDto }),
    (0, common_1.Get)('/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RoMasterController.prototype, "getRoMasterInfo", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Update Ro master' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Success', type: request_roMaster_dto_1.UpdateRoMasterDto }),
    (0, swagger_1.ApiInternalServerErrorResponse)({ description: 'Internal server error' }),
    (0, common_1.Put)('/:id'),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, request_roMaster_dto_1.UpdateRoMasterDto]),
    __metadata("design:returntype", Promise)
], RoMasterController.prototype, "UpdateRoMaster", null);
__decorate([
    (0, common_1.Delete)('/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RoMasterController.prototype, "deleteRoMaster", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Add Multiple CP' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Success', type: request_roMaster_dto_1.ImportRoMasterDto }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Invalid id or password' }),
    (0, swagger_1.ApiInternalServerErrorResponse)({ description: 'Internal server error' }),
    (0, common_1.Post)('import'),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Array]),
    __metadata("design:returntype", Promise)
], RoMasterController.prototype, "importRoMaster", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get cp  drop down' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Success', type: response_roMaster_dto_1.GetRoMasterInfoDto }),
    (0, common_1.Post)("/dropdown"),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RoMasterController.prototype, "getRoMasterDropDown", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get cp  drop down' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Success', type: response_roMaster_dto_1.GetRoMasterInfoDto }),
    (0, common_1.Post)("/dropdown/compantName"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RoMasterController.prototype, "getCompanyNameDropDown", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Update status' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Login required' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Invalid Ro master id' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Success', type: response_roMaster_dto_1.GetRoMasterInfoDto }),
    (0, common_1.Patch)('/status/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, request_roMaster_dto_1.UpdateStatusRoMasterDto]),
    __metadata("design:returntype", Promise)
], RoMasterController.prototype, "updateRoMasterStatus", null);
RoMasterController = __decorate([
    (0, common_1.Controller)('ro-master'),
    (0, swagger_1.ApiInternalServerErrorResponse)({ description: 'Internal server error' }),
    (0, common_1.UseInterceptors)(transform_interceptor_1.TransformInterceptor),
    __metadata("design:paramtypes", [ro_master_service_1.RoMasterService])
], RoMasterController);
exports.RoMasterController = RoMasterController;
//# sourceMappingURL=ro-master.controller.js.map