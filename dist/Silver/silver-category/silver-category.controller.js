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
exports.SilverCategoryController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const category_service_1 = require("../../services/Silver/category.service");
const request_category_dto_1 = require("../silver-category/dto/request-category.dto");
const response_category_dto_1 = require("../silver-category/dto/response-category.dto");
const transform_interceptor_1 = require("../../common/dispatchers/transform.interceptor");
const mongoose_1 = require("mongoose");
const pagination_dto_1 = require("../../dto/pagination-dto");
let SilverCategoryController = class SilverCategoryController {
    constructor(silverCategoryService) {
        this.silverCategoryService = silverCategoryService;
    }
    async createCategory(req, createCategoryDto) {
        return this.silverCategoryService.createCategory(createCategoryDto, req);
    }
    async getAllCategories(req, paginationDto) {
        console.log(paginationDto, "paginationDto");
        const data = await this.silverCategoryService.getAllCategories(paginationDto);
        return { data };
    }
    async getCategoryInfo(id) {
        if (!mongoose_1.Types.ObjectId.isValid(id)) {
            throw new common_1.BadRequestException('Invalid category ID');
        }
        const data = await this.silverCategoryService.getCategoryInfo(id);
        return { data };
    }
    async updateCategoryInfo(id, updateCategoryDto) {
        return this.silverCategoryService.updateCategoryInfo(id, updateCategoryDto);
    }
    async deleteCategory(id) {
        return await this.silverCategoryService.deleteCategory(id);
    }
    async updateStatus(id, statusCategoryDto) {
        const data = await this.silverCategoryService.updateStatus(id, statusCategoryDto);
        return { data };
    }
    ;
    async importSubCategory(req, importCategoryDto) {
        const data = await this.silverCategoryService.importCategory(req, importCategoryDto);
        return { data };
    }
    async getCategoryDropDown(searchDto) {
        const data = await this.silverCategoryService.getCategoryDropDown(searchDto);
        return { data };
    }
};
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Add Category' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Success', type: response_category_dto_1.GetCategoryInfoDto }),
    (0, swagger_1.ApiInternalServerErrorResponse)({ description: 'Internal server error' }),
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, request_category_dto_1.CreateCategoryDto]),
    __metadata("design:returntype", Promise)
], SilverCategoryController.prototype, "createCategory", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get all category' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Mobile number is available', type: response_category_dto_1.GetCategoryInfoDto }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Invalid category id' }),
    (0, common_1.Post)('/all'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, request_category_dto_1.FilterPaginationUserDto]),
    __metadata("design:returntype", Promise)
], SilverCategoryController.prototype, "getAllCategories", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get paticular category details' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Login required' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Invalid category id' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Success', type: response_category_dto_1.GetCategoryInfoDto }),
    (0, common_1.Get)('info/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SilverCategoryController.prototype, "getCategoryInfo", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Category Update' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Success', type: response_category_dto_1.GetCategoryInfoDto }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Invalid id or password' }),
    (0, swagger_1.ApiForbiddenResponse)({ description: 'Your email is not verified! Please verify your email address.' }),
    (0, swagger_1.ApiInternalServerErrorResponse)({ description: 'Internal server error' }),
    (0, common_1.Patch)(':id'),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, request_category_dto_1.UpdateCategoryDto]),
    __metadata("design:returntype", Promise)
], SilverCategoryController.prototype, "updateCategoryInfo", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SilverCategoryController.prototype, "deleteCategory", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Update status' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Login required' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Invalid unit id' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Success', type: request_category_dto_1.StatusCategoryDto }),
    (0, common_1.Patch)('/status/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, request_category_dto_1.StatusCategoryDto]),
    __metadata("design:returntype", Promise)
], SilverCategoryController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Post)('importCategory'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Array]),
    __metadata("design:returntype", Promise)
], SilverCategoryController.prototype, "importSubCategory", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get Category DropDown' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Category is available', type: response_category_dto_1.GetCategoryInfoDto }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Invalid Category' }),
    (0, common_1.Get)('dropdown'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_1.SearchDto]),
    __metadata("design:returntype", Promise)
], SilverCategoryController.prototype, "getCategoryDropDown", null);
SilverCategoryController = __decorate([
    (0, common_1.Controller)('silver-category'),
    (0, swagger_1.ApiInternalServerErrorResponse)({ description: 'Internal server error' }),
    (0, common_1.UseInterceptors)(transform_interceptor_1.TransformInterceptor),
    __metadata("design:paramtypes", [category_service_1.SilverCategoryService])
], SilverCategoryController);
exports.SilverCategoryController = SilverCategoryController;
//# sourceMappingURL=silver-category.controller.js.map