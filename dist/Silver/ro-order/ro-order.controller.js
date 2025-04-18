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
exports.RoOrderController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const ro_order_service_1 = require("../../services/Silver/ro-order.service");
const request_roOrder_dto_1 = require("./dto/request-roOrder.dto");
const response_roOrder_dto_1 = require("./dto/response-roOrder.dto");
const transform_interceptor_1 = require("../../common/dispatchers/transform.interceptor");
const mongoose_1 = require("mongoose");
let RoOrderController = class RoOrderController {
    constructor(roOrderService) {
        this.roOrderService = roOrderService;
    }
    async getAllOrder(paginationDto, req) {
        const data = await this.roOrderService.getAllOrder(paginationDto, req);
        return { data };
    }
    ;
    async getOrderInfo(id) {
        if (!mongoose_1.Types.ObjectId.isValid(id)) {
            throw new common_1.BadRequestException('Invalid order ID');
        }
        const data = await this.roOrderService.getOrderInfo(id);
        return { data };
    }
    ;
    async updateOrder(id, updateOrderIdDto, req) {
        const data = await this.roOrderService.updateOrder(id, updateOrderIdDto, req);
        return { data };
    }
    ;
    async dashBoardOrder(dashboardOrderDto, req) {
        const data = await this.roOrderService.dashBoardOrder(dashboardOrderDto, req);
        return { data };
    }
    ;
    async getOrderDropDown(req, addRoIdInfo) {
        const data = await this.roOrderService.getOrderDropDown(req, addRoIdInfo);
        return { data };
    }
    ;
};
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get all inventory' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: response_roOrder_dto_1.GetAllRoOrderDto }),
    (0, common_1.Post)('/all'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_roOrder_dto_1.FilterPaginationRoOrderDto, Object]),
    __metadata("design:returntype", Promise)
], RoOrderController.prototype, "getAllOrder", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get paticular order details' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Login required' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Invalid order id' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Success', type: response_roOrder_dto_1.GetRoOrderInfoDto }),
    (0, common_1.Get)('/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RoOrderController.prototype, "getOrderInfo", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Update order' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Success', type: response_roOrder_dto_1.GetRoOrderInfoDto }),
    (0, swagger_1.ApiForbiddenResponse)({ description: 'order already exist' }),
    (0, swagger_1.ApiInternalServerErrorResponse)({ description: 'Internal server error' }),
    (0, common_1.Put)('/:id'),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, request_roOrder_dto_1.UpdateRoOrderDto, Object]),
    __metadata("design:returntype", Promise)
], RoOrderController.prototype, "updateOrder", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Dashboard order' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Success', type: response_roOrder_dto_1.GetRoOrderInfoDto }),
    (0, swagger_1.ApiInternalServerErrorResponse)({ description: 'Internal server error' }),
    (0, common_1.Post)('/dashboard/count'),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_roOrder_dto_1.DashboardRoOrderDto, Object]),
    __metadata("design:returntype", Promise)
], RoOrderController.prototype, "dashBoardOrder", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get cp  drop down' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Success', type: response_roOrder_dto_1.GetRoOrderInfoDto }),
    (0, common_1.Post)("/dropdown"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, request_roOrder_dto_1.AddRoIdInfo]),
    __metadata("design:returntype", Promise)
], RoOrderController.prototype, "getOrderDropDown", null);
RoOrderController = __decorate([
    (0, common_1.Controller)('ro-order'),
    (0, swagger_1.ApiInternalServerErrorResponse)({ description: 'Internal server error' }),
    (0, common_1.UseInterceptors)(transform_interceptor_1.TransformInterceptor),
    __metadata("design:paramtypes", [ro_order_service_1.RoOrderService])
], RoOrderController);
exports.RoOrderController = RoOrderController;
//# sourceMappingURL=ro-order.controller.js.map