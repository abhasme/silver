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
exports.GroupService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const ObjectId = require('mongoose').Types.ObjectId;
const users_entity_1 = require("../../entities/users.entity");
const silverGroup_entity_1 = require("../../entities/Silver/silverGroup.entity");
const silverProductMaster_1 = require("../../entities/Silver/silverProductMaster");
const jwt_helper_1 = require("../../common/utils/jwt.helper");
const response_group_dto_1 = require("../../Silver/group/dto/response-group.dto");
let GroupService = class GroupService {
    constructor(GroupModel, userModel, productModel) {
        this.GroupModel = GroupModel;
        this.userModel = userModel;
        this.productModel = productModel;
    }
    ;
    async createGroup(createGroupDto, req) {
        try {
            const authInfo = await (0, jwt_helper_1.getAuthUserInfo)(req.headers);
            const findGroup = await this.GroupModel.findOne({ group: createGroupDto.group });
            if (findGroup) {
                return new common_1.BadRequestException("SilverGroup already exist");
            }
            const SilverGroup = new this.GroupModel(Object.assign(Object.assign({}, createGroupDto), { createdBy: authInfo._id }));
            if (SilverGroup.save()) {
                return new response_group_dto_1.GetGroupInfoDto(SilverGroup);
            }
            throw new common_1.BadRequestException('Error in Create SilverGroup');
        }
        catch (e) {
            throw new common_1.InternalServerErrorException(e);
        }
    }
    ;
    async getAllGroups(paginationDto, req) {
        try {
            const currentPage = paginationDto.currentPage || 1;
            const recordPerPage = paginationDto.recordPerPage || 10;
            const orderByFields = paginationDto.orderBy || ["createdAt"];
            let searchQuery = {};
            let activeCondition = { active: true };
            if (paginationDto.active == false) {
                activeCondition = { active: false };
            }
            if (paginationDto.search != '') {
                searchQuery = { $or: [{ groupCode: Number(paginationDto.search) }, { group: { $regex: paginationDto.search, '$options': 'i' } }] };
            }
            const Groups = await this.GroupModel.aggregate([
                {
                    $match: activeCondition
                },
                {
                    $match: searchQuery,
                },
                {
                    $facet: {
                        paginate: [
                            { $count: "totalDocs" },
                            { $addFields: { recordPerPage: recordPerPage, currentPage: currentPage } }
                        ],
                        docs: [
                            { $sort: { [orderByFields[0]]: -1 } },
                            { $skip: (currentPage - 1) * recordPerPage },
                            { $limit: recordPerPage }
                        ]
                    }
                }
            ]).exec();
            if (!Groups || !Groups[0]) {
                throw new common_1.BadRequestException('Data Not Found');
            }
            return Groups;
        }
        catch (e) {
            throw new common_1.InternalServerErrorException(e);
        }
    }
    ;
    async getGroupInfo(id) {
        try {
            const SilverGroup = await this.GroupModel.aggregate([
                { $match: { _id: ObjectId(id) } }
            ]).exec();
            if (!SilverGroup || !SilverGroup[0]) {
                throw new common_1.BadRequestException('Data Not Found');
            }
            return SilverGroup;
        }
        catch (e) {
            throw new common_1.InternalServerErrorException(e);
        }
    }
    ;
    async deleteGroup(id) {
        try {
            return await this.GroupModel.findByIdAndDelete(id);
        }
        catch (e) {
            throw new common_1.InternalServerErrorException(e);
        }
    }
    ;
    async UpdateGroup(id, updateGroupDto) {
        try {
            const findGroup = await this.GroupModel.find({ group: updateGroupDto.group, _id: { $ne: id } });
            if (findGroup.length > 0) {
                throw new common_1.BadRequestException("SilverGroup not exist");
            }
            return await this.GroupModel.findByIdAndUpdate(id, updateGroupDto, { new: true, useFindAndModify: false });
        }
        catch (e) {
            throw new common_1.InternalServerErrorException(e);
        }
    }
    ;
    async getGroupDropDown(searchDto, req) {
        try {
            let searchQuery = {};
            if (searchDto.search != '') {
                searchQuery = { SilverGroup: Number(searchDto.search) };
            }
            else {
                searchQuery = {};
            }
            const data = await this.GroupModel.aggregate([
                { $match: { active: true } },
                {
                    $project: {
                        _id: 1,
                        group: { $ifNull: ["$group", ""] },
                        groupCode: { $ifNull: ["$groupCode", ""] },
                        createdAt: { $dateToString: { format: "%Y-%m-%d %H:%M", date: "$createdAt" } },
                    },
                },
            ]).exec();
            if (!data) {
                throw new common_1.BadRequestException('Data Not Found');
            }
            return data;
        }
        catch (e) {
            throw new common_1.InternalServerErrorException(e);
        }
    }
    ;
    async updateGroupStatus(id, updateStatusGroupDto) {
        try {
            let findGroup = await this.GroupModel.findOne({ _id: ObjectId(id) });
            if (!findGroup) {
                throw new common_1.BadRequestException("SilverGroup not exit");
            }
            if (updateStatusGroupDto.active == false) {
                await this.productModel.updateMany({ groupid: ObjectId(id) }, { active: updateStatusGroupDto.active }, { new: true, useFindAndModify: false });
            }
            return await this.GroupModel.findByIdAndUpdate({ _id: ObjectId(id) }, { active: updateStatusGroupDto.active }, { new: true, useFindAndModify: false });
        }
        catch (e) {
            throw new common_1.InternalServerErrorException(e);
        }
    }
    ;
};
GroupService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(silverGroup_entity_1.SilverGroup.name)),
    __param(1, (0, mongoose_1.InjectModel)(users_entity_1.User.name)),
    __param(2, (0, mongoose_1.InjectModel)(silverProductMaster_1.SilverProduct.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], GroupService);
exports.GroupService = GroupService;
;
//# sourceMappingURL=group.service.js.map