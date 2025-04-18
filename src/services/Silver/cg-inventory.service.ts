import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Request } from 'express';
import { Model } from 'mongoose';
const ObjectId = require('mongoose').Types.ObjectId;
import { User, UserDocument } from '../../entities/users.entity';
import { CgOrder, CgOrderDocument } from '../../entities/Silver/cgOrder';
import { RoMaster, RoMasterDocument } from '../../entities/Silver/roMaster';
import { RoInventory, RoInventoryDocument } from '../../entities/Silver/roInventory';
import { CgInventory, CgInventoryDocument } from '../../entities/Silver/cgInventory';
import { CgConsumption, CgConsumptionDocument } from '../../entities/Silver/cgConsumption';
import { CgGrowthFactor, CgGrowthFactorDocument } from '../../entities/Silver/cggrowthFactorInfo';
import { SilverProduct, SilverProductDocument } from '../../entities/Silver/silverProductMaster';
import { getAuthUserInfo, dateFormate, flagFunction, multiSelectorFunction,around } from 'src/common/utils/jwt.helper';
import { SearchDto } from 'src/dto/pagination-dto';
import { GetCgInventoryInfoDto } from '../../Silver/cg-inventory/dto/response-cgInventory.dto';
import { ChangeTogDto, CreateCgInventoryDto, FilterPaginationCgInventoryDto, GetDashBoardCgInventoryInfo, ImportCgInventoryDto, UpdateCgInventoryDto, UpdateStatusCgInventoryDto, UpdateTogToggleDto, ViewOtherCgInventoryDto } from '../../Silver/cg-inventory/dto/request-cgInventroy.dto';

@Injectable()
export class CgInventoryService {
    constructor(
        @InjectModel(RoInventory.name) private roInventoryModel: Model<RoInventoryDocument>,
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        @InjectModel(CgInventory.name) private cgInventoryModel: Model<CgInventoryDocument>,
        @InjectModel(CgConsumption.name) private cgConsumptionModel: Model<CgConsumptionDocument>,
        @InjectModel(SilverProduct.name) private silverProductModel: Model<SilverProductDocument>,
        @InjectModel(CgOrder.name) private cgOrderModel: Model<CgOrderDocument>,
        @InjectModel(CgGrowthFactor.name) private cgGrowthModel: Model<CgGrowthFactorDocument>,
        @InjectModel(RoMaster.name) private roMasterModel: Model<RoMasterDocument>
    ){}

    async UpdateCgInventory(togData,productId) {
        try {
            let date = await dateFormate(new Date());
 

            let findInventory = await this.cgInventoryModel.findOne({
                productId: ObjectId(productId)
            });

            if (!findInventory) {
                throw new BadRequestException("Inventory not found")
            }
            let avgWeeklyConsumption;
            let orderRecommendation = 0;
            let onHandStatus = 0;
            let flag = "BLACK"
            let onHandStock = findInventory.onHandStock;
            let qualifiedDemand = findInventory.qualifiedDemand;
            const openOrder = await this.getOpenOrder(productId);
            // For Plant lead time
            let plantLeadTime =Number(findInventory.plantLeadTime );

            // For Tog
            let tog = Number(togData);
            // Fot netFlow 
            let netFlow = Number(onHandStock + openOrder - qualifiedDemand);

            // For Moq
            let moq = Number(findInventory.moq)?Number(findInventory.moq):1;
            // For net orderRecommendation
            let tog_net = await Math.abs(Number(tog - netFlow));
            if (netFlow >= tog) {

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
                orderRecommendationStatus = 0
            } else {
                orderRecommendationStatus = Math.abs(Number(orderRecommendation) * 100 / tog);

            }
            let onHandStatusNumber = Math.abs(Number(onHandStock) * 100 / tog);

            if (onHandStatusNumber == Infinity || isNaN(onHandStatusNumber)) {
                onHandStatus = 0
            } else {
                onHandStatus = onHandStatusNumber
            }


            // For onHandStatus
            flag = await flagFunction(tog, onHandStock)
            let inventoryObject = {
                avgWeeklyConsumption: avgWeeklyConsumption,
                plantLeadTime: plantLeadTime,
                tog: tog,
                openOrder: openOrder,
                netFlow: Math.abs(netFlow),
                moq: moq,
                orderRecommendation: orderRecommendation,
                orderRecommendationStatus: orderRecommendationStatus,
                onHandStatus: onHandStatus,
                onHandStock: onHandStock,
                qualifiedDemand: qualifiedDemand,
                flag: flag
            }
            await this.cgInventoryModel.findByIdAndUpdate({ _id: findInventory._id }, { ...inventoryObject }, { new: true, useFindAndModify: false })
            if (orderRecommendation >= 0) {

                await this.cgOrderModel.deleteMany({inventoryId: findInventory._id, "cg.stage": "PENDING"});

                const highestValueUser = await this.cgOrderModel.findOne({}, { uniqueNumber: 1 }).sort('-uniqueNumber').exec();
                let uniqueNumber = highestValueUser? highestValueUser.uniqueNumber+1:1;
       

                let order = new this.cgOrderModel({
                    createdBy: findInventory.createdBy,
                    qty: Number(orderRecommendation),
                    inventoryId: findInventory._id,
                    productId: findInventory.productId,
                    status: flag,
                    createdAt: date,
                    uniqueNumber: uniqueNumber,
                    "recommendation.qty": Number(orderRecommendation),
                    "cg.qty": Number(orderRecommendation),
                    "recommendation.createdAt": date,
                    "cg.createdAt": date,
                });
                order.save();

            } else if (orderRecommendation == 0) {
                await this.cgOrderModel.updateMany({inventoryId: findInventory._id,"cg.stage": "PENDING"}, { active: false });
            }
        }
        catch (e) {
           console.log(e)
        }
    };

    public async getAvgWeeklyConsumption(productId): Promise<number> {
    try {
        let avgWeeklyConsumption = 0;
        const currentDate = new Date();
        const thirteenWeeksAgo = new Date();
        thirteenWeeksAgo.setDate(currentDate.getDate() - 13 * 7);
        let checkConsumptionExit = await this.cgConsumptionModel.aggregate([{
            $match: { date: { $lte: thirteenWeeksAgo }, productId: productId }
        },
        ]);
        if (checkConsumptionExit.length > 0) {
            let totalConsumption = await this.cgConsumptionModel.aggregate([
                {
                    $match: {
                        productId: productId,
                        date: {
                            $gte: thirteenWeeksAgo,
                            $lte: currentDate,
                        },
                    },
                },
                {
                    $group: {
                        _id: null,
                        totalQty: { $sum: "$qty" },
                    },
                },
            ]);
            if (totalConsumption.length > 0) {
                avgWeeklyConsumption = (totalConsumption[0].totalQty) / 13

            }
        } else {
            let findConsumption = await this.cgConsumptionModel.aggregate([
                {
                    $match:
                        { productId: productId}
                },
                {
                    $group: {
                        _id: null,
                        minDate: { $min: "$date" },
                        maxDate: { $max: new Date() },
                        totalQuality: { $sum: "$qty" }
                    }
                },
                {
                    $project: {
                        maxDate: new Date(),
                        minDate: "$minDate",
                        totalQuality: "$totalQuality",
                        weekDifference: {
                            $ceil: {
                                $divide: [
                                    { $subtract: ["$maxDate", "$minDate"] },
                                    1000 * 60 * 60 * 24 * 7
                                ]
                            }
                        }
                    }
                },
                {
                    $project: {
                        totalQuality: "$totalQuality",
                        weekDifference1: {
                            $cond: {
                                if: { $eq: ["$weekDifference", 0] },
                                then: 1,
                                else: "$weekDifference"
                            }
                        },
                    }
                },
                {
                    $project: {
                        avg: { $divide: ["$totalQuality", "$weekDifference1"] }
                    }
                }


            ]);
            if (findConsumption.length > 0) {
                avgWeeklyConsumption = findConsumption[0].avg;
            }
        }
        return avgWeeklyConsumption;
            
} catch (e) {
    throw new InternalServerErrorException(e)
}
    };

    public async getAvgWeeklyConsumptionByInventory(inventoryId): Promise<number> {
        try {
        const findInventory = await this.cgInventoryModel.findOne({
            _id: inventoryId
        })

        let avgWeeklyConsumption = 0;
        const currentDate = new Date();
        const thirteenWeeksAgo = new Date();
        thirteenWeeksAgo.setDate(currentDate.getDate() - 13 * 7);
        let checkConsumptionExit = await this.cgConsumptionModel.aggregate([{
            $match: { date: { $lte: thirteenWeeksAgo },productId: findInventory.productId }
        },
        ]);
        if (checkConsumptionExit.length > 0) {
            let totalConsumption = await this.cgConsumptionModel.aggregate([
                {
                    $match: {
                        productId: findInventory.productId,
                        date: {
                            $gte: thirteenWeeksAgo,
                            $lte: currentDate,
                        },
                    },
                },
                {
                    $group: {
                        _id: null,
                        totalQty: { $sum: "$qty" },
                    },
                },
            ]);
            if (totalConsumption.length > 0) {
                avgWeeklyConsumption = (totalConsumption[0].totalQty) / 13

            }
        } else {
            let findConsumption = await this.cgConsumptionModel.aggregate([
                {
                    $match:
                        { productId: findInventory.productId}
                },
                {
                    $group: {
                        _id: null,
                        minDate: { $min: "$date" },
                        maxDate: { $max: new Date() },
                        totalQuality: { $sum: "$qty" }
                    }
                },
                {
                    $project: {
                        maxDate: new Date(),
                        minDate: "$minDate",
                        totalQuality: "$totalQuality",
                        weekDifference: {
                            $ceil: {
                                $divide: [

                                    1000 * 60 * 60 * 24 * 7
                                ]
                            }
                        }
                    }
                },
                {
                    $project: {
                        totalQuality: "$totalQuality",
                        weekDifference1: {
                            $cond: {
                                if: { $eq: ["$weekDifference", 0] },
                                then: 1,
                                else: "$weekDifference"
                            }
                        },
                    }
                },
                {
                    $project: {
                        avg: { $divide: ["$totalQuality", "$weekDifference1"] }
                    }
                }


            ]);
            if (findConsumption.length > 0) {
                avgWeeklyConsumption = findConsumption[0].avg;
            }
        }
        return avgWeeklyConsumption;
                    
    } catch (e) {
        throw new InternalServerErrorException(e)
    }
    };

    public async generateUniqueNumber(): Promise<any> {
        try {
        let randomNumber = Math.floor(Math.random() * (1000 - 400)) + 400;
        return `${randomNumber}`;
                    
    } catch (e) {
        throw new InternalServerErrorException(e)
    }
    };

    async changeUniqueNumber() {
        try {
            let documentsToUpdate = await this.cgOrderModel.find({ "cg.status": true, "cg.stage": "PENDING", uniqueNumber: 1 });
            for await (const document of documentsToUpdate) {

                const highestValueUser = await this.cgOrderModel.findOne({}, { uniqueNumber: 1 }).sort('-uniqueNumber').exec();

                let uniqueNumber = highestValueUser?highestValueUser.uniqueNumber+1:1;
          
                await this.cgOrderModel.findByIdAndUpdate(document._id, { $set: { uniqueNumber: uniqueNumber } }, { new: true });
            }
        }
        catch (error) {
            console.log(error);
        }
    };

    public async cgInventoryInfo(productId): Promise<any> {
        try {
            const inventory = await this.roInventoryModel.aggregate([
                {
                    $match:{productId: ObjectId(productId)}
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
                    $lookup: {
                        from: "silverproducts",
                        localField: "productId",
                        foreignField: "_id",
                        pipeline: [
                            { $project: { _id: 1, itemCode: 1,productName: 1, } }
                        ],
                        as: "productInfo",
                    },
                },
                { $unwind: { path: "$roInfo", preserveNullAndEmptyArrays: true } },
                { $unwind: { path: "$productInfo", preserveNullAndEmptyArrays: true } },
                {
                    $project: {
                        tog: { $ifNull: ["$tog" , 0] },
                        oldTog: { $ifNull:["$oldTog" , 0] },
                        togRecommendation: { $ifNull: [ "$togRecommendation" , 0] },
                        growthFactor: { $ifNull: [ "$growthFactor" , "0"] },
                        roName: { $ifNull: [ "$roInfo.roName" , ""] },
                        productName: { $ifNull: ["$productInfo.productName" , ""] },
                        itemCode: { $ifNull: ["$productInfo.itemCode", 0] },
                        isUpdateGrowthFactor: { $ifNull: ["$isUpdateGrowthFactor", false] },
                        // orderNumber: { $ifNull: ["$orderNumber", 1] },
                    }
                },
            ]);
            if(inventory.length > 0){inventory.sort((a,b)=>b.orderNumber-a.orderNumber)}
            return inventory;
      
        } catch (error) {
            return [];
        }

    };

    public async getOpenOrder(productId): Promise<number> {
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
                                $and: [{ "cg.stage": "ACCEPT" },{ "wip.stage": "PENDING"},]
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
            return openOrder
        } catch (error) {
            return 0;
        }

    };

    public async createInventory(createInventoryDto: CreateCgInventoryDto, req: Request) {
        try {
            let date = await dateFormate(new Date());
            const findInventory = await this.cgInventoryModel.findOne({productId: ObjectId(createInventoryDto.productId)});
            if (findInventory) {
                throw new BadRequestException("Inventory already exist")
            }
      
            let avgWeeklyConsumption = 0;
            let orderRecommendation = 0;
            let onHandStatus = 0;
            let flag = "BLACK"
            let onHandStock = createInventoryDto.onHandStock
            let qualifiedDemand = createInventoryDto.qualifiedDemand
            // Check consumption exist 

            const openOrder = await this.getOpenOrder(createInventoryDto.productId);

            // For Tog
            let tog = Number(createInventoryDto.tog);

            // For netFlow 
            let netFlow = Number(createInventoryDto.onHandStock + openOrder - qualifiedDemand);
            // For Moq
            let moq = Number(createInventoryDto.moq)?Number(createInventoryDto.moq):1;
            // For net orderRecommendation
            let tog_net = await Math.abs(Number(tog - netFlow));

            if (netFlow >= tog) {
                orderRecommendation = 0;
            }
            else if (tog_net < moq) {

                orderRecommendation = Number(moq);
            }
            else if (tog_net > moq) {

                orderRecommendation = Math.abs(Math.abs(moq * Math.round(Math.abs(tog_net / moq))));
            }
            let orderRecommendationStatus = 0;

            if (isNaN(orderRecommendation)) {
                orderRecommendationStatus = 0
            } else {
                orderRecommendationStatus = Number(orderRecommendation) * 100 / tog
            }
            let onHandStatusNumber = Math.abs(Number(onHandStock) * 100 / tog);

            if (onHandStatusNumber == Infinity || isNaN(onHandStatusNumber)) {
                onHandStatus = 0
            } else {
                onHandStatus = onHandStatusNumber
            }

            // For onHandStatus
            flag = await flagFunction(tog, onHandStock)

            const authInfo = await getAuthUserInfo(req.headers)
            let inventoryObject = {
                productId: createInventoryDto.productId,
                createdBy: authInfo._id,
                avgWeeklyConsumption: avgWeeklyConsumption,
                plantLeadTime: createInventoryDto.plantLeadTime,
                growthFactor: createInventoryDto.growthFactor,
                tog: tog,
                openOrder: openOrder,
                netFlow: Math.abs(netFlow),
                moq: moq,
                orderRecommendation: orderRecommendation,
                orderRecommendationStatus: orderRecommendationStatus,
                onHandStatus: onHandStatus,
                flag: flag,
                onHandStock: onHandStock,
                qualifiedDemand: qualifiedDemand

            }

            const inventory = new this.cgInventoryModel(inventoryObject);
            if (await inventory.save()) {
                if (orderRecommendation > 0) {

                    const highestValueUser = await this.cgOrderModel.findOne({}, { uniqueNumber: 1 }).sort('-uniqueNumber').exec();
                    let uniqueNumber = highestValueUser? highestValueUser.uniqueNumber+1:1;
                    let order = new this.cgOrderModel({
                        ...createInventoryDto,
                        createdBy: authInfo._id,
                        qty: Number(orderRecommendation),
                        inventoryId: inventory.id,
                        productId: createInventoryDto.productId,
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
                return new GetCgInventoryInfoDto(inventory)
            }
        } catch (e) {
            throw new InternalServerErrorException(e)
        }
    };

    async getAllInventory(paginationDto: FilterPaginationCgInventoryDto, req: Request): Promise<any> {
        try {
            const authInfo = await getAuthUserInfo(req.headers)
            const currentPage = paginationDto.currentPage || 1;
            const recordPerPage = paginationDto.recordPerPage || 10;
            const orderByFields = paginationDto.orderBy || ["createdAt"]; 
            let sortFields= {};

            if (paginationDto.sortBy && paginationDto.sortBy.length > 0) {
                let dynamicSortFields = paginationDto.sortBy;
                dynamicSortFields.forEach(field => {
                  if (field.orderValue == 1) {
                    sortFields[field.orderKey] = 1;
        
                  } else {
                    sortFields[field.orderKey] = -1;
        
                  }
                });
              }
            

            let activeCondition = { active: true };
            if (paginationDto.active == false) {
                activeCondition = { active: false }
            };
            const status = paginationDto.status ? { flag: paginationDto.status } : {};

            const filter = await multiSelectorFunction(paginationDto)
            const inventory = await this.cgInventoryModel.aggregate([
                {
                    $match: status
                },
                {
                    $match: activeCondition
                },
                {
                    $lookup: {
                        from: "roconsumptions",
                        let: { productId: "$productId"},
                        pipeline: [
                            {
                                $match: {
                                    $expr: { $and: [{ $eq: ["$productId", "$$productId"] }] }
                                }
                            },
                            {
                                $project: {
                                    qty: 1,
                                }
                            }
                        ],
                        as: "consumptionInfo"
                    }
                },
                {
                    $lookup: {
                        from: "silverproducts",
                        localField: "productId",
                        foreignField: "_id",
                        pipeline: [
                            { $project: { _id: 1, moq: 1, unitid: 1, itemCode: 1, itemDescription: 1, productName: 1, categoryid: 1, subcategoryid: 1,finalPrice:1,groupid:1 } }
                        ],
                        as: "productInfo",
                    },
                },
                {
                    $lookup: {
                        from: "silvercategories",
                        localField: "productInfo.categoryid",
                        foreignField: "_id",
                        pipeline: [
                            { $project: { _id: 1, categoryName: 1 } }
                        ],
                        as: "categoryInfo",
                    },
                },
                {
                    $lookup: {
                        from: "silversubcategories",
                        localField: "productInfo.subcategoryid",
                        foreignField: "_id",
                        pipeline: [
                            { $project: { _id: 1, subcategoryName: 1 } }
                        ],
                        as: "subcategoryInfo",
                    },
                },
                {
                    $lookup: {
                        from: "roinventories",
                        localField: "roInventoryId",
                        foreignField: "_id",
                        pipeline: [
                            { $project: { _id: 1,productId:1, roId: 1,oldTog:1,tog:1,growthFactor:1,togRecommendation:1 } }
                        ],
                        as: "roInventoryInfo",
                    },
                },
                {
                    $lookup: {
                      from: "silvergroups",
                      localField: "productInfo.groupid",
                      foreignField: "_id",
                      pipeline: [{ $project: { _id: 1, group: 1, groupCode:1 } }],
                      as: "groupInfo",
                    },
                  },
                {
                    $project: {
                        group: { $ifNull: [{ $first: "$groupInfo.group" }, ""] },
                        itemCode: { $ifNull: [{ $first: "$productInfo.itemCode"}, 0] },
                        itemDescription: { $ifNull: [{ $first: "$productInfo.itemDescription" }, ""] },
                        productName: { $ifNull: [{ $first: "$productInfo.productName" }, ""] },
                        categoryid: { $ifNull: [{ $first: "$productInfo.categoryid" }, ""] },
                        subcategoryid: { $ifNull: [{ $first: "$productInfo.subcategoryid" }, ""] },
                        subCategoryName: { $ifNull: [{ $first: "$subcategoryInfo.subcategoryName" }, ""] },
                        productId: { $ifNull: [{ $first: "$productInfo._id" }, ""] },
                        categoryName: { $ifNull: [{ $first: "$categoryInfo.categoryName" }, ""] },
                        tog: { $ifNull: [{ $floor: "$tog" }, 0] },
                        avgWeeklyConsumption: { $ifNull: [{ $floor: "$avgWeeklyConsumption" }, 0] },
                        leadTime: { $ifNull: ["$leadTime", 0] },
                        roSigma: { $ifNull: ["$roSigma", 0] },
                        moq: { $ifNull: ["$moq", 1] },
                        plantLeadTime: { $ifNull: ["$plantLeadTime", 0] },
                        growthFactor: { $ifNull: ["$growthFactor", ""] },
                        togRecommendation: { $ifNull: ["$togRecommendation", 0] },
                        onHandStock: { $ifNull: ["$onHandStock", 0] },
                        qualifiedDemand: { $ifNull: ["$qualifiedDemand", 0] },
                        orderRecommendation: { $ifNull: ["$orderRecommendation", 0] },
                        orderRecommendationStatus: {
                            $cond: {
                              if: {$or:[{$eq: ["$orderRecommendationStatus", "NaN"]},{$eq: ["$orderRecommendationStatus", "Infinity"]}]  },
                              then: "0",
                              else: "$orderRecommendationStatus"
                            }
                          },
                        onHandStatus: { $ifNull: ["$onHandStatus", ""] },
                        flag: { $ifNull: ["$flag", ""] },
                        consumption: { $ifNull: ["$consumption", 0] },
                        netFlow: { $ifNull: ["$netFlow", 0] },
                        openOrder: { $ifNull: ["$openOrder", 0] },
                        active: { $ifNull: ["$active", true] },
                        isUpdateTog: { $ifNull: ["$isUpdateTog", false] },
                        isConvertFinalToTog: { $ifNull: ["$isConvertFinalToTog", false] },
                        isGrowthFactor: { $ifNull: ["$isGrowthFactor", false] },
                        createdAt: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                        avg: { $ifNull: [{ $floor: "$rWC" }, 0] },
                        togValue:{
                            $ifNull: [
                              {
                                $multiply: [
                                  { $ifNull: [{$toDouble:{ $floor: "$tog" }}, 1] }, 
                                  { $ifNull: [{$toDouble:{ $first: "$productInfo.finalPrice" }}, 1] }
                                ]
                              },
                              1
                            ]
                          },
                        stockValue:{
                            $ifNull: [
                              {
                                $multiply: [
                                  { $ifNull: [{ $toDouble: "$onHandStock"}, 1] }, 
                                  { $ifNull: [{$toDouble:{ $first: "$productInfo.finalPrice" }}, 1] }
                                ]
                              },
                              1
                            ]
                          },
                          prValue: {
                            $ifNull: [
                              {
                                $multiply: [
                                  { $ifNull: [{ $toDouble: "$orderRecommendation" }, 1] }, 
                                  { $ifNull: [{ $toDouble: { $first: "$productInfo.finalPrice" } }, 1] }
                                ]
                              },
                              1
                            ]
                          }
                    
                          
                    }
                },
                {
                    $match: {
                        $or: [
                            { itemCode: { $regex: paginationDto.search, '$options': 'i' } },
                            { moq: { $regex: paginationDto.search, '$options': 'i' } },
                            { contactPersonName: { $regex: paginationDto.search, '$options': 'i' } },
                            { roName: { $regex: paginationDto.search, '$options': 'i' } },
                            { productName: { $regex: paginationDto.search, '$options': 'i' } },
                            { categoryName: { $regex: paginationDto.search, '$options': 'i' } },
                            { onHandStatus: { $regex: paginationDto.search, '$options': 'i' } },
                            { flag: { $regex: paginationDto.search, '$options': 'i' } },
                            { itemDescription: { $regex: paginationDto.search, '$options': 'i' } },
                            { itemDescription: { $eq: paginationDto.search } },
                            { city: { $regex: paginationDto.search, '$options': 'i' } },
                            { orderRecommendationStatus: { $regex: paginationDto.search, '$options': 'i' } },
                            { state: { $regex: paginationDto.search, '$options': 'i' } },
                            { tog: { $eq: parseInt(paginationDto.search) } },
                            { avgWeeklyConsumption: { $eq: parseInt(paginationDto.search) } },
                            { leadTime: { $eq: parseInt(paginationDto.search) } },
                            { onHandStock: { $eq: parseInt(paginationDto.search) } },
                            { qualifiedDemand: { $eq: parseInt(paginationDto.search) } },
                            { orderRecommendation: { $eq: parseInt(paginationDto.search) } },
                            { netFlow: { $eq: parseInt(paginationDto.search) } },
                            { openOrder: { $eq: parseInt(paginationDto.search) } },
                            { consumption: { $eq: parseInt(paginationDto.search) } },
                            { avg: { $eq: parseInt(paginationDto.search) } },
                            { growthFactor: { $eq: parseInt(paginationDto.search) } },
                            { createdAt: { $regex: paginationDto.search, $options: "i" }, },
                        ]
                    }
                },
                {
                    $match: filter
                },
                // { $sort: { [orderByFields[0]]: 1 } },
                { $sort: { ["onHandStatus"]: 1 } },
                {
                    $addFields: {
                        customOrder: {
                            $switch: {
                                branches: [
                                    { case: { $eq: ["$flag", "BLACK"] }, then: 1 },
                                    { case: { $eq: ["$flag", "RED"] }, then: 2 },
                                    { case: { $eq: ["$flag", "YELLOW"] }, then: 3 },
                                    { case: { $eq: ["$flag", "GREEN"] }, then: 4 },
                                    { case: { $eq: ["$flag", "WHIGHT"] }, then: 5 },
                                ],
                            },
                        },
                    },
                },
                { $sort: { customOrder: 1 }, },
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

            if (!inventory || !inventory[0]) {
                throw new BadRequestException('Data Not Found');
            }
            for await (let data of inventory[0].docs){
                data["growthFactorInfo"] = await this.cgInventoryInfo(data.productId);
            }

            return inventory;
            
        } catch (e) {
            throw new InternalServerErrorException(e)
        }
    };

    async getInventoryInfo(id: string): Promise<any> {
        try {
            const inventory = await this.cgInventoryModel.aggregate([
                {
                    $match: { active: true, _id: ObjectId(id) }
                },
                {
                    $lookup: {
                        from: "silverproducts",
                        localField: "productId",
                        foreignField: "_id",
                        pipeline: [
                            { $project: { _id: 1, moq: 1, unitid: 1, itemCode: 1, itemDescription: 1, productName: 1, categoryid: 1, subcategoryid: 1 } }
                        ],
                        as: "productInfo",
                    },
                },
                {
                    $lookup: {
                        from: "silvercategories",
                        localField: "productInfo.categoryid",
                        foreignField: "_id",
                        pipeline: [
                            { $project: { _id: 1, categoryName: 1 } }
                        ],
                        as: "categoryInfo",
                    },
                },
                {
                    $lookup: {
                        from: "silversubcategories",
                        localField: "productInfo.subcategoryid",
                        foreignField: "_id",
                        pipeline: [
                            { $project: { _id: 1, subcategoryName: 1 } }
                        ],
                        as: "subcategoryInfo",
                    },
                },
                {
                    $project: {
                        itemCode: { $ifNull: [{ $first: "$productInfo.itemCode"}, 0] },
                        // itemCode: { $ifNull: [{$toInt:{ $first: "$productInfo.itemCode" }}, 0] },
                        itemDescription: { $ifNull: [{ $first: "$productInfo.itemDescription" }, ""] },
                        productName: { $ifNull: [{ $first: "$productInfo.productName" }, ""] },
                        categoryid: { $ifNull: [{ $first: "$productInfo.categoryid" }, ""] },
                        subcategoryid: { $ifNull: [{ $first: "$productInfo.subcategoryid" }, ""] },
                        productId: { $ifNull: [{ $first: "$productInfo._id" }, ""] },
                        categoryName: { $ifNull: [{ $first: "$categoryInfo.categoryName" }, ""] },
                        roSigma: { $ifNull: ["$roSigma", 0] },
                        plantLeadTime: { $ifNull: ["$plantLeadTime", 0] },
                        togRecommendation: { $ifNull: ["$togRecommendation", 0] },
                        tog: { $ifNull: [{ $floor: "$tog" }, 0] },
                        avgWeeklyConsumption: { $ifNull: ["$avgWeeklyConsumption", 0] },
                        onHandStock: { $ifNull: ["$onHandStock", 0] },
                        qualifiedDemand: { $ifNull: ["$qualifiedDemand", 0] },
                        orderRecommendation: { $ifNull: ["$orderRecommendation", 0] },
                        orderRecommendationStatus: { $ifNull: ["$orderRecommendationStatus", ""] },
                        onHandStatus: { $ifNull: ["$onHandStatus", ""] },
                        flag: { $ifNull: ["$flag", ""] },
                        consumption: { $ifNull: ["$consumption", 0] },
                        netFlow: { $ifNull: ["$netFlow", 0] },
                        openOrder: { $ifNull: ["$openOrder", 0] },
                        moq: { $ifNull: ["$moq", 0] },
                        active: { $ifNull: ["$active", true] },
                        isUpdateTog: { $ifNull: ["$isUpdateTog", false] },
                        growthFactor: { $ifNull: ["$growthFactor", ""] },
                    }
                },
            ]).exec();

            if (!inventory || !inventory[0]) {
                throw new BadRequestException('Data Not Found');
            }

            return inventory[0];
        } catch (e) {
            throw new InternalServerErrorException(e)
        }
    };

    async updateInventoryStatus(id: string, updateStatusInventoryDto: UpdateStatusCgInventoryDto): Promise<UpdateStatusCgInventoryDto> {
        try {
            let findInventory = await this.cgInventoryModel.findOne({
                _id: ObjectId(id)
            })
            if (!findInventory) {
                throw new BadRequestException("inventory not exit ")
            }
            if (updateStatusInventoryDto.active === false) {
                await this.cgOrderModel.updateMany({ inventoryId: ObjectId(id) }, { active: updateStatusInventoryDto.active }, { new: true, useFindAndModify: false })
                await this.cgConsumptionModel.updateMany({ _id: ObjectId(id) }, { active: updateStatusInventoryDto.active }, { new: true, useFindAndModify: false })

            } else {
                const findProduct = await this.silverProductModel.findOne({ _id: findInventory.productId, active: false });
                const findChannelPartner = await this.roMasterModel.findOne({ isActive: false });


                if (findProduct && findProduct != null) {
                    throw new BadRequestException("product is inactive");
                }
                if (findChannelPartner && findChannelPartner != null) {
                    throw new BadRequestException("channel partner is inactive");
                }



            }
            return await this.cgInventoryModel.findByIdAndUpdate(findInventory._id, { active: updateStatusInventoryDto.active }, { new: true, useFindAndModify: false })
        } catch (e) {
            throw new InternalServerErrorException(e)
        }
    };

    async UpdateInventory(id: string, updateInventoryDto: UpdateCgInventoryDto, req: Request) {
        try {
            let date = await dateFormate(new Date());
            const authInfo = await getAuthUserInfo(req.headers)

            let findInventory = await this.cgInventoryModel.findOne({
                productId: ObjectId(updateInventoryDto.productId)
            });

            if (!findInventory) {
                throw new BadRequestException("Inventory not found")
            }
            let avgWeeklyConsumption;
            let orderRecommendation = 0;
            let onHandStatus = 0;
            let flag = "BLACK"
            let onHandStock = updateInventoryDto.onHandStock;
            let qualifiedDemand = updateInventoryDto.qualifiedDemand;
            const openOrder = await this.getOpenOrder(updateInventoryDto.productId);
            // For Plant lead time
            let plantLeadTime =Number(updateInventoryDto.plantLeadTime )? Number(updateInventoryDto.plantLeadTime):Number(findInventory.plantLeadTime)

            // For Tog
            let tog = !isNaN(Number(updateInventoryDto.tog)) && updateInventoryDto.tog !== null ? Number(updateInventoryDto.tog)  : findInventory.tog;
            // Fot netFlow 
            let netFlow = Number(onHandStock + openOrder - qualifiedDemand);

            // For Moq
            let moq = Number(updateInventoryDto.moq)?Number(updateInventoryDto.moq):1;
            // For net orderRecommendation
            let tog_net = await Math.abs(Number(tog - netFlow));
            if (netFlow >= tog) {

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
                orderRecommendationStatus = 0
            } else {
                orderRecommendationStatus = Math.abs(Number(orderRecommendation) * 100 / tog);

            }
            let onHandStatusNumber = Math.abs(Number(onHandStock) * 100 / tog);

            if (onHandStatusNumber == Infinity || isNaN(onHandStatusNumber)) {
                onHandStatus = 0
            } else {
                onHandStatus = onHandStatusNumber
            }


            // For onHandStatus
            flag = await flagFunction(tog, onHandStock)
            let inventoryObject = {
                createdBy: authInfo._id,
                avgWeeklyConsumption: avgWeeklyConsumption,
                plantLeadTime: plantLeadTime,
                growthFactor:updateInventoryDto.growthFactor?updateInventoryDto.growthFactor:findInventory.growthFactor,
                tog: tog,
                openOrder: openOrder,
                netFlow: Math.abs(netFlow),
                moq: moq,
                orderRecommendation: orderRecommendation,
                orderRecommendationStatus: orderRecommendationStatus,
                onHandStatus: onHandStatus,
                onHandStock: onHandStock,
                qualifiedDemand: qualifiedDemand,
                flag: flag
            }
            await this.cgInventoryModel.findByIdAndUpdate({ _id: findInventory._id }, { ...inventoryObject }, { new: true, useFindAndModify: false })
            if (orderRecommendation >= 0) {

                await this.cgOrderModel.deleteMany({inventoryId: findInventory._id, "cg.stage": "PENDING"});

                const highestValueUser = await this.cgOrderModel.findOne({}, { uniqueNumber: 1 }).sort('-uniqueNumber').exec();
                let uniqueNumber = highestValueUser? highestValueUser.uniqueNumber+1:1;
                let order = new this.cgOrderModel({
                    ...updateInventoryDto,
                    createdBy: authInfo._id,
                    qty: Number(orderRecommendation),
                    inventoryId: findInventory._id,
                    productId: findInventory.productId,
                    status: flag,
                    createdAt: date,
                    uniqueNumber: uniqueNumber,
                    "recommendation.qty": Number(orderRecommendation),
                    "cg.qty": Number(orderRecommendation),
                    "recommendation.createdAt": date,
                    "cg.createdAt": date,
                });
                order.save();

            } else if (orderRecommendation == 0) {
                await this.cgOrderModel.updateMany({inventoryId: findInventory._id,"cg.stage": "PENDING"}, { active: false });
            }
        }
        catch (e) {
            throw new InternalServerErrorException(e)
        }
    };

    async getDashBoardInventoryInfo(GetDashBoardCgInventoryInfo: GetDashBoardCgInventoryInfo, req: Request): Promise<any> {
        try {
            const authInfo = await getAuthUserInfo(req.headers);

            let condition = {};
            let activeCondition = { active: true }

            if (GetDashBoardCgInventoryInfo.active == false) {
                activeCondition = { active: false }
            }

            const inventoyallCount = await this.cgInventoryModel.countDocuments({
                $and: [condition, activeCondition]
            });

            const inventory = await this.cgInventoryModel.aggregate([
                {
                    $match: condition
                },
                {
                    $match: activeCondition
                },
                {
                    '$group': {
                        '_id': '$flag',
                        'count': {
                            '$sum': 1
                        }
                    }
                },
                {
                    '$project': {
                        '_id': 0,
                        'flag': '$_id',
                        'count': 1
                    }
                }

            ])
            inventory.push({ "count": inventoyallCount, "flag": "all" });
            return inventory;
        } catch (e) {
            throw new InternalServerErrorException(e)
        }
    };

    async getInventoryDropDown(req: Request): Promise<any> {
        try {
            const authInfo = await getAuthUserInfo(req.headers);
   
            const inventory = await this.cgInventoryModel.aggregate([
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
                                    moq: 1,
                                    itemCode: 1,
                                    itemDescription: 1,
                                    productName: 1,
                                    categoryid: 1,
                                    subcategoryid: 1,
                                    unitid: 1,
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
                        pipeline: [
                            {
                                $project: { _id: 1, categoryName: 1 },
                            },
                        ],
                        as: "categoryInfo",
                    },
                },
                {
                    $lookup: {
                        from: "silversubcategories",
                        localField: "productInfo.subcategoryid",
                        foreignField: "_id",
                        pipeline: [
                            {
                                $project: { _id: 1, subcategoryName: 1 },
                            },
                        ],
                        as: "subcategoryInfo",
                    },
                },

                {
                    $project: {
                        itemCode: { $ifNull: [{ $first: "$productInfo.itemCode" }, ""] },
                        // itemCode: { $ifNull: [{$toInt:{ $first: "$productInfo.itemCode" }}, ""] },
                        itemDescription: { $ifNull: [{ $first: "$productInfo.itemDescription" }, ""] },
                        productName: { $ifNull: [{ $first: "$productInfo.productName" }, ""] },
                        categoryid: { $ifNull: [{ $first: "$productInfo.categoryid" }, ""] },
                        subcategoryid: { $ifNull: [{ $first: "$productInfo.subcategoryid" }, ""] },
                        subCategoryName: { $ifNull: [{ $first: "$subcategoryInfo.subcategoryName" }, ""] },
                        productId: { $ifNull: [{ $first: "$productInfo._id" }, ""] },
                        categoryName: { $ifNull: [{ $first: "$categoryInfo.categoryName" }, ""] },
                        tog: { $ifNull: [{ $floor: "$tog" }, 0] },
                        avgWeeklyConsumption: { $ifNull: [{ $floor: "$avgWeeklyConsumption" }, 0] },
                        leadTime: { $ifNull: ["$leadTime", 0] },
                        onHandStock: { $ifNull: ["$onHandStock", 0] },
                        qualifiedDemand: { $ifNull: ["$qualifiedDemand", 0] },
                        orderRecommendation: { $ifNull: ["$orderRecommendation", 0] },
                        orderRecommendationStatus: { $ifNull: ["$orderRecommendationStatus", ""] },
                        onHandStatus: { $ifNull: ["$onHandStatus", ""] },
                        flag: { $ifNull: ["$flag", ""] },
                        consumption: { $ifNull: ["$consumption", 0] },
                        netFlow: { $ifNull: ["$netFlow", 0] },
                        openOrder: { $ifNull: ["$openOrder", 0] },
                        active: { $ifNull: ["$active", true] },
                        avg: { $ifNull: [{ $floor: "$rWC" }, 0] },
                        roSigma: { $ifNull: ["$roSigma", 0] },
                        growthFactor: { $ifNull: ["$growthFactor", ""] },
                        plantLeadTime: { $ifNull: ["$plantLeadTime", 0] },
                        togRecommendation: { $ifNull: ["$togRecommendation", 0] },
                        group: { $ifNull: ["$categoryName", 0] },
                        moq: { $ifNull: ["$moq", 1] },
                    },
                },
            ]).exec();
            if (!inventory) {
                throw new BadRequestException('Data Not Found');
            }
            return inventory;
        } catch (e) {
            throw new InternalServerErrorException(e)
        }
    };

    async importInventory(createInventoryDto: ImportCgInventoryDto[], req: Request): Promise<any> {
        try {
            let date = await dateFormate(new Date());
            let errorArrray = []
            const dataArray = Array.isArray(createInventoryDto) ? createInventoryDto : Object.values(createInventoryDto);
            const mappedArray = await Promise.all(dataArray.map(async (inventory: any) => {
               
                const existProduct = await this.silverProductModel.findOne({productName: inventory.productName});

                let existInventory = null;
                if (existProduct) {
                    existInventory = await this.cgInventoryModel.findOne({ productId: existProduct._id});
                } else {
                    existInventory = null
                }

                let errString = "";

                // const checkBlank = (property, errorMessage) => {
                //     if (property === "" || property === null || property === "null") {
                //         errString += `${errorMessage} ,`;
                //     }
                // };
                const checkInMto = (property, errorMessage) => {
                    if (property === null) {
                        errString += `${errorMessage} ,`;
                    }
                };

                const checkExist = (property, errorMessage) => {
                    if (!property) {
                        errString += `${errorMessage} ,`;
                    }
                };

                const checkNumber = (property, errorMessage) => {
                    if (typeof property !== 'number') {
                        errString += `${errorMessage} ,`;
                    }
                };
                
                if (!errString) {

                    if (existProduct  && !existInventory) {
                        let avgWeeklyConsumption = 0;
                        let orderRecommendation = 0;
                        let onHandStatus = 0;
                        let flag = "BLACK"
                        let onHandStock = inventory.onHandStock ? inventory.onHandStock:0;
                        let qualifiedDemand = inventory.qualifiedDemand ? inventory.qualifiedDemand:0;

                        // Check consumption exist 
                        const findConsumption = await this.cgConsumptionModel.findOne({
                            productId: ObjectId(existProduct._id)
                        });
                        if (findConsumption) {
                            onHandStock = Math.abs(findConsumption.qty - Number(onHandStock))
                            qualifiedDemand = Math.abs(findConsumption.qty - Number(qualifiedDemand))
                        }

                        const openOrder = await this.getOpenOrder(existProduct._id);
                        avgWeeklyConsumption = await this.getAvgWeeklyConsumption(existProduct._id);

                        // For lead time

                        let findLeadTime = 0;

                        let leadTime = inventory.leadTime ? Number(inventory.leadTime):Number(findLeadTime);

                        // For factor of safety and moq    
                        let product = await this.silverProductModel.findOne({ _id: existProduct._id })

                        // For Tog
                        let tog = Number(inventory.tog) ? Number(inventory.tog) : await Number(avgWeeklyConsumption * leadTime);

                        // For netFlow 
                        let netFlow = Number(onHandStock + openOrder - qualifiedDemand);
                        // For Moq
                        let moq = Number(inventory.moq)?Number(inventory.moq):1;
                        // For net orderRecommendation
                        let tog_net = await Math.abs(Number(tog - netFlow));
                        if (netFlow >= tog) {
                            // orderRecommendation = netFlow;
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
                            orderRecommendationStatus = 0
                        } else {
                            orderRecommendationStatus = Math.abs(Number(orderRecommendation) * 100 / tog)

                        }
                        let onHandStatusNumber = Math.abs(Number(onHandStock) * 100 / tog);

                        if (onHandStatusNumber == Infinity || isNaN(onHandStatusNumber)) {
                            onHandStatus = 0
                        } else {
                            onHandStatus = onHandStatusNumber
                        }


                        // For onHandStatus
                        flag = await flagFunction(tog, onHandStock)

                        const authInfo = await getAuthUserInfo(req.headers)
                        let inventoryObject = {
                            productId: existProduct._id,
                            createdBy: authInfo._id,
                            avgWeeklyConsumption: avgWeeklyConsumption,
                            leadTime: leadTime,
                            growthFactor: inventory.growthFactor,
                            tog: tog,
                            openOrder: openOrder,
                            netFlow: Math.abs(netFlow),
                            moq: moq,
                            orderRecommendation: orderRecommendation,
                            orderRecommendationStatus: orderRecommendationStatus,
                            onHandStatus: onHandStatus,
                            flag: flag,
                            onHandStock: onHandStock,
                            qualifiedDemand: qualifiedDemand

                        }


                        let inventorys = new this.cgInventoryModel(inventoryObject);
                        if (await inventorys.save()) {
                            if (orderRecommendation > 0) {
                                let order = new this.cgOrderModel({
                                    ...createInventoryDto,
                                    createdBy: authInfo._id,
                                    productId: existProduct._id,
                                    qty: Number(orderRecommendation),
                                    inventoryId: inventorys._id,
                                    status: flag,
                                    createdAt: date,
                                    // uniqueNumber:await this.generateUniqueNumber(),
                                    "recommendation.qty": Number(orderRecommendation),
                                    "cg.qty": Number(orderRecommendation),
                                    "recommendation.createdAt": date,
                                    "cg.createdAt": date,
                                });
                                order.save();
                            }
                            return new GetCgInventoryInfoDto(inventorys)
                        }
                    } else if (existProduct && existInventory !== null) {
                        let avgWeeklyConsumption = 0;
                        let orderRecommendation = 0;
                        let onHandStatus = 0;
                        let flag = "BLACK"
                        let onHandStock = inventory.onHandStock ? Number(inventory.onHandStock) : Number(existInventory.onHandStock);
                        let qualifiedDemand = inventory.qualifiedDemand ? Number(inventory.qualifiedDemand) : Number(existInventory.qualifiedDemand);
                        let leadTime = inventory.leadTime ? Number(inventory.leadTime):Number(existInventory.plantLeadTime);

                        // Check consumption exist 
                        const findConsumption = await this.cgConsumptionModel.findOne({
                            productId: ObjectId(existProduct._id)
                        });

                  
                        const openOrder = await this.getOpenOrder(existProduct._id);
                        avgWeeklyConsumption = await this.getAvgWeeklyConsumption(existProduct._id);


                        // For factor of safety and moq    
                        let product = await this.silverProductModel.findOne({ _id: existProduct._id })

                        // For Tog

                        let tog = Number(inventory.tog) ? Number(inventory.tog) : existInventory.tog;

                        // For netFlow 
                        let netFlow = Number(onHandStock + openOrder - qualifiedDemand);
                        // For Moq
                        let moq = Number(inventory.moq)? Number(inventory.moq):1;
                        // For net orderRecommendation
                        let tog_net = await Math.abs(Number(tog - netFlow));
                        if (netFlow >= tog) {
                            // orderRecommendation = netFlow;
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
                            orderRecommendationStatus = 0
                        } else {
                            orderRecommendationStatus = Math.abs(Number(orderRecommendation) * 100 / tog);

                        }
                        let onHandStatusNumber = Math.abs(Number(onHandStock) * 100 / tog);

                        if (onHandStatusNumber == Infinity || isNaN(onHandStatusNumber)) {
                            onHandStatus = 0
                        } else {
                            onHandStatus = onHandStatusNumber
                        }


                        // For onHandStatus
                        flag = await flagFunction(tog, onHandStock)

                        const authInfo = await getAuthUserInfo(req.headers)
                        let inventoryObject = {
                            productId: existProduct._id,
                            createdBy: authInfo._id,
                            avgWeeklyConsumption: avgWeeklyConsumption,
                            plantLeadTime: leadTime,
                            growthFactor:existInventory.growthFactor?existInventory.growthFactor:"1",
                            tog: tog,
                            openOrder: openOrder,
                            netFlow: Math.abs(netFlow),
                            moq: moq,
                            orderRecommendation: orderRecommendation,
                            orderRecommendationStatus: orderRecommendationStatus,
                            onHandStatus: onHandStatus,
                            flag: flag,
                            onHandStock: onHandStock,
                            qualifiedDemand: qualifiedDemand

                        }

                        await this.cgInventoryModel.findByIdAndUpdate(
                            { _id: existInventory._id },
                            {
                                ...inventoryObject
                            },
                            { new: true, setDefaultsOnInsert: false }
                        ).lean();

                        if (orderRecommendation > 0) {

                            await this.cgOrderModel.deleteMany({inventoryId: existInventory._id, "cg.stage": "PENDING"});
                            let order = new this.cgOrderModel({
                                ...createInventoryDto,
                                createdBy: authInfo._id,
                                qty: Number(orderRecommendation),
                                inventoryId: existInventory._id,
                                productId: existProduct._id,
                                status: flag,
                                createdAt: date,
                                "recommendation.qty": Number(orderRecommendation),
                                "cg.qty": Number(orderRecommendation),
                                "recommendation.createdAt": date,
                                "cg.createdAt": date,
                            });
                            order.save();
                        }

                    } else {
                        await checkNumber(inventory.tog, "tog should be number");
                        await checkNumber(inventory.onHandStock, "onHandStock should be number");
                        await checkNumber(inventory.qualifiedDemand, "qualifiedDemand should be number");
                        await checkExist(existProduct, "product does not exist");
                    }
                }

                if (errString !== "") {
                    inventory["error"] = errString;
                    errorArrray.push(inventory);
                }
            })
            );

              await this.changeUniqueNumber();
              setTimeout(async function() {
                await this.changeUniqueNumber();
                console.log("Inside setTimeout function");
              }.bind(this), 10000);
              
            return new GetCgInventoryInfoDto({ mappedArray: mappedArray, errorArrray: errorArrray });
        }
        catch (e) {
            throw new InternalServerErrorException(e)
        }
    };

    async getInventoryMoreInfo(viewOtherInventoryDto: ViewOtherCgInventoryDto): Promise<any> {
        try {
            const inventory = await this.cgInventoryModel.aggregate([
                {
                    $match: {
                        active: true,
                    }
                },

                {
                    $project: {

                        qualifiedDemand: { $ifNull: ["$qualifiedDemand", 0] },
                        onHandStock: { $ifNull: ["$onHandStock", 0] },
                        tog: { $ifNull: [{ $floor: "$tog" }, 0] },
                    }
                },
            ]).exec();

            if (!inventory || !inventory[0]) {
                throw new BadRequestException('Data Not Found');
            }

            return inventory[0];
        } catch (e) {
            throw new InternalServerErrorException(e)
        }
    };

    async getProductDropDown(searchDto: SearchDto,req: Request): Promise<any> {
        try {
          const authInfo = await getAuthUserInfo(req.headers);
       
          const data = await this.silverProductModel.aggregate([
            { $match: { active: true } },
            {
              $lookup: {
                from: "silvercategories",
                localField: "categoryid",
                foreignField: "_id",
                pipeline: [
                  { $project: { _id: 1, categoryName: 1 } }
                ],
                as: "categoryInfo",
              },
            },
            {
              $lookup: {
                from: "silversubcategories",
                localField: "subcategoryid",
                foreignField: "_id",
                pipeline: [
                  { $project: { _id: 1, subcategoryName: 1 } }
                ],
                as: "subcategoryInfo",
              },
            },
            { $unwind: { path: "$categoryInfo", preserveNullAndEmptyArrays: true } },
            { $unwind: { path: "$subcategoryInfo", preserveNullAndEmptyArrays: true } },
            {
              $project: {
                _id: 1,
                itemCode: { $ifNull: ["$itemCode",0] },
                // itemCode: { $ifNull: [{$toInt:"$itemCode"},0] },
                itemDescription: { $ifNull: ["$itemDescription", ""] },
                productName: { $ifNull: ["$productName", ""] },
                categoryid: { $ifNull: ["$categoryid", ""] },
                categoryName: { $ifNull: ["$categoryInfo.categoryName", ""] },
                subcategoryid: { $ifNull: ["$subcategoryid", ""] },
                subcategoryName: { $ifNull: ["$subcategoryInfo.subcategoryName", ""] },
                active: { $ifNull: ["$active", false] },
                moq: { $ifNull: ["$moq", ""] },
                roSigma: { $ifNull: ["$roSigma", 0] },
                plantLeadTime: { $ifNull: ["$plantLeadTime", 0] },
                togRecommendation: { $ifNull: ["$togRecommendation", 0] },
                createdAt: { $dateToString: { format: "%Y-%m-%d %H:%M", date: "$createdAt" } },
              },
            },
          ]).exec()
          if (!data) {
            throw new BadRequestException('Data Not Found');
          }
          return data;
        } catch (e) {
            throw new InternalServerErrorException(e)
        }
    };

    async UpdateTogToggle(id: string, updateTogToggleDto: UpdateTogToggleDto, req: Request) {
        try {
            let date = await dateFormate(new Date());
            const authInfo = await getAuthUserInfo(req.headers)

            let findInventory = await this.cgInventoryModel.findOne({_id: ObjectId(id)});

            if (!findInventory) {
                throw new BadRequestException("Inventory not found")
            }

            await this.cgInventoryModel.findByIdAndUpdate({ _id: findInventory._id }, {isUpdateTog:updateTogToggleDto.isUpdateTog }, { new: true, useFindAndModify: false })
        
        }
        catch (e) {
            throw new InternalServerErrorException(e)
        }
    };

    async changeTog(id: string, changeTogDto: ChangeTogDto){
        try {
            let findInventory = await this.cgInventoryModel.findOne({ _id: ObjectId(id)});
            if (!findInventory) {
                throw new BadRequestException("inventory not exit ");
            }
            let tog ;
            
            if(changeTogDto.isConvertFinalToTog == true){
            await this.UpdateCgInventory(findInventory.togRecommendation,findInventory.productId);
            await this.cgGrowthModel.updateMany({ cgInventoryId: ObjectId(id)},{isUpdateGrowthFactor:false});

            return await this.cgInventoryModel.findByIdAndUpdate(findInventory._id, { oldTogRecommendation:tog, tog:tog,growthFactor:1,isConvertFinalToTog: false }, { new: true, useFindAndModify: false });
          
            }else if(changeTogDto.isUpdateTog){
                await this.UpdateCgInventory(changeTogDto.tog,findInventory.productId);
      
                tog = changeTogDto.tog
            
            }else if(changeTogDto.isNoTogChange){

                   tog = findInventory.tog
                   
                }
            return await this.cgInventoryModel.findByIdAndUpdate(findInventory._id, { tog:tog,isConvertFinalToTog: false}, { new: true, useFindAndModify: false });
        } catch (e) {
            throw new InternalServerErrorException(e);
        }
    };
};