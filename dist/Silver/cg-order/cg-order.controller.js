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
exports.CgOrderController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const cg_order_service_1 = require("../../services/Silver/cg-order.service");
const request_cgOrder_dto_1 = require("./dto/request-cgOrder.dto");
const response_cgOrder_dto_1 = require("./dto/response-cgOrder.dto");
const transform_interceptor_1 = require("../../common/dispatchers/transform.interceptor");
const mongoose_1 = require("mongoose");
let CgOrderController = class CgOrderController {
    constructor(cgOrderService) {
        this.cgOrderService = cgOrderService;
    }
    async getAllOrder(paginationDto, req) {
        const data = await this.cgOrderService.getAllOrder(paginationDto, req);
        return { data };
    }
    ;
    async getOrderInfo(id) {
        if (!mongoose_1.Types.ObjectId.isValid(id)) {
            throw new common_1.BadRequestException('Invalid order ID');
        }
        const data = await this.cgOrderService.getOrderInfo(id);
        return { data };
    }
    ;
    async updateOrder(id, updateOrderIdDto, req) {
        const data = await this.cgOrderService.updateOrder(id, updateOrderIdDto);
        return { data };
    }
    ;
    async dashBoardOrder(dashboardOrderDto, req) {
        const data = await this.cgOrderService.dashBoardOrder(dashboardOrderDto, req);
        return { data };
    }
    ;
    async getOrderDropDown(req) {
        const data = await this.cgOrderService.getOrderDropDown(req);
        return { data };
    }
    ;
};
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get all Cg order' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: response_cgOrder_dto_1.GetAllCgOrderDto }),
    (0, common_1.Post)('/all'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_cgOrder_dto_1.FilterPaginationCgOrderDto, Object]),
    __metadata("design:returntype", Promise)
], CgOrderController.prototype, "getAllOrder", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get paticular order details' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Login required' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Invalid order id' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Success', type: response_cgOrder_dto_1.GetCgOrderInfoDto }),
    (0, common_1.Get)('/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CgOrderController.prototype, "getOrderInfo", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Update order' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Success', type: response_cgOrder_dto_1.GetCgOrderInfoDto }),
    (0, swagger_1.ApiForbiddenResponse)({ description: 'order already exist' }),
    (0, swagger_1.ApiInternalServerErrorResponse)({ description: 'Internal server error' }),
    (0, common_1.Put)('/:id'),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, request_cgOrder_dto_1.UpdateCgOrderDto, Object]),
    __metadata("design:returntype", Promise)
], CgOrderController.prototype, "updateOrder", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Dashboard order' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Success', type: response_cgOrder_dto_1.GetCgOrderInfoDto }),
    (0, swagger_1.ApiInternalServerErrorResponse)({ description: 'Internal server error' }),
    (0, common_1.Post)('/dashboard/count'),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_cgOrder_dto_1.DashboardCgOrderDto, Object]),
    __metadata("design:returntype", Promise)
], CgOrderController.prototype, "dashBoardOrder", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get Cg  drop down' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Success', type: response_cgOrder_dto_1.GetCgOrderInfoDto }),
    (0, common_1.Post)("/dropdown"),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CgOrderController.prototype, "getOrderDropDown", null);
CgOrderController = __decorate([
    (0, common_1.Controller)('cg-order'),
    (0, swagger_1.ApiInternalServerErrorResponse)({ description: 'Internal server error' }),
    (0, common_1.UseInterceptors)(transform_interceptor_1.TransformInterceptor),
    __metadata("design:paramtypes", [cg_order_service_1.CgOrderService])
], CgOrderController);
exports.CgOrderController = CgOrderController;
//# sourceMappingURL=cg-order.controller.js.map