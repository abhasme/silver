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
exports.SilverSubCategoryController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const sub_category_service_1 = require("../../services/Silver/sub-category.service");
const request_subcategory_dto_1 = require("./dto/request-subcategory.dto");
const response_subcategory_dto_1 = require("./dto/response-subcategory.dto");
const request_subcategory_dto_2 = require("./dto/request-subcategory.dto");
const transform_interceptor_1 = require("../../common/dispatchers/transform.interceptor");
let SilverSubCategoryController = class SilverSubCategoryController {
    constructor(silverSubcategoryService) {
        this.silverSubcategoryService = silverSubcategoryService;
    }
    async createSubcategory(req, createSubcategoryDto, files) {
        return this.silverSubcategoryService.createSubcategory(createSubcategoryDto, req);
    }
    async getAllSubcategory(req, paginationDto) {
        console.log(paginationDto, "paginationDto");
        const data = await this.silverSubcategoryService.getAllSubcategory(paginationDto);
        return { data };
    }
    async getSubcategoriesByCategoryId(req, paginationDto) {
        console.log(paginationDto, "paginationDto");
        const data = await this.silverSubcategoryService.getSubcategoriesByCategoryId(paginationDto);
        return { data };
    }
    async getSubcategoryInfo(id) {
        const data = await this.silverSubcategoryService.getSubcategoryInfo(id);
        return { data };
    }
    async updateSubcategoryInfo(id, updateSubcategoryDto, files) {
        return this.silverSubcategoryService.updateSubcategoryInfo(id, updateSubcategoryDto);
    }
    async deleteSubcategory(id) {
        return await this.silverSubcategoryService.deleteSubcategory(id);
    }
    async updateStatus(id, statusSubcategoryDto) {
        const data = await this.silverSubcategoryService.updateStatus(id, statusSubcategoryDto);
        return { data };
    }
    ;
    async importSubCategory(createSubcategoryDto) {
        const data = await this.silverSubcategoryService.importSubCategory(createSubcategoryDto);
        return { data };
    }
};
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Login into the system' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Success', type: response_subcategory_dto_1.GetSubcategoryInfoDto }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Invalid id or password' }),
    (0, swagger_1.ApiForbiddenResponse)({ description: 'Your email is not verified! Please verify your email address.' }),
    (0, swagger_1.ApiInternalServerErrorResponse)({ description: 'Internal server error' }),
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(200),
    (0, common_1.UsePipes)(common_1.ValidationPipe),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, request_subcategory_dto_1.CreateSubcategoryDto, Object]),
    __metadata("design:returntype", Promise)
], SilverSubCategoryController.prototype, "createSubcategory", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get all subcategory' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Mobile number is available', type: response_subcategory_dto_1.GetSubcategoryInfoDto }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Invalid subcategory id' }),
    (0, common_1.Post)('/all'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, request_subcategory_dto_2.FilterPaginationUserDto]),
    __metadata("design:returntype", Promise)
], SilverSubCategoryController.prototype, "getAllSubcategory", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get all subcategory by category id' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Mobile number is available', type: response_subcategory_dto_1.GetSubcategoryInfoDto }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Invalid subcategory id' }),
    (0, common_1.Post)('category/:categoryId'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, request_subcategory_dto_2.FilterPaginationUserDto]),
    __metadata("design:returntype", Promise)
], SilverSubCategoryController.prototype, "getSubcategoriesByCategoryId", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get paticular subcategory details' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Login required' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Invalid subcategory id' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Success', type: response_subcategory_dto_1.GetSubcategoryInfoDto }),
    (0, common_1.Get)('info/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SilverSubCategoryController.prototype, "getSubcategoryInfo", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'SubCategory Update' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Success', type: response_subcategory_dto_1.GetSubcategoryInfoDto }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Invalid id or password' }),
    (0, swagger_1.ApiForbiddenResponse)({ description: 'Your email is not verified! Please verify your email address.' }),
    (0, swagger_1.ApiInternalServerErrorResponse)({ description: 'Internal server error' }),
    (0, common_1.Patch)(':id'),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, request_subcategory_dto_1.UpdateSubcategoryDto, Object]),
    __metadata("design:returntype", Promise)
], SilverSubCategoryController.prototype, "updateSubcategoryInfo", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SilverSubCategoryController.prototype, "deleteSubcategory", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Update status' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Login required' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Invalid unit id' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Success', type: request_subcategory_dto_1.StatusSubcategoryDto }),
    (0, common_1.Patch)('/status/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, request_subcategory_dto_1.StatusSubcategoryDto]),
    __metadata("design:returntype", Promise)
], SilverSubCategoryController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Post)('importSubCategory'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], SilverSubCategoryController.prototype, "importSubCategory", null);
SilverSubCategoryController = __decorate([
    (0, common_1.Controller)('silver-sub-category'),
    (0, swagger_1.ApiInternalServerErrorResponse)({ description: 'Internal server error' }),
    (0, common_1.UseInterceptors)(transform_interceptor_1.TransformInterceptor),
    __metadata("design:paramtypes", [sub_category_service_1.SilverSubcategoryService])
], SilverSubCategoryController);
exports.SilverSubCategoryController = SilverSubCategoryController;
//# sourceMappingURL=silver-sub-category.controller.js.map