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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const users_entity_1 = require("../../entities/users.entity");
const roMaster_1 = require("../../entities/Silver/roMaster");
const auth_response_dto_1 = require("./dto/auth.response.dto");
const jwt_helper_1 = require("../../common/utils/jwt.helper");
const bcrypt = require("bcrypt");
const jwt_1 = require("@nestjs/jwt");
const auth_response_dto_2 = require("./dto/auth.response.dto");
const ObjectId = require('mongoose').Types.ObjectId;
let AuthService = class AuthService {
    constructor(jwtService, userModel, roMasterModel) {
        this.jwtService = jwtService;
        this.userModel = userModel;
        this.roMasterModel = roMasterModel;
    }
    async createUser(createUserDto, req) {
        const authInfo = await (0, jwt_helper_1.getAuthUserInfo)(req.headers);
        try {
            const saltOrRounds = 10;
            let password = createUserDto.password;
            if (createUserDto.password) {
                createUserDto.password = await bcrypt.hash(createUserDto.password, saltOrRounds);
            }
            const existEmail = await this.userModel.findOne({ email: createUserDto.email }).select('_id email').exec();
            if (!existEmail) {
                let user;
                if (createUserDto.userType == "CG") {
                    user = new this.userModel(Object.assign(Object.assign({}, createUserDto), { viewPassword: password, createdBy: authInfo._id, createdAt: new Date() }));
                }
                else {
                    user = new this.userModel(Object.assign(Object.assign({}, createUserDto), { viewPassword: password, createdBy: authInfo._id, createdAt: new Date() }));
                }
                if (user.save()) {
                    return new auth_response_dto_2.UserResponseDto(user);
                }
                else {
                    throw new common_1.BadRequestException("Error in Create User");
                }
            }
            {
                throw new common_1.BadRequestException("Email Already Exist");
            }
        }
        catch (err) {
            console.log('err', err);
            throw new common_1.BadRequestException(err);
        }
    }
    ;
    async userLogin(loginDto) {
        const user = await this.userModel.findOne({ email: loginDto.username });
        if (!user) {
            throw new common_1.BadRequestException('Invalid email or password.');
        }
        const validate = await bcrypt.compare(loginDto.password, user.password);
        if (!validate) {
            throw new common_1.BadRequestException('Invalid email or password.');
        }
        const isActive = await this.userModel.findOne({ _id: user._id, active: true });
        if (!isActive) {
            throw new common_1.BadRequestException('user in active please contact with admin');
        }
        try {
            const payload = {
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                userType: user.userType,
                roId: user.roId ? user.roId : "",
                isAcceptingProduction: user.isAcceptingProduction ? user.isAcceptingProduction : false,
                isReplenishmentRecommendations: user.isReplenishmentRecommendations ? user.isReplenishmentRecommendations : false,
                isDispatching: user.isDispatching ? user.isDispatching : false,
                isHandlingWip: user.isHandlingWip ? user.isHandlingWip : false,
                isHoViewCgOrder: user.isHoViewCgOrder ? user.isHoViewCgOrder : false,
                isHoViewCgInventory: user.isHoViewCgInventory ? user.isHoViewCgInventory : false,
                isHoViewCgConsumption: user.isHoViewCgConsumption ? user.isHoViewCgConsumption : false,
                isHoViewROOrder: user.isHoViewROOrder ? user.isHoViewROOrder : false,
                isHoViewRoInventory: user.isHoViewRoInventory ? user.isHoViewRoInventory : false,
                isHoViewRoConsumption: user.isHoViewRoConsumption ? user.isHoViewRoConsumption : false,
                isHoViewSilverProduct: user.isHoViewSilverProduct ? user.isHoViewSilverProduct : false,
                isHoViewRoMaster: user.isHoViewRoMaster ? user.isHoViewRoMaster : false,
                isUpdateAccessRo: user.isUpdateAccessRo ? user.isUpdateAccessRo : false,
            };
            await this.userModel.findOneAndUpdate({ _id: user._id }, {
                $set: { deviceInfo: { appVersion: loginDto.appVersion, deviceToken: loginDto.deviceToken, deviceType: loginDto.deviceType, deviceName: loginDto.deviceName } },
            }, { new: true, upsert: true, setDefaultsOnInsert: false }).lean();
            const token = await (0, jwt_helper_1.generateAuthUserToken)(payload);
            return new auth_response_dto_1.LoginResponseDto(Object.assign(Object.assign({}, payload), { token: token }));
        }
        catch (err) {
            console.log('err', err);
            throw new common_1.BadRequestException('Invalid email or password.');
        }
    }
    ;
    async getAllUser(paginationDto) {
        const currentPage = paginationDto.currentPage || 1;
        const recordPerPage = paginationDto.recordPerPage || 10;
        const sortFields = {};
        let dynamicSortFields = ["id"];
        if (paginationDto.orderBy) {
            dynamicSortFields = paginationDto.orderBy;
            dynamicSortFields.forEach(field => {
                sortFields[field] = 1;
            });
        }
        let activeCondition = { active: true };
        if (paginationDto.active == false) {
            activeCondition = { active: false };
        }
        const filter = await (0, jwt_helper_1.multiSelectorFunction)(paginationDto);
        const channelPartner = await this.userModel.aggregate([
            { $match: activeCondition },
            {
                $match: {
                    $or: [
                        { firstName: { $regex: paginationDto.search, '$options': 'i' } },
                        { firmName: { $regex: paginationDto.search, '$options': 'i' } },
                        { email: { $regex: paginationDto.search, '$options': 'i' } },
                    ]
                }
            },
            {
                $lookup: {
                    from: "romasters",
                    localField: "roId",
                    foreignField: "_id",
                    pipeline: [
                        { $project: { _id: 1, roName: 1 } }
                    ],
                    as: "roInfo",
                },
            },
            {
                $project: {
                    firstName: 1,
                    lastName: 1,
                    firmName: { $ifNull: [{ $first: "$roInfo.roName" }, "CG"] },
                    email: 1,
                    password: { $ifNull: ["$viewPassword", ""] },
                    active: 1,
                    userType: 1
                }
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
        if (!channelPartner) {
            throw new common_1.BadRequestException('Data Not Found');
        }
        return channelPartner;
    }
    ;
    async getAllRoMaster() {
        const ro = await this.roMasterModel.aggregate([
            {
                $match: { isActive: true }
            },
        ]).exec();
        if (!ro) {
            throw new common_1.BadRequestException('Data Not Found');
        }
        return ro;
    }
    ;
    async getUserInfo(id) {
        try {
            const data = await this.userModel.aggregate([
                { $match: { "_id": ObjectId(id) } },
                {
                    $lookup: {
                        from: "romasters",
                        localField: "roId",
                        foreignField: "_id",
                        pipeline: [
                            { $project: { _id: 1, roName: 1 } }
                        ],
                        as: "roInfo",
                    },
                },
                {
                    $project: {
                        firstName: 1,
                        lastName: 1,
                        email: 1,
                        password: { $ifNull: ["$viewPassword", "$password"] },
                        active: 1,
                        userType: 1,
                        firmName: { $ifNull: [{ $first: "$roInfo.roName" }, "CG"] },
                        roId: { $ifNull: ["$roId", ""] },
                        isReplenishmentRecommendations: { $ifNull: ["$isReplenishmentRecommendations", false] },
                        isAcceptingProduction: { $ifNull: ["$isAcceptingProduction", false] },
                        isHandlingWip: { $ifNull: ["$isHandlingWip", false] },
                        isDispatching: { $ifNull: ["$isDispatching", false] },
                        isHoViewCgOrder: { $ifNull: ["$isHoViewCgOrder", false] },
                        isHoViewCgInventory: { $ifNull: ["$isHoViewCgInventory", false] },
                        isHoViewCgConsumption: { $ifNull: ["$isHoViewCgConsumption", false] },
                        isHoViewROOrder: { $ifNull: ["$isHoViewROOrder", false] },
                        isHoViewRoInventory: { $ifNull: ["$isHoViewRoInventory", false] },
                        isHoViewRoConsumption: { $ifNull: ["$isHoViewRoConsumption", false] },
                        isHoViewSilverProduct: { $ifNull: ["$isHoViewSilverProduct", false] },
                        isHoViewRoMaster: { $ifNull: ["$isHoViewRoMaster", false] },
                        isUpdateAccessRo: { $ifNull: ["$isUpdateAccessRo", false] },
                    }
                },
                { $limit: 1 },
            ]).exec();
            if (!data) {
                throw new common_1.BadRequestException('Data Not Found');
            }
            return new auth_response_dto_2.UserResponseDto(data[0]);
        }
        catch (e) {
            throw new common_1.InternalServerErrorException(e);
        }
    }
    ;
    async UpdateUser(id, userDto) {
        try {
            const user = await this.userModel.findOne({ _id: id });
            const findItemCode = await this.userModel.find({ email: userDto.email, _id: { $ne: id } });
            if (findItemCode.length > 0) {
                throw new common_1.BadRequestException("Email already exist");
            }
            let password = "";
            let viewPassword = "";
            const validate = await bcrypt.compare(userDto.password, user.viewPassword);
            if (validate) {
                password = user.password;
                viewPassword = user.viewPassword;
            }
            else {
                const saltOrRounds = 10;
                password = await bcrypt.hash(userDto.password, saltOrRounds);
                viewPassword = userDto.password;
            }
            return await this.userModel.findByIdAndUpdate(id, Object.assign(Object.assign({}, userDto), { viewPassword: viewPassword, password: password }), { new: true, useFindAndModify: false });
        }
        catch (e) {
            throw new common_1.InternalServerErrorException(e);
        }
    }
    ;
    async updateUserStatus(id, statusUserDto) {
        try {
            return await this.userModel.findByIdAndUpdate(statusUserDto.userid, { active: statusUserDto.active }, { new: true, useFindAndModify: false });
        }
        catch (e) {
            throw new common_1.InternalServerErrorException(e);
        }
    }
    ;
    async importusers(createUserDto) {
        try {
            let errorArrray = [];
            const dataArray = Array.isArray(createUserDto) ? createUserDto : Object.values(createUserDto);
            const mappedArray = await Promise.all(dataArray.map(async (user) => {
                const existUser = await this.userModel.findOne({ email: user.email });
                const existRo = await this.roMasterModel.findOne({ roName: user.firmName });
                let errString = "";
                const checkBlank = (property, errorMessage) => {
                    if (property === "" || property === null || property === "null") {
                        errString += `${errorMessage},`;
                    }
                };
                checkBlank(user.firstName, "firstName is blank");
                checkBlank(user.lastName, "lastName is blank");
                checkBlank(user.firmName, "firmName is blank");
                checkBlank(user.email, "email is blank");
                checkBlank(user.password, "password is blank");
                checkBlank(user.userType, "userType is blank");
                const validUserTypes = ["ADMIN", "RO", "HO"];
                if (!validUserTypes.includes(user.userType)) {
                    errString += "Invalid user type,";
                }
                if (!errString) {
                    const saltOrRounds = 10;
                    let password = user.password;
                    if (user.password) {
                        if (!isNaN(user.password)) {
                            user.password = `${user.password}`;
                        }
                        user.password = await bcrypt.hash(user.password, saltOrRounds);
                        user["viewPassword"] = password;
                    }
                    if (!existUser) {
                        if (user.userType === "ADMIN" || user.userType === "HO") {
                            await this.userModel.create(Object.assign({}, user));
                        }
                        else if (user.userType === "RO") {
                            if (user.firmName) {
                                if (existRo) {
                                    await this.userModel.create(Object.assign(Object.assign({}, user), { roId: existRo._id }));
                                }
                                else {
                                    errString += "firmName does not exist,";
                                }
                            }
                            else {
                                errString += "firmName is blank,";
                            }
                        }
                    }
                    else if (existUser !== null) {
                        if (user.userType === "ADMIN" || user.userType === "HO") {
                            if (existUser.email === user.email) {
                                await this.userModel.findOneAndUpdate({ email: user.email }, Object.assign(Object.assign({}, user), { viewPassword: existUser.viewPassword }), { new: true, setDefaultsOnInsert: false }).lean();
                            }
                        }
                        else if (user.userType === "RO") {
                            if (user.firmName) {
                                if (existRo) {
                                    await this.userModel.create(Object.assign(Object.assign({}, user), { roId: existRo._id }));
                                }
                                else {
                                    errString += "firmName does not exist,";
                                }
                            }
                            else {
                                errString += "firmName is blank,";
                            }
                        }
                    }
                    else {
                        if (existUser !== null && existUser.email === user.email) {
                            errString += "duplicate email,";
                        }
                    }
                }
                if (errString !== "") {
                    user["error"] = errString;
                    errorArrray.push(user);
                }
            }));
            return new auth_response_dto_2.UserResponseDto({ mappedArray: mappedArray, errorArrray: errorArrray });
        }
        catch (e) {
            throw new common_1.InternalServerErrorException(e);
        }
    }
    ;
    async getOrderDropDown() {
        try {
            const user = await this.userModel
                .aggregate([
                {
                    $match: { active: true },
                },
                {
                    $lookup: {
                        from: "romasters",
                        localField: "roId",
                        foreignField: "_id",
                        pipeline: [
                            { $project: { _id: 1, roName: 1 } }
                        ],
                        as: "roInfo",
                    },
                },
                {
                    $project: {
                        firstName: 1,
                        firmName: { $ifNull: [{ $first: "$roInfo.roName" }, "CG"] },
                        email: 1,
                        userType: 1
                    }
                },
            ])
                .exec();
            if (!user) {
                throw new common_1.BadRequestException("Data Not Found");
            }
            return user;
        }
        catch (e) {
            throw new common_1.InternalServerErrorException(e);
        }
    }
    ;
};
AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, mongoose_1.InjectModel)(users_entity_1.User.name)),
    __param(2, (0, mongoose_1.InjectModel)(roMaster_1.RoMaster.name)),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        mongoose_2.Model,
        mongoose_2.Model])
], AuthService);
exports.AuthService = AuthService;
;
//# sourceMappingURL=auth.service.js.map