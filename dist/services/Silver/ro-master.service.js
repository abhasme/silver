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
exports.RoMasterService = void 0;
const common_1 = require("@nestjs/common");
const roMaster_1 = require("../../entities/Silver/roMaster");
const roOrder_1 = require("../../entities/Silver/roOrder");
const roInventory_1 = require("../../entities/Silver/roInventory");
const roConsumption_1 = require("../../entities/Silver/roConsumption");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const response_roMaster_dto_1 = require("../../Silver/ro-master/dto/response-roMaster.dto");
const jwt_helper_1 = require("../../common/utils/jwt.helper");
const ObjectId = require('mongoose').Types.ObjectId;
let RoMasterService = class RoMasterService {
    constructor(roOrderModel, roMasterModel, roInventoryModel, roConsumptionModel) {
        this.roOrderModel = roOrderModel;
        this.roMasterModel = roMasterModel;
        this.roInventoryModel = roInventoryModel;
        this.roConsumptionModel = roConsumptionModel;
    }
    ;
    async getAllRoMaster(paginationDto) {
        try {
            const currentPage = paginationDto.currentPage || 1;
            const recordPerPage = paginationDto.recordPerPage || 10;
            const sortFields = {};
            if (paginationDto.sortBy && paginationDto.sortBy.length > 0) {
                let dynamicSortFields = paginationDto.sortBy;
                dynamicSortFields.forEach(field => {
                    if (field.orderValue == 1) {
                        sortFields[field.orderKey] = 1;
                    }
                    else {
                        sortFields[field.orderKey] = -1;
                    }
                });
            }
            else {
                sortFields["createdAt"] = -1;
            }
            let activeCondition = { isActive: true };
            if (paginationDto.isActive == false) {
                activeCondition = { isActive: false };
            }
            const filter = await (0, jwt_helper_1.multiSelectorFunction)(paginationDto);
            const roMasters = await this.roMasterModel.aggregate([
                {
                    $match: activeCondition
                },
                {
                    $match: {
                        $or: [
                            { roName: { $regex: paginationDto.search, '$options': 'i' } },
                            { contactPersonName: { $regex: paginationDto.search, '$options': 'i' } },
                            { phone: { $regex: paginationDto.search, '$options': 'i' } },
                            { email: { $regex: paginationDto.search, '$options': 'i' } },
                            { city: { $regex: paginationDto.search, '$options': 'i' } },
                            { state: { $regex: paginationDto.search, '$options': 'i' } },
                            { address: { $regex: paginationDto.search, '$options': 'i' } },
                            { stockUpWeeks: { $regex: paginationDto.search, '$options': 'i' } },
                            { growthFactor: { $regex: paginationDto.search, '$options': 'i' } },
                            { leadTime: { $regex: paginationDto.search, '$options': 'i' } },
                        ]
                    }
                },
                {
                    $project: {
                        _id: 1,
                        roName: { $ifNull: ["$roName", ""] },
                        contactPersonName: { $ifNull: ["$contactPersonName", ""] },
                        phone: { $ifNull: ["$phone", ""] },
                        email: { $ifNull: ["$email", ""] },
                        address: { $ifNull: ["$address", ""] },
                        city: { $ifNull: ["$city", ""] },
                        state: { $ifNull: ["$state", ""] },
                        leadTime: { $ifNull: ["$leadTime", 0] },
                        stockUpWeeks: { $ifNull: ["$stockUpWeeks", 0] },
                        growthFactor: { $ifNull: ["$growthFactor", ""] },
                        isActive: { $ifNull: ["$isActive", false] },
                    },
                },
                { $match: filter },
                { $sort: sortFields },
                {
                    $facet: {
                        paginate: [
                            { $count: "totalDocs" },
                            { $addFields: { recordPerPage: recordPerPage, currentPage: currentPage } }
                        ],
                        docs: [
                            { $skip: (currentPage - 1) * recordPerPage },
                            { $limit: recordPerPage }
                        ]
                    }
                }
            ]).exec();
            if (!roMasters || roMasters.length === 0) {
                throw new common_1.BadRequestException('Data Not Found');
            }
            return roMasters;
        }
        catch (error) {
            throw new Error(`Error while fetching ro master data: ${error.message}`);
        }
    }
    ;
    async createRo(createRoMasterDto, req) {
        try {
            const authInfo = await (0, jwt_helper_1.getAuthUserInfo)(req.headers);
            const findEmail = await this.roMasterModel.find({ email: createRoMasterDto.email });
            if (findEmail.length > 0) {
                throw new common_1.BadRequestException("Email already exist");
            }
            const findRoName = await this.roMasterModel.find({ roName: createRoMasterDto.roName });
            if (findRoName.length > 0) {
                throw new common_1.BadRequestException("Ro name already exist");
            }
            const customer = new this.roMasterModel(Object.assign(Object.assign({}, createRoMasterDto), { isActive: true, createdBy: authInfo._id }));
            const save = await customer.save();
            if (save) {
                return new response_roMaster_dto_1.GetRoMasterInfoDto(customer);
            }
            throw new common_1.BadRequestException('Error in Create Ro master');
        }
        catch (e) {
            throw new common_1.InternalServerErrorException(e);
        }
    }
    ;
    async getRoMasterInfo(id) {
        try {
            const data = await this.roMasterModel.aggregate([
                { $match: { "_id": ObjectId(id) } },
                { $limit: 1 },
            ]).exec();
            if (!data) {
                throw new common_1.BadRequestException('Data Not Found');
            }
            return new response_roMaster_dto_1.GetRoMasterInfoDto(data[0]);
        }
        catch (e) {
            throw new common_1.InternalServerErrorException(e);
        }
    }
    ;
    async UpdateRoMaster(id, roMasterDto) {
        try {
            const findEmail = await this.roMasterModel.find({ email: roMasterDto.email, _id: { $ne: id } });
            if (findEmail.length > 0) {
                throw new common_1.BadRequestException("Email already exist");
            }
            const findRoName = await this.roMasterModel.find({ roName: roMasterDto.roName, _id: { $ne: id } });
            if (findRoName.length > 0) {
                throw new common_1.BadRequestException("ro name already exist");
            }
            return await this.roMasterModel.findByIdAndUpdate(id, roMasterDto, { new: true, useFindAndModify: false });
        }
        catch (e) {
            throw new common_1.InternalServerErrorException(e);
        }
    }
    ;
    async deleteRoMaster(id) {
        try {
            return await this.roMasterModel.findByIdAndDelete(id);
        }
        catch (e) {
            throw new common_1.InternalServerErrorException(e);
        }
    }
    ;
    async importRoMaster(importRoMasterDto) {
        try {
            let errorArrray = [];
            const dataArray = Array.isArray(importRoMasterDto) ? importRoMasterDto : Object.values(importRoMasterDto);
            const mappedArray = await Promise.all(dataArray.map(async (roMaster) => {
                const exitRo = await this.roMasterModel.findOne({ $or: [{ phone: roMaster.phone }, { roName: roMaster.roName }, { email: roMaster.email }] });
                let errString = "";
                const checkBlank = (property, errorMessage) => {
                    if (property === "" || property === null || property === "null") {
                        errString += `${errorMessage} ,`;
                    }
                };
                checkBlank(roMaster.roName, "roName is blank");
                checkBlank(roMaster.contactPersonName, "contactPersonName is blank");
                checkBlank(roMaster.phone, "phone is blank");
                checkBlank(roMaster.email, "email is blank");
                checkBlank(roMaster.address, "address is blank");
                checkBlank(roMaster.city, "city is blank");
                checkBlank(roMaster.state, "state is blank");
                checkBlank(roMaster.leadTime, "leadTime is blank");
                checkBlank(roMaster.stockUpWeeks, "stockUpWeeks is blank");
                checkBlank(roMaster.growthFactor, "growthFactor is blank");
                if (!errString) {
                    if (!exitRo) {
                        await this.roMasterModel.create(Object.assign({}, roMaster));
                    }
                    else if (exitRo !== null) {
                        if (exitRo.roName === roMaster.roName &&
                            exitRo.email === roMaster.email &&
                            exitRo.phone === roMaster.phone) {
                            await this.roMasterModel.findOneAndUpdate({ email: roMaster.email }, {
                                $set: roMaster,
                            }, { new: true, setDefaultsOnInsert: false }).lean();
                        }
                        else {
                            if (exitRo !== null) {
                                if (exitRo.email === roMaster.email) {
                                    errString += " duplicate email,";
                                }
                                if (exitRo.phone === roMaster.phone) {
                                    errString += "duplicate phone,";
                                }
                            }
                        }
                    }
                }
                if (errString !== "") {
                    roMaster["error"] = errString;
                    errorArrray.push(roMaster);
                }
            }));
            return new response_roMaster_dto_1.GetRoMasterInfoDto({ mappedArray: mappedArray, errorArrray: errorArrray });
        }
        catch (e) {
            throw new common_1.InternalServerErrorException(e);
        }
    }
    ;
    async getRoMasterDropDown() {
        try {
            const roMaster = await this.roMasterModel.aggregate([
                {
                    $match: { isActive: true }
                },
                {
                    $project: {
                        _id: 1,
                        roName: { $ifNull: ["$roName", ""] },
                        contactPersonName: { $ifNull: ["$contactPersonName", ""] },
                        city: { $ifNull: ["$city", ""] },
                        state: { $ifNull: ["$state", ""] },
                        address: { $ifNull: ["$address", ""] },
                        email: { $ifNull: ["$email", ""] },
                        phone: { $ifNull: ["$phone", ""] },
                        leadTime: { $ifNull: ["$leadTime", 0] },
                        stockUpWeeks: { $ifNull: ["$stockUpWeeks", 0] },
                        growthFactor: { $ifNull: ["$growthFactor", ""] },
                        isActive: { $ifNull: ["$isActive", false] },
                    },
                },
            ]).exec();
            if (!roMaster) {
                throw new common_1.BadRequestException('Data Not Found');
            }
            return roMaster;
        }
        catch (e) {
            throw new common_1.InternalServerErrorException(e);
        }
    }
    ;
    async getCompanyNameDropDown() {
        try {
            const roName = await this.roMasterModel.distinct("roName").exec();
            if (!roName) {
                throw new common_1.BadRequestException('Data Not Found');
            }
            return roName;
        }
        catch (e) {
            throw new common_1.InternalServerErrorException(e);
        }
    }
    ;
    async updateRoMasterStatus(id, updateRoMasterDto) {
        try {
            let findRoMaster = await this.roMasterModel.findOne({
                _id: ObjectId(id)
            });
            if (!findRoMaster) {
                throw new common_1.BadRequestException("Ro master not exit already exist");
            }
            if (updateRoMasterDto.active == false) {
                await this.roConsumptionModel.updateMany({ roId: ObjectId(id) }, { active: updateRoMasterDto.active }, { new: true, useFindAndModify: false });
                await this.roOrderModel.updateMany({ roId: ObjectId(id) }, { active: updateRoMasterDto.active }, { new: true, useFindAndModify: false });
                await this.roInventoryModel.updateMany({ roId: ObjectId(id) }, { active: updateRoMasterDto.active }, { new: true, useFindAndModify: false });
            }
            return await this.roMasterModel.findByIdAndUpdate({ _id: ObjectId(id) }, { isActive: updateRoMasterDto.active }, { new: true, useFindAndModify: false });
        }
        catch (e) {
            throw new common_1.InternalServerErrorException(e);
        }
    }
    ;
};
RoMasterService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(roOrder_1.RoOrder.name)),
    __param(1, (0, mongoose_1.InjectModel)(roMaster_1.RoMaster.name)),
    __param(2, (0, mongoose_1.InjectModel)(roInventory_1.RoInventory.name)),
    __param(3, (0, mongoose_1.InjectModel)(roConsumption_1.RoConsumption.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], RoMasterService);
exports.RoMasterService = RoMasterService;
;
//# sourceMappingURL=ro-master.service.js.map