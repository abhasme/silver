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
exports.GroupController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const group_service_1 = require("../../services/Silver/group.service");
const request_group_dto_1 = require("./dto/request-group.dto");
const response_group_dto_1 = require("./dto/response-group.dto");
const transform_interceptor_1 = require("../../common/dispatchers/transform.interceptor");
const mongoose_1 = require("mongoose");
const pagination_dto_1 = require("../../dto/pagination-dto");
let GroupController = class GroupController {
    constructor(groupService) {
        this.groupService = groupService;
    }
    async createGroup(req, createGroupDto) {
        return this.groupService.createGroup(createGroupDto, req);
    }
    ;
    async getAllGroups(req, paginationDto) {
        const data = await this.groupService.getAllGroups(paginationDto, req);
        return { data };
    }
    ;
    async getGroupInfo(id) {
        if (!mongoose_1.Types.ObjectId.isValid(id)) {
            throw new common_1.BadRequestException('Invalid group ID');
        }
        const data = await this.groupService.getGroupInfo(id);
        return { data };
    }
    ;
    async deleteGroup(id) {
        return await this.groupService.deleteGroup(id);
    }
    ;
    async UpdateGroup(id, updateGroupIdDto) {
        const data = await this.groupService.UpdateGroup(id, updateGroupIdDto);
        return { data };
    }
    ;
    async getGroupDropDown(req, searchDto) {
        const data = await this.groupService.getGroupDropDown(searchDto, req);
        return { data };
    }
    ;
    async updateGroupStatus(id, updateGroupStatusDto) {
        const data = await this.groupService.updateGroupStatus(id, updateGroupStatusDto);
        return { data };
    }
    ;
};
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Add group' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Success', type: response_group_dto_1.GetGroupInfoDto }),
    (0, swagger_1.ApiForbiddenResponse)({ description: 'Group already exist' }),
    (0, swagger_1.ApiInternalServerErrorResponse)({ description: 'Internal server error' }),
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, request_group_dto_1.CreateGroupDto]),
    __metadata("design:returntype", Promise)
], GroupController.prototype, "createGroup", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get all group' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: response_group_dto_1.GetGroupInfoDto }),
    (0, common_1.Post)('/all'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, request_group_dto_1.FilterPaginationGroupDto]),
    __metadata("design:returntype", Promise)
], GroupController.prototype, "getAllGroups", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get paticular group details' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Login required' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Invalid group id' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Success', type: response_group_dto_1.GetGroupInfoDto }),
    (0, common_1.Get)('/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GroupController.prototype, "getGroupInfo", null);
__decorate([
    (0, common_1.Delete)('/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GroupController.prototype, "deleteGroup", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Update channel partner' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Success', type: request_group_dto_1.UpdateGroupDto }),
    (0, swagger_1.ApiForbiddenResponse)({ description: 'Group already exist' }),
    (0, swagger_1.ApiInternalServerErrorResponse)({ description: 'Internal server error' }),
    (0, common_1.Put)('/:id'),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, request_group_dto_1.UpdateGroupDto]),
    __metadata("design:returntype", Promise)
], GroupController.prototype, "UpdateGroup", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get group DropDown' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'group is available', type: response_group_dto_1.GetGroupInfoDto }),
    (0, common_1.Get)('/dropdown/list'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, pagination_dto_1.SearchDto]),
    __metadata("design:returntype", Promise)
], GroupController.prototype, "getGroupDropDown", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Update status' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Login required' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Invalid group id' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Success', type: response_group_dto_1.GetGroupInfoDto }),
    (0, common_1.Patch)('/status/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, request_group_dto_1.UpdateStatusGroupDto]),
    __metadata("design:returntype", Promise)
], GroupController.prototype, "updateGroupStatus", null);
GroupController = __decorate([
    (0, common_1.Controller)('silver-group'),
    (0, swagger_1.ApiInternalServerErrorResponse)({ description: 'Internal server error' }),
    (0, common_1.UseInterceptors)(transform_interceptor_1.TransformInterceptor),
    __metadata("design:paramtypes", [group_service_1.GroupService])
], GroupController);
exports.GroupController = GroupController;
//# sourceMappingURL=group.controller.js.map