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
exports.CgOrderService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const googleapis_1 = require("googleapis");
const ObjectId = require("mongoose").Types.ObjectId;
const users_entity_1 = require("../../entities/users.entity");
const cgOrder_1 = require("../../entities/Silver/cgOrder");
const cgInventory_1 = require("../../entities/Silver/cgInventory");
const silverProductMaster_1 = require("../../entities/Silver/silverProductMaster");
const cgConsumption_1 = require("../../entities/Silver/cgConsumption");
const roMaster_1 = require("../../entities/Silver/roMaster");
const jwt_helper_1 = require("../../common/utils/jwt.helper");
let CgOrderService = class CgOrderService {
    constructor(cgInventoryModel, productModel, roMasterModel, userModel, cgConsumptionModel, cgOrderModel) {
        this.cgInventoryModel = cgInventoryModel;
        this.productModel = productModel;
        this.roMasterModel = roMasterModel;
        this.userModel = userModel;
        this.cgConsumptionModel = cgConsumptionModel;
        this.cgOrderModel = cgOrderModel;
        this.spreadsheetId = 'YOUR_SPREADSHEET_ID';
    }
    async getOpenOrder(productId) {
        try {
            const result = await this.cgOrderModel.aggregate([
                {
                    $match: {
                        active: true,
                        $and: [
                            {
                                productId: ObjectId(productId)
                            },
                            {
                                $and: [{ "cg.stage": "ACCEPT" }, { "wip.stage": "PENDING" },]
                            }
                        ]
                    }
                },
                {
                    $group: {
                        _id: null,
                        totalQuantity: { $sum: '$qty' }
                    }
                }
            ]);
            const openOrder = result.length > 0 ? result[0].totalQuantity : 0;
            return openOrder;
        }
        catch (e) {
            throw new common_1.InternalServerErrorException(e);
        }
    }
    ;
    async getIndianDate(date) {
        try {
            var currentTime = new Date(date);
            var options = {
                timeZone: 'Asia/Kolkata',
                hour12: true,
                hour: 'numeric',
                minute: 'numeric',
                second: 'numeric'
            };
            var currentIndianTime = currentTime.toLocaleString('en-IN', options);
            return `${currentTime.getDate()}/${currentTime.getMonth() + 1}/${currentTime.getFullYear()} ${currentIndianTime}`;
        }
        catch (e) {
            throw new common_1.InternalServerErrorException(e);
        }
    }
    ;
    async addDataInxlsxFile(dataArray, range) {
        try {
            const spreadsheetId = process.env.SPREADSHEETID;
            const auth = new googleapis_1.google.auth.GoogleAuth({
                credentials: {
                    client_email: process.env.CLIENT_EMAIL,
                    private_key: process.env.PRIVATE_KEY.replace(/\\n/g, '\n'),
                },
                scopes: ['https://www.googleapis.com/auth/spreadsheets'],
            });
            const authToken = await auth.getClient();
            const sheet = googleapis_1.google.sheets({ version: 'v4', auth: authToken });
            async function readSheetData() {
                try {
                    const data = await sheet.spreadsheets.values.get({
                        spreadsheetId,
                        range: `${range}!A1:Z`,
                    });
                    const values = data.data.values;
                }
                catch (error) {
                    console.error("Error reading sheet data:", error.message);
                }
            }
            function isMatchAsync(obj2, orderID) {
                return obj2[0] === orderID;
            }
            async function writeMultipleSheetData(dataArray) {
                try {
                    const data = await sheet.spreadsheets.values.get({
                        spreadsheetId,
                        range: `${range}!A1:Z`,
                    });
                    const existingValues = data.data.values || [];
                    const uniqueOrderIDs = [];
                    const newData = dataArray.filter((newItem) => {
                        if (newItem.Order_ID && !uniqueOrderIDs.includes(newItem.Order_ID)) {
                            uniqueOrderIDs.push(newItem.Order_ID);
                            const isMatchArray = existingValues.map((obj2) => isMatchAsync(obj2, newItem.Order_ID));
                            const isMatch = isMatchArray.some((match) => match);
                            if (!isMatch) {
                                console.log("Adding new item:", newItem.Order_ID);
                                existingValues.push([
                                    newItem.Order_ID,
                                    newItem.Stage,
                                    newItem.Status,
                                    newItem.QTY,
                                    newItem.TOG,
                                    newItem.On_Hand_Stock,
                                    newItem.Unit,
                                    newItem.Open_Order,
                                    newItem.Qualified_Demand,
                                    newItem.CP_Name,
                                    newItem.Item_Code,
                                    newItem.Item_Description,
                                    newItem.Product_Name,
                                    newItem.Net_Flow,
                                    newItem.Contact_Person,
                                    newItem.City,
                                    newItem.State,
                                    newItem.Date,
                                    newItem.CP_Remark
                                ]);
                                return true;
                            }
                        }
                        return false;
                    });
                    if (newData.length === 0) {
                        console.log("No new data to add.");
                        return;
                    }
                    const numRows = existingValues.length;
                    const startRow = numRows;
                    const values = newData.map((body, index) => [
                        body.Order_ID,
                        body.Stage,
                        body.Status,
                        body.QTY,
                        body.TOG,
                        body.On_Hand_Stock,
                        body.Unit,
                        body.Open_Order,
                        body.Qualified_Demand,
                        body.CP_Name,
                        body.Item_Code, ,
                        body.Item_Description,
                        body.Product_Name,
                        body.Net_Flow,
                        body.Contact_Person,
                        body.City,
                        body.State,
                        body.Date,
                        body.CP_Remark
                    ]);
                    const newRange = `Main!A${startRow}:${startRow + dataArray.length}`;
                    const resource = {
                        values: [...values]
                    };
                    const response = await sheet.spreadsheets.values.update({
                        spreadsheetId,
                        range: newRange,
                        valueInputOption: "USER_ENTERED",
                        resource,
                    });
                    console.log("Sheet updated successfully");
                    readSheetData();
                }
                catch (error) {
                    console.error("Error updating sheet:", error.message);
                }
            }
            writeMultipleSheetData(dataArray);
        }
        catch (e) {
            throw new common_1.InternalServerErrorException(e);
        }
    }
    ;
    async getAllOrder(paginationDto, req) {
        try {
            const authInfo = await (0, jwt_helper_1.getAuthUserInfo)(req.headers);
            let sortFields = {};
            const currentPage = paginationDto.currentPage || 1;
            const recordPerPage = paginationDto.recordPerPage || 10;
            const orderByFields = paginationDto.orderBy || ["createdAt"];
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
            let activeCondition = { active: true };
            if (paginationDto.active == false) {
                activeCondition = { active: false };
            }
            let orderCondition = {};
            if (paginationDto.flag == "ORDER_RECOMMENDATION") {
                orderCondition = {
                    $and: [
                        { "cg.status": true },
                        { "recommendation.status": true },
                        { "cg.stage": "PENDING" },
                    ],
                };
            }
            else if (paginationDto.flag == "CG_ACCEPT") {
                orderCondition = {
                    $and: [
                        { "cg.status": true },
                        { "cg.status": true },
                        { "cg.stage": "ACCEPT" },
                        { "cg.stage": "PENDING" },
                    ],
                };
            }
            else if (paginationDto.flag == "SP_REJECT") {
                orderCondition = {
                    $and: [
                        { "cg.status": true },
                        { "cg.status": true },
                        { "cg.stage": "REJECT" },
                        { "cg.stage": "PENDING" },
                    ],
                };
            }
            else if (paginationDto.flag == "ROTEX_ACCEPT") {
                orderCondition = {
                    $and: [
                        { "cg.status": true },
                        { "wip.status": true },
                        { "wip.stage": "PENDING" },
                        { "cg.stage": "ACCEPT" },
                    ],
                };
            }
            else if (paginationDto.flag == "ROTEX_REJECT") {
                orderCondition = {
                    $and: [
                        { "cg.status": true },
                        { "wip.status": true },
                        { "cg.stage": "REJECT" },
                        { "wip.stage": "PENDING" },
                    ],
                };
            }
            else if (paginationDto.flag == "WIP") {
                orderCondition = {
                    $and: [{ "wip.status": true }, { "wip.stage": "PENDING" }],
                };
            }
            else if (paginationDto.flag == "GRN") {
                orderCondition = {
                    $and: [
                        { "in_trasit.status": true },
                        { "in_trasit.stage": "PENDING" },
                    ],
                };
            }
            else {
                orderCondition = {};
            }
            const filter = await (0, jwt_helper_1.multiSelectorFunction)(paginationDto);
            const order = await this.cgOrderModel.aggregate([
                {
                    $match: activeCondition,
                },
                {
                    $match: orderCondition,
                },
                {
                    $lookup: {
                        from: "silverproducts",
                        localField: "productId",
                        foreignField: "_id",
                        pipeline: [
                            {
                                $project: {
                                    _id: 1,
                                    itemCode: 1,
                                    itemDescription: 1,
                                    productName: 1,
                                    categoryid: 1,
                                    subcategoryid: 1,
                                    unitid: 1,
                                    groupid: 1,
                                    finalPrice: 1,
                                },
                            },
                        ],
                        as: "productInfo",
                    },
                },
                {
                    $lookup: {
                        from: "silvercategories",
                        localField: "productInfo.categoryid",
                        foreignField: "_id",
                        pipeline: [{ $project: { _id: 1, categoryName: 1, categoryCode: 1 } }],
                        as: "categoryInfo",
                    },
                },
                {
                    $lookup: {
                        from: "silversubcategories",
                        localField: "productInfo.subcategoryid",
                        foreignField: "_id",
                        pipeline: [{ $project: { _id: 1, subcategoryName: 1, subcategoryCode: 1 } }],
                        as: "subcategoryInfo",
                    },
                },
                {
                    $lookup: {
                        from: "silverunits",
                        localField: "productInfo.unitid",
                        foreignField: "_id",
                        pipeline: [{ $project: { _id: 1, unit: 1, unitCode: 1 } }],
                        as: "unitInfo",
                    },
                },
                {
                    $lookup: {
                        from: "silverunits",
                        localField: "productInfo.unitid",
                        foreignField: "_id",
                        pipeline: [{ $project: { _id: 1, unit: 1, unitCode: 1 } }],
                        as: "unitInfo",
                    },
                },
                {
                    $lookup: {
                        from: "silvergroups",
                        localField: "productInfo.groupid",
                        foreignField: "_id",
                        pipeline: [{ $project: { _id: 1, group: 1, groupCode: 1 } }],
                        as: "groupInfo",
                    },
                },
                {
                    $lookup: {
                        from: "cginventories",
                        localField: "inventoryId",
                        foreignField: "_id",
                        pipeline: [{ $project: { _id: 1, qualifiedDemand: 1, tog: 1, openOrder: 1, onHandStock: 1, newFlow: 1, } }],
                        as: "cginventoriesInfo",
                    },
                },
                {
                    $project: {
                        qualifiedDemand: { $ifNull: [{ $first: "$cginventoriesInfo.qualifiedDemand" }, 0] },
                        tog: { $ifNull: [{ $first: "$cginventoriesInfo.tog" }, 0] },
                        itemCode: { $ifNull: [{ $first: "$productInfo.itemCode" }, 0] },
                        itemDescription: { $ifNull: [{ $first: "$productInfo.itemDescription" }, ""], },
                        productName: { $ifNull: [{ $first: "$productInfo.productName" }, ""], },
                        categoryid: { $ifNull: [{ $first: "$productInfo.categoryid" }, ""], },
                        subcategoryid: { $ifNull: [{ $first: "$productInfo.subcategoryid" }, ""], },
                        productId: { $ifNull: [{ $first: "$productInfo._id" }, ""] },
                        categoryName: { $ifNull: [{ $first: "$categoryInfo.categoryName" }, ""], },
                        subCategoryName: { $ifNull: [{ $first: "$subcategoryInfo.subcategoryName" }, ""], },
                        qty: { $ifNull: ["$qty", 0] },
                        unit: { $ifNull: [{ $first: "$unitInfo.unit" }, 0] },
                        group: { $ifNull: [{ $first: "$groupInfo.group" }, 0] },
                        plant: { $ifNull: ["$plant", ""] },
                        flags: { $ifNull: ["$flag", "BLACK"] },
                        status: { $ifNull: ["$flag", "BLACK"] },
                        onHandStock: { $ifNull: [{ $first: "$cginventoriesInfo.onHandStock" }, 0] },
                        openOrder: { $ifNull: [{ $first: "$cginventoriesInfo.openOrder" }, 0] },
                        netFlow: { $ifNull: [{ $first: "$cginventoriesInfo.netFlow" }, 0] },
                        flag: { $ifNull: ["$flag", "BLACK"] },
                        recommendation: "$recommendation",
                        cg: "$cg",
                        wip: "$wip",
                        in_trasit: "$in_trasit",
                        grn: "$grn",
                        inventoryInfo: "$inventoryInfo",
                        uniqueNumber: { $ifNull: ["$uniqueNumber", 0] },
                        createdAt: { $ifNull: ["$createdAt", 0] },
                        acceptedByCpQty: {
                            $cond: {
                                if: { $eq: ["$cg.stage", "ACCEPT"] },
                                then: { $ifNull: ["$cg.qty", 0] },
                                else: ""
                            }
                        },
                        recQtyAndCpQtyDiff: {
                            $cond: {
                                if: { $eq: ["$cg.stage", "ACCEPT"] },
                                then: {
                                    $subtract: [{ $ifNull: ["$recommendation.qty", 0] }, {
                                            $ifNull: [{
                                                    $cond: {
                                                        if: { $eq: ["$cg.stage", "ACCEPT"] },
                                                        then: { $ifNull: ["$cg.qty", 0] },
                                                        else: 0
                                                    }
                                                }, 0]
                                        }]
                                },
                                else: ""
                            }
                        },
                        acceptedByRotexQty: {
                            $cond: {
                                if: { $eq: ["$cg.stage", "ACCEPT"] },
                                then: { $ifNull: ["$cg.qty", 0] },
                                else: 0
                            }
                        },
                        cpQtyAndRotexQtyDiff: {
                            $cond: {
                                if: { $eq: ["$cg.stage", "ACCEPT"] },
                                then: {
                                    $subtract: [{
                                            $ifNull: [{
                                                    $cond: {
                                                        if: { $eq: ["$cg.stage", "ACCEPT"] },
                                                        then: { $ifNull: ["$cg.qty", 0] },
                                                        else: 0
                                                    }
                                                }, 0]
                                        }, {
                                            $ifNull: [{
                                                    $cond: {
                                                        if: { $eq: ["$cg.stage", "ACCEPT"] },
                                                        then: { $ifNull: ["$cg.qty", 0] },
                                                        else: 0
                                                    }
                                                }, 0]
                                        }]
                                },
                                else: ""
                            }
                        },
                        wipQty: {
                            $cond: {
                                if: { $eq: ["$wip.stage", "ACCEPT"] },
                                then: { $ifNull: ["$wip.qty", 0] },
                                else: "",
                            }
                        },
                        isPartialDispatch: {
                            $cond: {
                                if: { $or: [{ $eq: ["$cg.stage", "PENDING"] }, { $eq: ["$cg.stage", "PENDING"] }] },
                                then: "",
                                else: { $ifNull: ["$wip.isPartialDispatch", false] },
                            }
                        },
                        in_trasitQty: {
                            $cond: {
                                if: { $eq: ["$wip.isPartialDispatch", true] },
                                then: { $ifNull: ["$wip.partialDispatchQty", 0] },
                                else: { $ifNull: ["$wip.qty", 0] },
                            }
                        },
                        grnQty: {
                            $cond: {
                                if: { $eq: ["$grn.stage", "ACCEPT"] },
                                then: { $ifNull: ["$grn.qty", 0] },
                                else: "",
                            }
                        },
                        recommendedDate: { $ifNull: ["$recommendation.createdAt", ""] },
                        cpDate: {
                            $cond: {
                                if: { $eq: ["$cg.stage", "ACCEPT"] },
                                then: { $ifNull: ["$cg.createdAt", ""] },
                                else: "",
                            }
                        },
                        dateRange: {
                            $cond: {
                                if: { $eq: ["$cg.stage", "ACCEPT"] },
                                then: {
                                    $let: {
                                        vars: {
                                            dateParts: {
                                                $dateToParts: {
                                                    date: {
                                                        $convert: {
                                                            input: "$cg.createdAt",
                                                            to: "date",
                                                            onError: new Date(0),
                                                            onNull: new Date(0)
                                                        }
                                                    },
                                                    timezone: "UTC"
                                                }
                                            }
                                        },
                                        in: {
                                            $dateFromParts: {
                                                year: "$$dateParts.year",
                                                month: "$$dateParts.month",
                                                day: "$$dateParts.day",
                                                hour: 0,
                                                minute: 0,
                                                second: 0,
                                                millisecond: 0,
                                                timezone: "UTC"
                                            }
                                        }
                                    }
                                },
                                else: ""
                            }
                        },
                        rotexDate: {
                            $cond: {
                                if: { $eq: ["$cg.stage", "ACCEPT"] },
                                then: { $ifNull: ["$cg.createdAt", ""] },
                                else: "",
                            }
                        },
                        wipDate: {
                            $cond: {
                                if: { $eq: ["$wip.stage", "ACCEPT"] },
                                then: { $ifNull: ["$cg.createdAt", ""] },
                                else: "",
                            }
                        },
                        dispatchDate: {
                            $cond: {
                                if: { $eq: ["$wip.stage", "ACCEPT"] },
                                then: { $ifNull: ["$wip.createdAt", ""] },
                                else: "",
                            }
                        },
                        grnDate: {
                            $cond: {
                                if: { $eq: ["$in_trasit.stage", "ACCEPT"] },
                                then: { $ifNull: ["$in_trasit.createdAt", ""] },
                                else: "",
                            }
                        },
                        cpAcceptanceDelayDays: {
                            $cond: {
                                if: { $eq: ["$cg.stage", "ACCEPT"] },
                                then: { $ifNull: [{ $divide: [{ $subtract: [{ $toDate: "$cg.createdAt" }, { $toDate: "$recommendation.createdAt" }] }, 1000 * 60 * 60 * 24] }, 0] },
                                else: "",
                            }
                        },
                        grnLeadTime: {
                            $cond: {
                                if: { $eq: ["$grn.stage", "ACCEPT"] },
                                then: { $ifNull: [{ $divide: [{ $subtract: [{ $toDate: "$in_trasit.createdAt" }, { $toDate: "$wip.createdAt" }] }, 1000 * 60 * 60 * 24] }, 0] },
                                else: "",
                            }
                        },
                        newField: {
                            $concat: ["PROD", " ", { $toString: "$uniqueNumber" }]
                        },
                        qualifiedDemandValue: {
                            $ifNull: [
                                {
                                    $multiply: [
                                        { $ifNull: [{ $toDouble: { $first: "$cginventoriesInfo.qualifiedDemand" } }, 1] },
                                        { $ifNull: [{ $toDouble: { $first: "$productInfo.finalPrice" } }, 1] }
                                    ]
                                },
                                1
                            ]
                        },
                        proRecommendationValue: {
                            $ifNull: [
                                {
                                    $multiply: [
                                        { $ifNull: [{ $toDouble: "$qty" }, 1] },
                                        { $ifNull: [{ $toDouble: { $first: "$productInfo.finalPrice" } }, 1] }
                                    ]
                                },
                                1
                            ]
                        },
                    },
                },
                { $match: filter },
                {
                    $match: {
                        $or: [
                            { city: { $regex: paginationDto.search, $options: "i" } },
                            { state: { $regex: paginationDto.search, $options: "i" } },
                            { itemDescription: { $regex: paginationDto.search, $options: "i", }, },
                            { itemDescription: { $eq: paginationDto.search } },
                            { itemCode: { $regex: paginationDto.search, $options: "i" } },
                            { productName: { $regex: paginationDto.search, $options: "i" }, },
                            { categoryName: { $regex: paginationDto.search, $options: "i" }, },
                            { subCategoryName: { $eq: parseInt(paginationDto.search) } },
                            { qty: { $eq: parseInt(paginationDto.search) } },
                            { unit: { $eq: parseInt(paginationDto.search) } },
                            { flags: { $eq: parseInt(paginationDto.search) } },
                            { uniqueNumber: { $eq: parseInt(paginationDto.search) } },
                            { plant: { $eq: parseInt(paginationDto.search) } },
                            { recommendedQty: { $eq: parseInt(paginationDto.search) } },
                            { recQtyAndOrdQtyDiff: { $eq: parseInt(paginationDto.search) } },
                            { createdAt: { $regex: paginationDto.search, $options: "i" }, },
                            { newField: { $regex: paginationDto.search, $options: "i" }, },
                        ],
                    },
                },
                {
                    $facet: {
                        paginate: [
                            { $count: "totalDocs" },
                            {
                                $addFields: {
                                    recordPerPage: recordPerPage,
                                    currentPage: currentPage,
                                },
                            },
                        ],
                        docs: [
                            { $sort: { [orderByFields[0]]: 1 } },
                            {
                                $addFields: {
                                    customOrder: {
                                        $switch: {
                                            branches: [
                                                { case: { $eq: ["$status", "BLACK"] }, then: 1 },
                                                { case: { $eq: ["$status", "RED"] }, then: 2 },
                                                { case: { $eq: ["$status", "YELLOW"] }, then: 3 },
                                                { case: { $eq: ["$status", "GREEN"] }, then: 4 },
                                                { case: { $eq: ["$status", "WHIGHT"] }, then: 5 },
                                            ],
                                        },
                                    },
                                },
                            },
                            {
                                $sort: { customOrder: 1 },
                            },
                            { $skip: (currentPage - 1) * recordPerPage },
                            { $limit: recordPerPage },
                        ],
                    },
                },
            ])
                .exec();
            if (!order || !order[0]) {
                throw new common_1.BadRequestException("Data Not Found");
            }
            order[0].docs.forEach((ele) => {
                if (ele.grn.status === true) {
                    ele["stage"] = ele.grn.stage;
                }
                else if (ele.in_trasit.status === true) {
                    ele["stage"] = ele.in_trasit.stage;
                }
                else if (ele.wip.status === true) {
                    ele["stage"] = ele.wip.stage;
                }
                else if (ele.cg.status === true) {
                    ele["stage"] = ele.cg.stage;
                }
                else if (ele.recommendation.status === true) {
                    ele["stage"] = ele.recommendation.stage;
                }
            });
            return order;
        }
        catch (e) {
            console.log(e, 343534);
            throw new common_1.InternalServerErrorException(e);
        }
    }
    ;
    async getPartialOrderInfo(uniqueNumber) {
        try {
            const maxPartialUniqueNumberResult = await this.cgOrderModel.aggregate([
                {
                    $match: {
                        uniqueNumber: uniqueNumber,
                        "wip.isPartialDispatch": true
                    }
                },
                {
                    $group: {
                        _id: "$uniqueNumber",
                        maxPartialUniqueNumber: { $max: "$partialUniqueNumber" }
                    }
                }
            ]);
            const maxPartialUniqueNumber = maxPartialUniqueNumberResult.length > 0 ? maxPartialUniqueNumberResult[0].maxPartialUniqueNumber : null;
            let order = [];
            order = await this.cgOrderModel.aggregate([
                {
                    $match: {
                        uniqueNumber: uniqueNumber,
                        "wip.isPartialDispatch": true,
                        partialUniqueNumber: { $ne: maxPartialUniqueNumber }
                    }
                },
                {
                    $project: {
                        _id: 1,
                        uniqueNumber: 1,
                        partialUniqueNumber: 1,
                        wip: 1,
                        remainingQty: "$wip.qty"
                    }
                }
            ]);
            return order;
        }
        catch (e) {
            throw new common_1.InternalServerErrorException(e);
        }
    }
    async getOrderInfo(id) {
        try {
            const order = await this.cgOrderModel
                .aggregate([
                { $match: { _id: ObjectId(id) } },
                {
                    $lookup: {
                        from: "silverproducts",
                        localField: "productId",
                        foreignField: "_id",
                        pipeline: [
                            {
                                $project: {
                                    _id: 1,
                                    itemCode: 1,
                                    itemDescription: 1,
                                    productName: 1,
                                    categoryid: 1,
                                    subcategoryid: 1,
                                    unitid: 1,
                                    moq: 1,
                                    leadTime: 1,
                                },
                            },
                        ],
                        as: "productInfo",
                    },
                },
                {
                    $lookup: {
                        from: "silvercategories",
                        localField: "productInfo.categoryid",
                        foreignField: "_id",
                        pipeline: [{ $project: { _id: 1, categoryName: 1 } }],
                        as: "categoryInfo",
                    },
                },
                {
                    $lookup: {
                        from: "silversubcategories",
                        localField: "productInfo.subcategoryid",
                        foreignField: "_id",
                        pipeline: [{ $project: { _id: 1, flag: 1 } }],
                        as: "subcategoryInfo",
                    },
                },
                {
                    $lookup: {
                        from: "cginventories",
                        localField: "inventoryId",
                        foreignField: "_id",
                        pipeline: [{ $project: { _id: 1, subcategoryName: 1, openOrder: 1, netFlow: 1, onHandStock: 1, qualifiedDemand: 1 } }],
                        as: "inventoryInfo",
                    },
                },
                {
                    $project: {
                        productId: "$productId",
                        inventoryId: "$inventoryId",
                        qty: "$qty",
                        recommendation: "$recommendation",
                        cg: "$cg",
                        wip: "$wip",
                        in_trasit: "$in_trasit",
                        grn: "$grn",
                        createdAt: "$createdAt",
                        createdBy: "$createdBy",
                        tog: { $ifNull: [{ $floor: { $first: "$inventoryInfo.tog" } }, 0] },
                        status: {
                            $ifNull: [{ $first: "$inventoryInfo.flag" }, "BLACK"],
                        },
                        openOrder: {
                            $ifNull: [{ $first: "$inventoryInfo.openOrder" }, 0],
                        },
                        moq: { $ifNull: [{ $first: "$inventoryInfo.moq" }, 0] },
                        leadTime: {
                            $ifNull: [{ $first: "$inventoryInfo.leadTime" }, 0],
                        },
                        netFlow: { $ifNull: [{ $first: "$inventoryInfo.netFlow" }, 0] },
                        onHandStock: {
                            $ifNull: [{ $first: "$inventoryInfo.onHandStock" }, 0],
                        },
                        qualifiedDemand: {
                            $ifNull: [{ $first: "$inventoryInfo.qualifiedDemand" }, 0],
                        },
                        categoryName: {
                            $ifNull: [{ $first: "$categoryInfo.categoryName" }, ""],
                        },
                        subCategoryName: {
                            $ifNull: [{ $first: "$subcategoryInfo.subcategoryName" }, ""],
                        },
                        itemCode: { $ifNull: [{ $first: "$productInfo.itemCode" }, 0] },
                        itemDescription: {
                            $ifNull: [{ $first: "$productInfo.itemDescription" }, ""],
                        },
                        productName: {
                            $ifNull: [{ $first: "$productInfo.productName" }, ""],
                        },
                        categoryid: {
                            $ifNull: [{ $first: "$productInfo.categoryid" }, ""],
                        },
                        uniqueNumber: { $ifNull: ["$uniqueNumber", 0] },
                    },
                },
            ])
                .exec();
            if (!order || !order[0]) {
                throw new common_1.BadRequestException("Data Not Found");
            }
            if (Array.isArray(order) && order.length) {
                let mapData = await Promise.all(order.map(async (ele) => {
                    return new Promise(async (resolve, reject) => {
                        try {
                            ele["partialOrder"] = await this.getPartialOrderInfo(ele.uniqueNumber);
                            resolve(ele);
                        }
                        catch (err) {
                            console.log("mappedData err:", err);
                            resolve(ele);
                        }
                    });
                }));
                return order;
            }
        }
        catch (e) {
            throw new common_1.InternalServerErrorException(e);
        }
    }
    ;
    async updateOrder(id, updateOrderDto) {
        try {
            const findOrder = await this.cgOrderModel.findOne({ _id: ObjectId(id) });
            if (!findOrder) {
                throw new common_1.BadRequestException("order not exist");
            }
            let inventory = await this.cgInventoryModel.findOne({ _id: ObjectId((findOrder.inventoryId).toString()) });
            let obj = {};
            let status = false;
            let grn = false;
            let condition = false;
            if (updateOrderDto.stage == "ACCEPT") {
                status = true;
            }
            let date = await (0, jwt_helper_1.dateFormate)(new Date());
            let qty = updateOrderDto.qty ? updateOrderDto.qty : findOrder.qty;
            if (findOrder.wip.status == true && findOrder.wip.stage == "PENDING") {
                if (updateOrderDto.isChangeQty) {
                    await this.cgOrderModel.findByIdAndUpdate({ _id: findOrder._id }, { $set: {
                            "qty": updateOrderDto.qty,
                            "wip.qty": updateOrderDto.qty,
                            "wip.createdAt": date,
                            "wip.isChangeQty": true
                        } });
                    obj = {
                        qty: updateOrderDto.qty,
                        "wip.qty": updateOrderDto.qty,
                        "wip.createdAt": date,
                        "wip.isChangeQty": true
                    };
                }
                else {
                    grn = true;
                    if (findOrder.wip.isPartialDispatch) {
                        obj = {
                            "wip.partialDispatchQty": 0,
                            "in_trasit.status": status,
                            "wip.stage": updateOrderDto.stage,
                            qty: qty,
                            "wip.qty": qty,
                            "wip.createdAt": date,
                        };
                    }
                    else {
                        obj = {
                            "in_trasit.status": status,
                            "wip.stage": updateOrderDto.stage,
                            qty: qty,
                            "wip.qty": qty,
                            "wip.createdAt": date,
                        };
                    }
                }
            }
            else if (findOrder.cg.status == true && findOrder.cg.stage == "PENDING") {
                obj = {
                    "wip.status": status,
                    "cg.qty": qty,
                    "cg.stage": updateOrderDto.stage,
                    qty: qty,
                    "cg.createdAt": date,
                };
                await this.cgOrderModel.findByIdAndUpdate(findOrder._id, {
                    tog: inventory.tog,
                    onHandStock: inventory.onHandStock,
                    openOrder: inventory.openOrder,
                    qualifiedDemand: inventory.qualifiedDemand,
                    netFlow: inventory.netFlow
                }, { new: true, useFindAndModify: false });
                condition = true;
            }
            else if (findOrder.in_trasit.status == true && findOrder.in_trasit.stage == "PENDING") {
                grn = true;
                obj = {
                    "grn.status": status,
                    "grn.stage": updateOrderDto.stage,
                    "in_trasit.stage": updateOrderDto.stage,
                    "in_trasit.qty": qty,
                    "grn.qty": qty,
                    qty: qty,
                    "in_trasit.createdAt": date,
                    "grn.createdAt": date,
                };
            }
            if (updateOrderDto.partcialDispatch && updateOrderDto.partcialDispatch == true && updateOrderDto.isChangeQty == false) {
                let changeQty = updateOrderDto.changeQty;
                if (updateOrderDto.changeQty == findOrder.qty || updateOrderDto.changeQty > findOrder.qty) {
                    throw new common_1.BadRequestException("Partial dispatch QTY can not be equal to Full QTY");
                }
                const maxPartialUniqueNumberResult = await this.cgOrderModel.aggregate([
                    {
                        $match: {
                            uniqueNumber: findOrder.uniqueNumber,
                            "wip.isPartialDispatch": true
                        }
                    },
                    {
                        $group: {
                            _id: "$uniqueNumber",
                            maxPartialUniqueNumber: { $max: "$partialUniqueNumber" }
                        }
                    }
                ]);
                const maxPartialUniqueNumber = maxPartialUniqueNumberResult.length > 0 ? maxPartialUniqueNumberResult[0].maxPartialUniqueNumber : null;
                let order11 = [];
                order11 = await this.cgOrderModel.aggregate([
                    {
                        $match: {
                            uniqueNumber: findOrder.uniqueNumber,
                            "wip.isPartialDispatch": true,
                            partialUniqueNumber: { $ne: maxPartialUniqueNumber }
                        }
                    },
                    {
                        $unwind: "$wip"
                    },
                    {
                        $match: {
                            "wip.isPartialDispatch": true
                        }
                    },
                    {
                        $group: {
                            _id: "$uniqueNumber",
                            totalPartialDispatchQty: { $sum: "$wip.partialDispatchQty" }
                        }
                    },
                    {
                        $project: {
                            _id: 0,
                            uniqueNumber: "$_id",
                            totalPartialDispatchQty: 1
                        }
                    }
                ]);
                let sumPartialQty = order11.length > 0 ? order11[0].totalPartialDispatchQty : 0;
                let updateQty = findOrder.cg.qty - (sumPartialQty + changeQty);
                if (findOrder.wip.isChangeQty) {
                    updateQty = findOrder.wip.qty - changeQty;
                }
                let newObj = {
                    "in_trasit.status": true,
                    "in_trasit.stage": "PENDING",
                    "wip.stage": updateOrderDto.stage,
                    "wip.partialDispatchQty": changeQty,
                    "wip.qty": updateQty,
                    "wip.createdAt": date,
                    "wip.isPartialDispatch": true,
                    $set: { "in_trasit.isPartialDispatch": true }
                };
                await this.cgOrderModel.findByIdAndUpdate(findOrder._id, Object.assign(Object.assign({}, newObj), { qty: changeQty }), { new: true, useFindAndModify: false });
                let afterOrder = await this.cgOrderModel.findOne({ _id: findOrder._id });
                let findUniqueNumber = await this.cgOrderModel.find({ uniqueNumber: afterOrder.uniqueNumber }).sort({ partialUniqueNumber: -1 }).exec();
                let partialUniqueNumber = findUniqueNumber[0].partialUniqueNumber > 0 ? findUniqueNumber[0].partialUniqueNumber : 1;
                if (partialUniqueNumber >= 1) {
                    partialUniqueNumber = findUniqueNumber[0].partialUniqueNumber + 1;
                }
                const test = await new this.cgOrderModel({
                    productId: afterOrder.productId,
                    qty: Number(qty - changeQty) ? Number(qty - changeQty) : 0,
                    inventoryId: afterOrder.inventoryId,
                    status: afterOrder.status,
                    createdAt: date,
                    uniqueNumber: afterOrder.uniqueNumber,
                    recommendation: afterOrder.recommendation,
                    cg: afterOrder.cg,
                    "wip.isChangeQty": findOrder.wip.isChangeQty,
                    "wip.status": true,
                    "wip.stage": "PENDING",
                    "wip.createdAt": afterOrder.wip.createdAt,
                    "wip.qty": Number(qty - changeQty) ? Number(qty - changeQty) : 0,
                    "wip.isPartialDispatch": true,
                    "wip.partialDispatchQty": changeQty,
                    partialUniqueNumber: partialUniqueNumber
                }).save();
            }
            else {
                await this.cgOrderModel.findByIdAndUpdate(findOrder._id, Object.assign(Object.assign({}, obj), { qty: updateOrderDto.qty }), { new: true, useFindAndModify: false });
            }
            let findInventory = await this.cgInventoryModel.findOne({ _id: findOrder.inventoryId });
            let onHandStock = findInventory.onHandStock;
            let orderRecommendation = 0;
            let onHandStatus = 0;
            let flag = "WHIGHT";
            if (grn) {
                if (updateOrderDto.partcialDispatch == true) {
                    onHandStock = updateOrderDto.changeQty > 0 ? Math.abs(Number(findInventory.onHandStock) + Number(updateOrderDto.changeQty)) : findInventory.onHandStock;
                }
                else {
                    onHandStock = updateOrderDto.qty > 0 ? Math.abs(Number(findInventory.onHandStock) + Number(updateOrderDto.qty)) : findInventory.onHandStock;
                }
                const openOrder = await this.getOpenOrder(findInventory.productId);
                const order_recommentdation = await this.cgOrderModel.aggregate([
                    {
                        $match: {
                            active: true,
                            $and: [
                                {
                                    productId: findInventory.productId
                                },
                                {
                                    "cg.stage": "PENDING"
                                }
                            ]
                        }
                    },
                    {
                        $group: {
                            _id: null,
                            totalQuantity: { $sum: '$qty' }
                        }
                    }
                ]);
                let order = order_recommentdation.length > 0 ? order_recommentdation[0].totalQuantity : 0;
                let totalOrder = openOrder + onHandStock;
                let netFlow = Number(onHandStock + openOrder - findInventory.qualifiedDemand);
                let moq = Number(findInventory.moq) ? Number(findInventory.moq) : 1;
                let tog_net = await Math.abs(Number(findInventory.tog - netFlow));
                if (netFlow >= findInventory.tog) {
                    orderRecommendation = 0;
                }
                else if (tog_net < moq) {
                    orderRecommendation = Number(moq);
                }
                else if (tog_net > moq) {
                    orderRecommendation = Math.abs(moq * Math.round(Math.abs(tog_net / moq)));
                }
                let orderRecommendationStatus = 0;
                if (isNaN(orderRecommendation)) {
                    orderRecommendationStatus = 0;
                }
                else {
                    orderRecommendationStatus = Math.abs((Number(orderRecommendation) * 100) / findInventory.tog);
                }
                let onHandStatusNumber = Math.abs((Number(onHandStock) * 100) / findInventory.tog);
                if (onHandStatusNumber == Infinity || isNaN(onHandStatusNumber)) {
                    onHandStatus = 0;
                }
                else {
                    onHandStatus = onHandStatusNumber;
                }
                flag = await (0, jwt_helper_1.flagFunction)(findInventory.tog, onHandStock);
                let inventoryObject = {
                    openOrder: openOrder,
                    netFlow: Math.abs(netFlow),
                    orderRecommendation: orderRecommendation,
                    orderRecommendationStatus: orderRecommendationStatus,
                    onHandStatus: onHandStatus,
                    flag: flag,
                    onHandStock: onHandStock,
                };
                await this.cgInventoryModel.findByIdAndUpdate({ _id: findOrder.inventoryId }, inventoryObject, { new: true, useFindAndModify: false });
                if (orderRecommendation >= 0) {
                    const highestValueUser = await this.cgOrderModel.findOne({}, { uniqueNumber: 1 }).sort('-uniqueNumber').exec();
                    let uniqueNumber = highestValueUser ? highestValueUser.uniqueNumber + 1 : 1;
                    await this.cgOrderModel.deleteMany({
                        inventoryId: findOrder.inventoryId,
                        "cg.stage": "PENDING"
                    });
                    let order = new this.cgOrderModel({
                        productId: findOrder.productId,
                        qty: Math.abs(Number(orderRecommendation)),
                        inventoryId: findOrder.inventoryId,
                        status: flag,
                        createdAt: date,
                        uniqueNumber: uniqueNumber,
                        "recommendation.qty": Number(orderRecommendation),
                        "cg.qty": Number(orderRecommendation),
                        "recommendation.createdAt": date,
                        "cg.createdAt": date,
                    });
                    order.save();
                }
                else if (orderRecommendation == 0) {
                    await this.cgOrderModel.updateMany({
                        inventoryId: findOrder.inventoryId,
                        "cg.stage": "PENDING"
                    }, { active: false });
                }
            }
            else if (condition) {
                onHandStock = findInventory.onHandStock;
                const order_recommentdation = await this.cgOrderModel.aggregate([
                    {
                        $match: {
                            active: true,
                            $and: [
                                {
                                    productId: findInventory.productId
                                },
                                {
                                    "cg.stage": "PENDING"
                                }
                            ]
                        }
                    },
                    {
                        $group: {
                            _id: null,
                            totalQuantity: { $sum: '$qty' }
                        }
                    }
                ]);
                let order = order_recommentdation.length > 0 ? order_recommentdation[0].totalQuantity : 0;
                const openOrder = await this.getOpenOrder(findInventory.productId) > 0 ? await this.getOpenOrder(findInventory.productId) : findInventory.openOrder;
                let totalOrder = Number(order) + openOrder + findInventory.onHandStock;
                let netFlow = Number(findInventory.onHandStock + Number(openOrder) - findInventory.qualifiedDemand);
                let moq = Number(findInventory.moq) ? Number(findInventory.moq) : 1;
                let tog_net = await Math.abs(Number(findInventory.tog - netFlow));
                if (netFlow >= findInventory.tog) {
                    orderRecommendation = 0;
                }
                else if (tog_net < moq) {
                    orderRecommendation = Number(moq);
                }
                else if (tog_net > moq) {
                    orderRecommendation = Math.abs(moq * Math.round(Math.abs(tog_net / moq)));
                }
                let orderRecommendationStatus = 0;
                if (isNaN(orderRecommendation)) {
                    orderRecommendationStatus = 0;
                }
                else {
                    orderRecommendationStatus = Math.abs((Number(orderRecommendation) * 100) / findInventory.tog);
                }
                let onHandStatusNumber = Math.abs((Number(onHandStock) * 100) / findInventory.tog);
                if (onHandStatusNumber == Infinity || isNaN(onHandStatusNumber)) {
                    onHandStatus = 0;
                }
                else {
                    onHandStatus = onHandStatusNumber;
                }
                flag = await (0, jwt_helper_1.flagFunction)(findInventory.tog, onHandStock);
                let inventoryObject = {
                    openOrder: openOrder,
                    netFlow: Math.abs(netFlow),
                    orderRecommendation: orderRecommendation,
                    orderRecommendationStatus: orderRecommendationStatus,
                    onHandStatus: onHandStatus,
                    flag: flag,
                    onHandStock: onHandStock,
                };
                await this.cgInventoryModel.findByIdAndUpdate({ _id: findOrder.inventoryId }, inventoryObject, { new: true, useFindAndModify: false });
                if (orderRecommendation >= 0) {
                    const highestValueUser = await this.cgOrderModel.findOne({}, { uniqueNumber: 1 }).sort('-uniqueNumber').exec();
                    let uniqueNumber = highestValueUser ? highestValueUser.uniqueNumber + 1 : 1;
                    await this.cgOrderModel.deleteMany({ inventoryId: findOrder.inventoryId, "cg.stage": "PENDING" });
                    let order1 = new this.cgOrderModel({
                        productId: findOrder.productId,
                        qty: Math.abs(Number(orderRecommendation)),
                        inventoryId: findOrder.inventoryId,
                        status: flag,
                        createdAt: date,
                        uniqueNumber: uniqueNumber,
                        "recommendation.qty": Number(orderRecommendation),
                        "cg.qty": Number(orderRecommendation),
                        "recommendation.createdAt": date,
                        "cg.createdAt": date,
                    });
                    order1.save();
                }
                else if (orderRecommendation == 0) {
                }
            }
        }
        catch (e) {
            throw new common_1.InternalServerErrorException(e);
        }
    }
    ;
    async dashBoardOrder(dashboardOrderDto, req) {
        try {
            let activeCondition = { active: true };
            if (dashboardOrderDto.active == false) {
                activeCondition = { active: false };
            }
            const order = await this.cgOrderModel
                .aggregate([
                { $match: activeCondition },
                {
                    $group: {
                        _id: null,
                        all: {
                            $sum: { $cond: [{ $eq: ["$active", true] }, 1, 0] },
                        },
                        wip: {
                            $sum: {
                                $cond: [
                                    {
                                        $and: [
                                            { $eq: ["$wip.status", true] },
                                            { $eq: ["$wip.stage", "ACCEPT"] },
                                        ],
                                    },
                                    1,
                                    0,
                                ],
                            },
                        },
                        accepted_cg: {
                            $sum: {
                                $cond: [
                                    {
                                        $and: [
                                            { $eq: ["$wip.status", true] },
                                            { $eq: ["$wip.stage", "PENDING"] },
                                            { $eq: ["$cg.status", true] },
                                            { $eq: ["$cg.stage", "ACCEPT"] },
                                        ],
                                    },
                                    1,
                                    0,
                                ],
                            },
                        },
                        order_recommentdation: {
                            $sum: {
                                $cond: [
                                    {
                                        $and: [
                                            { $eq: ["$cg.status", true] },
                                            { $eq: ["$cg.stage", "PENDING"] },
                                            { $eq: ["$recommendation.status", true] },
                                            { $eq: ["$recommendation.stage", "RECOMMENDATION"] },
                                        ],
                                    },
                                    1,
                                    0,
                                ],
                            },
                        },
                    },
                },
            ])
                .exec();
            return order;
        }
        catch (e) {
            throw new common_1.InternalServerErrorException(e);
        }
    }
    ;
    async getOrderDropDown(req) {
        try {
            const channelPartner = await this.cgOrderModel
                .aggregate([
                {
                    $match: { active: true },
                },
                {
                    $lookup: {
                        from: "silverproducts",
                        localField: "productId",
                        foreignField: "_id",
                        pipeline: [
                            {
                                $project: {
                                    _id: 1,
                                    itemCode: 1,
                                    itemDescription: 1,
                                    productName: 1,
                                    categoryid: 1,
                                    subcategoryid: 1,
                                    unitid: 1,
                                    industryid: 1
                                },
                            },
                        ],
                        as: "productInfo",
                    },
                },
                {
                    $lookup: {
                        from: "silvercategories",
                        localField: "productInfo.categoryid",
                        foreignField: "_id",
                        pipeline: [{ $project: { _id: 1, categoryName: 1 } }],
                        as: "categoryInfo",
                    },
                },
                {
                    $lookup: {
                        from: "silversubcategories",
                        localField: "productInfo.subcategoryid",
                        foreignField: "_id",
                        pipeline: [{ $project: { _id: 1, subcategoryName: 1 } }],
                        as: "subcategoryInfo",
                    },
                },
                {
                    $lookup: {
                        from: "cginventories",
                        localField: "inventoryId",
                        foreignField: "_id",
                        pipeline: [
                            {
                                $project: {
                                    _id: 1,
                                    tog: 1,
                                    netFlow: 1,
                                    onHandStock: 1,
                                    qualifiedDemand: 1,
                                    flag: 1,
                                    openOrder: 1,
                                },
                            },
                        ],
                        as: "inventoryInfo",
                    },
                },
                {
                    $project: {
                        itemCode: { $ifNull: [{ $first: "$productInfo.itemCode" }, 0] },
                        itemDescription: {
                            $ifNull: [{ $first: "$productInfo.itemDescription" }, ""],
                        },
                        productName: {
                            $ifNull: [{ $first: "$productInfo.productName" }, ""],
                        },
                        categoryid: {
                            $ifNull: [{ $first: "$productInfo.categoryid" }, ""],
                        },
                        subcategoryid: {
                            $ifNull: [{ $first: "$productInfo.subcategoryid" }, ""],
                        },
                        productId: { $ifNull: [{ $first: "$productInfo._id" }, ""] },
                        categoryName: {
                            $ifNull: [{ $first: "$categoryInfo.categoryName" }, ""],
                        },
                        subCategoryName: {
                            $ifNull: [{ $first: "$subcategoryInfo.subcategoryName" }, ""],
                        },
                        qty: { $ifNull: ["$qty", 0] },
                        unit: { $ifNull: [{ $first: "$unitInfo.unit" }, 0] },
                        tog: { $ifNull: [{ $floor: { $first: "$inventoryInfo.tog" } }, 0] },
                        status: {
                            $ifNull: [{ $first: "$inventoryInfo.flag" }, "BLACK"],
                        },
                        netFlow: { $ifNull: [{ $first: "$inventoryInfo.netFlow" }, 0] },
                        onHandStock: {
                            $ifNull: [{ $first: "$inventoryInfo.onHandStock" }, 0],
                        },
                        qualifiedDemand: {
                            $ifNull: [{ $first: "$inventoryInfo.qualifiedDemand" }, 0],
                        },
                        openOrder: {
                            $ifNull: [{ $first: "$inventoryInfo.openOrder" }, 0],
                        },
                        recommendation: "$recommendation",
                        createdAt: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                        cg: "$cg",
                        wip: "$wip",
                        in_trasit: "$in_trasit",
                        grn: "$grn",
                        inventoryInfo: "$inventoryInfo",
                        uniqueNumber: { $ifNull: ["$uniqueNumber", 0] },
                        cpDate: {
                            $cond: {
                                if: { $eq: ["$cg.stage", "ACCEPT"] },
                                then: { $ifNull: ["$cg.createdAt", ""] },
                                else: "",
                            }
                        },
                    },
                },
            ])
                .exec();
            if (!channelPartner) {
                throw new common_1.BadRequestException("Data Not Found");
            }
            return channelPartner;
        }
        catch (e) {
            throw new common_1.InternalServerErrorException(e);
        }
    }
    ;
};
CgOrderService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(cgInventory_1.CgInventory.name)),
    __param(1, (0, mongoose_1.InjectModel)(silverProductMaster_1.SilverProduct.name)),
    __param(2, (0, mongoose_1.InjectModel)(roMaster_1.RoMaster.name)),
    __param(3, (0, mongoose_1.InjectModel)(users_entity_1.User.name)),
    __param(4, (0, mongoose_1.InjectModel)(cgConsumption_1.CgConsumption.name)),
    __param(5, (0, mongoose_1.InjectModel)(cgOrder_1.CgOrder.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], CgOrderService);
exports.CgOrderService = CgOrderService;
;
//# sourceMappingURL=cg-order.service.js.map