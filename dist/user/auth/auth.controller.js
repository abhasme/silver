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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_service_1 = require("./auth.service");
const auth_request_dto_1 = require("./dto/auth.request.dto");
const transform_interceptor_1 = require("../../common/dispatchers/transform.interceptor");
const validation_pipe_1 = require("../../validations/validation.pipe");
const auth_response_dto_1 = require("./dto/auth.response.dto");
const auth_request_dto_2 = require("./dto/auth.request.dto");
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    async createUser(req, createUserDto) {
        return await this.authService.createUser(createUserDto, req);
    }
    async loginUser(loginDto) {
        const data = await this.authService.userLogin(loginDto);
        return { data };
    }
    async getAllUser(req, paginationDto) {
        const data = await this.authService.getAllUser(paginationDto);
        return { data };
    }
    async getUserInfo(id) {
        const data = await this.authService.getUserInfo(id);
        return { data };
    }
    ;
    async getAllRoMaster(req) {
        const data = await this.authService.getAllRoMaster();
        return { data };
    }
    ;
    async UpdateUser(id, userDto) {
        const data = await this.authService.UpdateUser(id, userDto);
        return { data };
    }
    ;
    async updateUserStatus(id, updateUserInfoDto) {
        const data = await this.authService.updateUserStatus(id, updateUserInfoDto);
        return { data };
    }
    ;
    async importusers(req, createUserDto) {
        const data = await this.authService.importusers(createUserDto);
        return { data };
    }
    ;
    async getOrderDropDown(req) {
        const data = await this.authService.getOrderDropDown();
        return { data };
    }
    ;
};
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Create New User' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Success', type: auth_response_dto_1.UserResponseDto }),
    (0, swagger_1.ApiForbiddenResponse)({ description: 'Email already exist' }),
    (0, swagger_1.ApiInternalServerErrorResponse)({ description: 'Internal server error' }),
    (0, common_1.Post)("createUser"),
    (0, common_1.HttpCode)(200),
    (0, common_1.UsePipes)(validation_pipe_1.ValidationPipe),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, auth_request_dto_2.CreateUserDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "createUser", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Login into the system' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Success', type: auth_response_dto_1.UserResponseDto }),
    (0, swagger_1.ApiBadRequestResponse)({ status: 200, description: 'Invalid id or password' }),
    (0, swagger_1.ApiInternalServerErrorResponse)({ description: 'Internal server error' }),
    (0, common_1.Post)('login'),
    (0, common_1.HttpCode)(200),
    (0, common_1.UsePipes)(validation_pipe_1.ValidationPipe),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_request_dto_1.LoginRequestDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "loginUser", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get all user' }),
    (0, swagger_1.ApiResponse)({ status: 200 }),
    (0, common_1.Post)("all"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, auth_request_dto_1.FilterPaginationUserDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getAllUser", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get paticular user details' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Login required' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Invalid user id' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Success', type: auth_response_dto_1.UserResponseDto }),
    (0, common_1.Get)('/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getUserInfo", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get all cp' }),
    (0, swagger_1.ApiResponse)({ status: 200 }),
    (0, common_1.Get)("ro/all"),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getAllRoMaster", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Update user' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Success', type: auth_request_dto_2.UpdateUserDto }),
    (0, swagger_1.ApiInternalServerErrorResponse)({ description: 'Internal server error' }),
    (0, common_1.Put)('/:id'),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, auth_request_dto_2.UpdateUserDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "UpdateUser", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Update status' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Login required' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Invalid user id' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Success', type: auth_request_dto_2.StatusUserDto }),
    (0, common_1.Patch)('/status/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, auth_request_dto_2.StatusUserDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "updateUserStatus", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Add Multiple user' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Success', type: auth_response_dto_1.UserResponseDto }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Invalid id or password' }),
    (0, swagger_1.ApiForbiddenResponse)({ description: 'Your email is not verified! Please verify your email address.' }),
    (0, swagger_1.ApiInternalServerErrorResponse)({ description: 'Internal server error' }),
    (0, common_1.Post)('import'),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Array]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "importusers", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get cp  drop down' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Success', type: auth_response_dto_1.UserResponseDto }),
    (0, common_1.Post)("/dropdown"),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getOrderDropDown", null);
AuthController = __decorate([
    (0, common_1.Controller)('user/auth'),
    (0, swagger_1.ApiInternalServerErrorResponse)({ description: 'Internal server error' }),
    (0, common_1.UseInterceptors)(transform_interceptor_1.TransformInterceptor),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map