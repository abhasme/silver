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
exports.UnitService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const ObjectId = require('mongoose').Types.ObjectId;
const silverUnit_entity_1 = require("../../entities/Silver/silverUnit.entity");
const users_entity_1 = require("../../entities/users.entity");
const silverProductMaster_1 = require("../../entities/Silver/silverProductMaster");
const jwt_helper_1 = require("../../common/utils/jwt.helper");
const response_unit_dto_1 = require("../../Silver/unit/dto/response-unit.dto");
const fs = require("fs");
const v8 = require("v8");
let UnitService = class UnitService {
    constructor(unitModel, userModel, productModel) {
        this.unitModel = unitModel;
        this.userModel = userModel;
        this.productModel = productModel;
    }
    ;
    async createUnit(createUnitDto, req) {
        try {
            const authInfo = await (0, jwt_helper_1.getAuthUserInfo)(req.headers);
            const findUnit = await this.unitModel.findOne({ unit: createUnitDto.unit });
            const findUnitCode = await this.unitModel.findOne({ unitCode: createUnitDto.unitCode });
            if (findUnit) {
                return new common_1.BadRequestException("SilverUnit already exist");
            }
            if (findUnitCode) {
                return new common_1.BadRequestException("SilverUnit code already exist");
            }
            const SilverUnit = new this.unitModel(Object.assign(Object.assign({}, createUnitDto), { createdBy: authInfo._id }));
            if (SilverUnit.save()) {
                return new response_unit_dto_1.GetUnitInfoDto(SilverUnit);
            }
            throw new common_1.BadRequestException('Error in Create SilverUnit');
        }
        catch (e) {
            throw new common_1.InternalServerErrorException(e);
        }
    }
    ;
    async getAllUnits(paginationDto, req) {
        try {
            const authInfo = await (0, jwt_helper_1.getAuthUserInfo)(req.headers);
            const currentPage = paginationDto.currentPage || 1;
            const recordPerPage = paginationDto.recordPerPage || 10;
            const orderByFields = paginationDto.orderBy || ["createdAt"];
            let searchQuery = {};
            let activeCondition = { active: true };
            if (paginationDto.active == false) {
                activeCondition = { active: false };
            }
            if (paginationDto.search != '') {
                searchQuery = { $or: [{ unitCode: Number(paginationDto.search) }, { unit: { $regex: paginationDto.search, '$options': 'i' } }] };
            }
            const units = await this.unitModel.aggregate([
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
            if (!units || !units[0]) {
                throw new common_1.BadRequestException('Data Not Found');
            }
            return units;
        }
        catch (e) {
            throw new common_1.InternalServerErrorException(e);
        }
    }
    ;
    async getUnitInfo(id) {
        try {
            const SilverUnit = await this.unitModel.aggregate([
                { $match: { _id: ObjectId(id) } }
            ]).exec();
            if (!SilverUnit || !SilverUnit[0]) {
                throw new common_1.BadRequestException('Data Not Found');
            }
            return SilverUnit;
        }
        catch (e) {
            throw new common_1.InternalServerErrorException(e);
        }
    }
    ;
    async deleteUnit(id) {
        try {
            return await this.unitModel.findByIdAndDelete(id);
        }
        catch (e) {
            throw new common_1.InternalServerErrorException(e);
        }
    }
    ;
    async UpdateUnit(id, updateUnitDto) {
        try {
            const findUnit = await this.unitModel.find({ unit: updateUnitDto.unit, _id: { $ne: id } });
            if (findUnit.length > 0) {
                throw new common_1.BadRequestException("SilverUnit already exist");
            }
            return await this.unitModel.findByIdAndUpdate(id, updateUnitDto, { new: true, useFindAndModify: false });
        }
        catch (e) {
            throw new common_1.InternalServerErrorException(e);
        }
    }
    ;
    async getUnitDropDown(searchDto, req) {
        try {
            let searchQuery = {};
            if (searchDto.search != '') {
                searchQuery = { SilverUnit: Number(searchDto.search) };
            }
            else {
                searchQuery = {};
            }
            const data = await this.unitModel.aggregate([
                { $match: { active: true } },
                {
                    $project: {
                        _id: 1,
                        unit: { $ifNull: ["$unit", ""] },
                        unitCode: { $ifNull: ["$unitCode", 0] },
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
    async updateUnitStatus(id, updateStatusUnitDto) {
        try {
            let findUnit = await this.unitModel.findOne({ _id: ObjectId(id) });
            if (!findUnit) {
                throw new common_1.BadRequestException("SilverUnit not exit");
            }
            if (updateStatusUnitDto.active == false) {
                await this.productModel.updateMany({ unitid: ObjectId(id) }, { active: updateStatusUnitDto.active }, { new: true, useFindAndModify: false });
            }
            return await this.unitModel.findByIdAndUpdate({ _id: ObjectId(id) }, { active: updateStatusUnitDto.active }, { new: true, useFindAndModify: false });
        }
        catch (e) {
            throw new common_1.InternalServerErrorException(e);
        }
    }
    ;
    async test() {
        try {
            const snapshot = v8.getHeapSnapshot();
            const filePath = `heapdump_${Date.now()}.heapsnapshot`;
            return new Promise((resolve, reject) => {
                const writeStream = fs.createWriteStream(filePath);
                snapshot.pipe(writeStream);
                writeStream.on('finish', () => {
                    resolve(`Heap snapshot saved at ${filePath}`);
                });
                writeStream.on('error', (err) => {
                    reject(`Error writing heap snapshot: ${err.message}`);
                });
            });
        }
        catch (e) {
            console.log(e, 32343);
            throw new common_1.InternalServerErrorException(e);
        }
    }
    ;
};
UnitService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(silverUnit_entity_1.SilverUnit.name)),
    __param(1, (0, mongoose_1.InjectModel)(users_entity_1.User.name)),
    __param(2, (0, mongoose_1.InjectModel)(silverProductMaster_1.SilverProduct.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], UnitService);
exports.UnitService = UnitService;
;
//# sourceMappingURL=unit.service.js.map