import { Request } from 'express';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
const ObjectId = require('mongoose').Types.ObjectId;
import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';

import { User, UserDocument } from '../../entities/users.entity';
import { CgOrder, CgOrderDocument } from '../../entities/Silver/cgOrder';
import { RoOrder, RoOrderDocument } from '../../entities/Silver/roOrder';
import { CgInventory, CgInventoryDocument } from '../../entities/Silver/cgInventory';
import { RoInventory, RoInventoryDocument } from '../../entities/Silver/roInventory';
import { SilverProduct, SilverProductDocument } from '../../entities/Silver/silverProductMaster';
import { SilverCategory, SilverCategoryDocument } from '../../entities/Silver/silverCategory.entity';
import { SilverSubcategory, SilverSubcategoryDocument } from '../../entities/Silver/silverSubCategory';
import { CgConsumption, CgConsumptionDocument } from '../../entities/Silver/cgConsumption';
import { RoConsumption, RoConsumptionDocument } from '../../entities/Silver/roConsumption';
import { SilverBrand, SilverBrandDocument } from '../../entities/Silver/silverBrand.entity';
import { SilverGroup, SilverGroupDocument } from '../../entities/Silver/silverGroup.entity';
import { SilverUnit, SilverUnitDocument } from '../../entities/Silver/silverUnit.entity';
import { getAuthUserInfo ,multiSelectorFunction} from 'src/common/utils/jwt.helper';
import { SearchDto } from 'src/dto/pagination-dto';
import { FilterPaginationProductDto} from 'src/dto/product-dto';
import { GetProductInfoDto } from '../../Silver/silver-product/dto/response-product.dto';
import { CreateProductDto, ImportProductDto, StatusProductDto, UpdateProductDto } from '../../Silver/silver-product/dto/request-product.dto'
@Injectable()
export class SilverProductsService {
  constructor(
    @InjectModel(SilverProduct.name) private productModel: Model<SilverProductDocument>,
    @InjectModel(SilverCategory.name) private categoryModel: Model<SilverCategoryDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(CgInventory.name) private cgInventoryModel: Model<CgInventoryDocument>,
    @InjectModel(RoInventory.name) private roInventoryModel: Model<RoInventoryDocument>,
    @InjectModel(CgOrder.name) private cgOrderModel: Model<CgOrderDocument>,
    @InjectModel(RoOrder.name) private roOrderModel: Model<RoOrderDocument>,
    @InjectModel(CgConsumption.name) private cgConsumptionModel: Model<CgConsumptionDocument>,
    @InjectModel(RoConsumption.name) private roConsumptionModel: Model<RoConsumptionDocument>,
    @InjectModel(SilverSubcategory.name) private subcategoryModel: Model<SilverSubcategoryDocument>,
    @InjectModel(SilverBrand.name) private brandModel: Model<SilverBrandDocument>,
    @InjectModel(SilverGroup.name) private groupModel: Model<SilverGroupDocument>,
    @InjectModel(SilverUnit.name) private unitModel: Model<SilverUnitDocument>,
  ) {};
  
  async createProduct(createProductDto: CreateProductDto, req: Request) {
    try {
    const authInfo = await getAuthUserInfo(req.headers)
    const findItemCode = await this.productModel.find({ itemCode: createProductDto.itemCode })
    if (findItemCode.length > 0) {throw new BadRequestException("item code already exist")}

    const findProductName = await this.productModel.find({ productName: createProductDto.productName })
    if (findProductName.length > 0) {throw new BadRequestException("productName already exist")}

    const product = new this.productModel({ ...createProductDto, createdBy: authInfo._id });
    if (product.save()) {return new GetProductInfoDto(product)}
    throw new BadRequestException('Error in Create SilverProduct');
          
  } catch (e) {
    throw new InternalServerErrorException(e)
  }

  };

  async getAllProduct(paginationDto: FilterPaginationProductDto,req: Request): Promise<any> {
    try {
      const currentPage = paginationDto.currentPage || 1
      const recordPerPage = paginationDto.recordPerPage || 100
      const sortFields = {};
      let dynamicSortFields = ["id"]
      if (paginationDto.sortBy && paginationDto.sortBy.length > 0) {
        let dynamicSortFields = paginationDto.sortBy;
        dynamicSortFields.forEach(field => {
          if (field.orderValue == 1) {
            sortFields[field.orderKey] = 1;

          } else {
            sortFields[field.orderKey] = -1;

          }
        });
      } else {
        sortFields["createdAt"] = -1;

      }
      let activeCondition = { active: true }
      if (paginationDto.active == false) {
        activeCondition = { active: false }
      }
      const filter = await multiSelectorFunction(paginationDto)
      const data = await this.productModel.aggregate([
        {$match: activeCondition},
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
        {
          $lookup: {
            from: "silverunits",
            localField: "unitid",
            foreignField: "_id",
            pipeline: [
              { $project: { _id: 1,unitCode:1 ,unit: 1 } }
            ],
            as: "unitInfo",
          },
        },
        {
          $lookup: {
            from: "silvergroups",
            localField: "groupid",
            foreignField: "_id",
            pipeline: [
              { $project: { _id: 1,groupCode:1 ,group: 1 } }
            ],
            as: "groupInfo",
          },
        },
        {
          $lookup: {
            from: "silverbrands",
            localField: "brandid",
            foreignField: "_id",
            pipeline: [
              { $project: { _id: 1,brandCode:1 ,brand: 1 } }
            ],
            as: "brandInfo",
          },
        },
        { $unwind: { path: "$brandInfo", preserveNullAndEmptyArrays: true } },
        { $unwind: { path: "$groupInfo", preserveNullAndEmptyArrays: true } },
        { $unwind: { path: "$unitInfo", preserveNullAndEmptyArrays: true } },
        { $unwind: { path: "$categoryInfo", preserveNullAndEmptyArrays: true } },
        { $unwind: { path: "$subcategoryInfo", preserveNullAndEmptyArrays: true } },
        {
          $project: {
            _id: 1,
            unitid:1,
            brandid:1,
            groupid:1,
            itemCode: { $ifNull: ["$itemCode", ""] },
            // itemCode: { $ifNull: [{$toInt:"$itemCode"}, 0] },
            itemDescription: { $ifNull: ["$itemDescription", ""] },
            productName: { $ifNull: ["$productName", ""] },
            categoryid: { $ifNull: ["$categoryid", ""] },
            categoryName: { $ifNull: ["$categoryInfo.categoryName", ""] },
            subcategoryid: { $ifNull: ["$subcategoryid", ""] },
            subcategoryName: { $ifNull: ["$subcategoryInfo.subcategoryName", ""] },
            unit: { $ifNull: ["$unitInfo.unit", ""] },
            unitCode: { $ifNull: ["$unitInfo.unitCode", ""] },
            group: { $ifNull: ["$groupInfo.group", ""] },
            groupCode: { $ifNull: ["$groupInfo.groupCode", ""] },
            brandCode: { $ifNull: ["$brandInfo.brandCode", ""] },
            brand: { $ifNull: ["$brandInfo.brand", ""] },
            moq: { $ifNull: ["$moq", ""] },
            LP: { $ifNull: ["$LP", 0] },
            HP: { $ifNull: ["$HP", ""] },
            KW: { $ifNull: ["$KW", ""] },
            productStage: { $ifNull: ["$productStage", ""] },
            modelNo: { $ifNull: ["$modelNo", ""] },
            suc_del: { $ifNull: ["$suc_del", ""] },
            discount: { $ifNull: ["$discount", ""] },
            finalPrice: { $ifNull: ["$finalPrice", ""] },
            active: { $ifNull: ["$active", false] },
            productPrice: { $ifNull: ["$productPrice", 0] },
            manufactureLeadTime: { $ifNull: ["$manufactureLeadTime", 0] },
            weight: { $ifNull: ["$weight", 0] },
            createdAt: { $dateToString: { format: "%Y-%m-%d %H:%M", date: "$createdAt" } },
            // createdAt: { $dateToString: { format: "%Y-%m-%d %H:%M", date: "$createdAt" } },
          },
        },
        {
          $match: filter
        },
        {
          $match: {
            $or: [
              { discount: { $regex: paginationDto.search, '$options': 'i' } },
              { finalPrice: { $regex: paginationDto.search, '$options': 'i' } },
              { itemCode: { $regex: paginationDto.search, '$options': 'i' } },
              { productName: { $regex: paginationDto.search, '$options': 'i' } },
              { subcategoryName: { $regex: paginationDto.search, '$options': 'i' } },
              { categoryName: { $regex: paginationDto.search, '$options': 'i' } },
              { itemDescription: {$eq: paginationDto.search}},
              { itemDescription: { $regex: paginationDto.search, '$options': 'i' } },
              { KW: { $regex: paginationDto.search, '$options': 'i' } },
              { LP: { $regex: paginationDto.search, '$options': 'i' } },
              { HP: { $regex: paginationDto.search, '$options': 'i' } },
              { productStage: { $regex: paginationDto.search, '$options': 'i' } },
              { modelNo: { $regex: paginationDto.search, '$options': 'i' } },
              { suc_del: { $regex: paginationDto.search, '$options': 'i' } },
              { unit: { $regex: paginationDto.search, '$options': 'i' } },
              { group: { $regex: paginationDto.search, '$options': 'i' } },
              { brand: { $regex: paginationDto.search, '$options': 'i' } },
            ],
          },
        },
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
      ]).exec()
      if (!data) {throw new BadRequestException('Data Not Found')}
      return data[0];
    } catch (e) {
      throw new InternalServerErrorException(e)
    }
  };

  async getProductInfo(id: string): Promise<GetProductInfoDto> {
    try {
      const data = await this.productModel.aggregate([
        { $match: { "_id": ObjectId(id) } },
        {
          $lookup: {
            from: "silvercategories",
            localField: "categoryid",
            foreignField: "_id",
            as: "categoryInfo",
          },
        },
        {
          $lookup: {
            from: "silversubcategories",
            localField: "subcategoryid",
            foreignField: "_id",
            as: "subcategoryInfo",
          },
        },
        {
          $lookup: {
            from: "silverunits",
            localField: "unitid",
            foreignField: "_id",
            pipeline: [
              { $project: { _id: 1,unitCode:1 ,unit: 1 } }
            ],
            as: "unitInfo",
          },
        },
        {
          $lookup: {
            from: "silvergroups",
            localField: "groupid",
            foreignField: "_id",
            pipeline: [
              { $project: { _id: 1,groupCode:1 ,group: 1 } }
            ],
            as: "groupInfo",
          },
        },
        {
          $lookup: {
            from: "silverbrands",
            localField: "brandid",
            foreignField: "_id",
            pipeline: [
              { $project: { _id: 1,brandCode:1 ,brand: 1 } }
            ],
            as: "brandInfo",
          },
        },
        { $unwind: { path: "$brandInfo", preserveNullAndEmptyArrays: true } },
        { $unwind: { path: "$groupInfo", preserveNullAndEmptyArrays: true } },
        { $unwind: { path: "$unitInfo", preserveNullAndEmptyArrays: true } },
        { $unwind: "$categoryInfo" },
        { $unwind: "$subcategoryInfo" },

        {
          $project: {
            _id: 1,
            unitid:1,
            groupid:1,
            brandid:1,
            moq: { $ifNull: ["$moq", ""] },
            active: { $ifNull: ["$active", false] },
            itemCode: { $ifNull: ["$itemCode", 0] },
            itemDescription: { $ifNull: ["$itemDescription", ""] },
            productName: { $ifNull: ["$productName", ""] },
            categoryid: { $ifNull: ["$categoryid", ""] },
            categoryName: { $ifNull: ["$categoryInfo.categoryName", ""] },
            subcategoryid: { $ifNull: ["$subcategoryid", ""] },
            subcategoryName: { $ifNull: ["$subcategoryInfo.subcategoryName", ""] },
            createdAt: { $dateToString: { format: "%Y-%m-%d %H:%M", date: "$createdAt" } },
            productPrice: { $ifNull: ["$productPrice", 0] },
            weight: { $ifNull: ["$weight", 0] },
            manufactureLeadTime: { $ifNull: ["$manufactureLeadTime", 0] },
            unit: { $ifNull: ["$unitInfo.unit", ""] },
            unitCode: { $ifNull: ["$unitInfo.unitCode", ""] },
            group: { $ifNull: ["$groupInfo.group", ""] },
            groupCode: { $ifNull: ["$groupInfo.groupCode", ""] },
            brand: { $ifNull: ["$brandInfo.brand", ""] },
            brandCode: { $ifNull: ["$brandInfo.brandCode", ""] },
            LP: { $ifNull: ["$LP", 0] },
            HP: { $ifNull: ["$HP", ""] },
            KW: { $ifNull: ["$KW", ""] },
            discount: { $ifNull: ["$discount", ""] },
            finalPrice: { $ifNull: ["$finalPrice", ""] },
            productStage: { $ifNull: ["$productStage", ""] },
            modelNo: { $ifNull: ["$modelNo", ""] },
            suc_del: { $ifNull: ["$suc_del", ""] },
          },
        },
        { $limit: 1 },
      ]).exec()
      if (!data) {throw new BadRequestException('Data Not Found')}
      return new GetProductInfoDto(data[0]);
    } catch (e) { throw new InternalServerErrorException(e)
    }
  };

  async UpdateProducts(id: string, updateProductDto: UpdateProductDto): Promise<SilverProduct> {
    try {
      const findItemCode = await this.productModel.find({ itemCode: updateProductDto.itemCode, _id: { $ne: id } });
      if (findItemCode.length > 0) {
        throw new BadRequestException("item code already exist")
      }
      return await this.productModel.findByIdAndUpdate(id, {...updateProductDto}, { new: true, useFindAndModify: false })
    }
    catch (e) {
      throw new InternalServerErrorException(e)
    }
  };

  async deleteProduct(id: string): Promise<SilverProduct> {
    try {
      return await this.productModel.findByIdAndDelete(id)
    }
    catch (e) {
      throw new InternalServerErrorException(e)
    }
  };

  async updateStatus(id: string, statusProductDto: StatusProductDto): Promise<SilverProduct> {
    try {
      const findProduct = await this.productModel.findOne({ _id: ObjectId(statusProductDto.productid) });
     
      if(statusProductDto.active == false){

        await this.cgInventoryModel.updateMany({ productId: ObjectId(statusProductDto.productid) }, { active: statusProductDto.active }, { new: true, useFindAndModify: false })
        await this.cgOrderModel.updateMany({ productId: ObjectId(statusProductDto.productid) }, { active: statusProductDto.active }, { new: true, useFindAndModify: false })
        await this.cgConsumptionModel.updateMany({ productId: ObjectId(statusProductDto.productid) }, { active: statusProductDto.active }, { new: true, useFindAndModify: false })
        await this.roInventoryModel.updateMany({ productId: ObjectId(statusProductDto.productid) }, { active: statusProductDto.active }, { new: true, useFindAndModify: false })
        await this.roOrderModel.updateMany({ productId: ObjectId(statusProductDto.productid) }, { active: statusProductDto.active }, { new: true, useFindAndModify: false })
        await this.roConsumptionModel.updateMany({ productId: ObjectId(statusProductDto.productid) }, { active: statusProductDto.active }, { new: true, useFindAndModify: false })
     
    }else if(statusProductDto.active == true){

        const findCategory = await this.categoryModel.findOne({ categoryid: findProduct.categoryid, active: false });
        const findSubcategory = await this.subcategoryModel.findOne({ subcategoryid: findProduct.subcategoryid, active: false });

        
        if (findCategory) {
          throw new BadRequestException("category is inactive");
        }
        if (findSubcategory) {
          throw new BadRequestException("sub category is inactive");
        }

        
      }

      return await this.productModel.findByIdAndUpdate(
        { _id: ObjectId(statusProductDto.productid) },
        { active: statusProductDto.active },
        { new: true, useFindAndModify: false }
      );
    }
    catch (e) {
      throw new InternalServerErrorException(e)
    }
  };

  async importProducts(createProductDto: ImportProductDto[]): Promise<any> {
    try {
      let errorArrray = [];
      const dataArray = Array.isArray(createProductDto) ? createProductDto : Object.values(createProductDto);
      const mappedArray = await Promise.all(dataArray.map(async (product: any) => {

        const existProduct = await this.productModel.findOne({productName: product.productName });
        const existItem = await this.productModel.findOne({itemCode: product.itemCode });
        const existSubCategory = await this.subcategoryModel.findOne({ subcategoryName: product.subcategoryName })

        let errString = "";

        const checkBlank = (property, errorMessage) => {
          if (property === "" || property === null || property === "null") {
            errString += `${errorMessage} ,`;
          }
        };

        const checkExist = (property, errorMessage) => {
          if (!property) {
            errString += `${errorMessage} ,`;
          }
        };
        
        checkBlank(product.productName, "productName is blank");
        // checkBlank(product.modelNo, "modelNo is blank");
        checkBlank(product.subcategoryName, "subcategoryName is blank");

        if (!errString) {
          let existGroup = null;
          let existBrand = null;
          let existUnit = null;
          if(product.brand != ""){
           let brand = await this.brandModel.findOne({brand: product.brand});
           if(brand){
             existBrand = brand._id

           }
          }

          if(product.group != ""){
           let group = await this.groupModel.findOne({group: product.group});
           if(group){
           existGroup = group._id
           }
          }


          if(product.unit != ""){
            let unit = await this.unitModel.findOne({unit: product.unit});
             if(unit){
              existUnit = unit._id

             }
           }
          if (existSubCategory && !existProduct) {
             let finalPrice = product.LP

             if(product.discount){
                finalPrice =Number(product.LP)-Number((Number(product.discount)*Number(product.LP))/100)
              }else{
                product.discount = 0;
              }
         
            await this.productModel.create({
              ...product,
              finalPrice:finalPrice,
              discount:product.discount,
              brandid:existBrand,
              groupid:existGroup,
              unitid:existUnit,
              categoryid:existSubCategory.categoryid,
              subcategoryid: existSubCategory._id,
            });
          } else if (existSubCategory && existProduct !== null && existItem !== null) {
            if (
              existProduct.productName === product.productName &&
              existProduct.itemCode === product.itemCode
            ) {
               let LP = product.LP ? product.LP : existProduct.LP
               let finalPrice = LP ;
               let discount = product.discount ? product.discount :(existProduct.discount ? existProduct.discount:0) ;
              if(discount){
                finalPrice = Number(product.LP)-Number((Number(existProduct.discount)*Number(existProduct.LP))/100)
              }
              await this.productModel.findOneAndUpdate(
                { itemCode: product.itemCode },
                {
                  $set: {...product,
                    finalPrice:finalPrice,
                    discount:discount,
                    brandid:existBrand,
                    groupid:existGroup,
                    unitid:existUnit,},
                },
                { new: true, setDefaultsOnInsert: false }
              ).lean();
            }
          } else {
            if (existProduct !== null) {

              if (existProduct.productName === product.productName) {

                errString += " duplicate productName ,";
              }
            
            }

            if (existItem !== null) {

              if (existItem.itemCode === product.itemCode) {

                errString += " duplicate itemCode ,";
              }
            
            }
            checkExist(existSubCategory, "subCategory does not exist");
          }
        }

        if (errString !== "") {
          product["error"] = errString;
          errorArrray.push(product);
        }

      })
      );
      return new GetProductInfoDto({ mappedArray: mappedArray, errorArrray: errorArrray });
    }
    catch (e) {
      throw new InternalServerErrorException(e)
    }
  };

  async getProductDropDown(searchDto: SearchDto,req: Request): Promise<any> {
    try {
      const authInfo = await getAuthUserInfo(req.headers);
      const data = await this.productModel.aggregate([
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
        {
          $lookup: {
            from: "silverunits",
            localField: "unitid",
            foreignField: "_id",
            pipeline: [
              { $project: { _id: 1,unitCode:1 ,unit: 1 } }
            ],
            as: "unitInfo",
          },
        },
        {
          $lookup: {
            from: "silvergroups",
            localField: "groupid",
            foreignField: "_id",
            pipeline: [
              { $project: { _id: 1,groupCode:1 ,group: 1 } }
            ],
            as: "groupInfo",
          },
        },
        {
          $lookup: {
            from: "silverbrands",
            localField: "brandid",
            foreignField: "_id",
            pipeline: [
              { $project: { _id: 1,brandCode:1 ,brand: 1 } }
            ],
            as: "brandInfo",
          },
        },
        { $unwind: { path: "$brandInfo", preserveNullAndEmptyArrays: true } },
        { $unwind: { path: "$groupInfo", preserveNullAndEmptyArrays: true } },
        { $unwind: { path: "$unitInfo", preserveNullAndEmptyArrays: true } },
        { $unwind: { path: "$categoryInfo", preserveNullAndEmptyArrays: true } },
        { $unwind: { path: "$subcategoryInfo", preserveNullAndEmptyArrays: true } },
        {
          $project: {
            _id: 1,
            itemCode: { $ifNull: ["$itemCode", 0] },
            // itemCode: { $ifNull: [{$toInt:"$itemCode"}, 0] },
            itemDescription: { $ifNull: ["$itemDescription", ""] },
            productName: { $ifNull: ["$productName", ""] },
            categoryid: { $ifNull: ["$categoryid", ""] },
            categoryName: { $ifNull: ["$categoryInfo.categoryName", ""] },
            subcategoryid: { $ifNull: ["$subcategoryid", ""] },
            subcategoryName: { $ifNull: ["$subcategoryInfo.subcategoryName", ""] },
            active: { $ifNull: ["$active", false] },
            moq: { $ifNull: ["$moq", ""] },
            productPrice: { $ifNull: ["$productPrice", 0] },
            weight: { $ifNull: ["$weight", 0] },
            createdAt: { $dateToString: { format: "%Y-%m-%d %H:%M", date: "$createdAt" } },
            manufactureLeadTime: { $ifNull: ["$manufactureLeadTime", 0] },
            unit: { $ifNull: ["$unitInfo.unit", ""] },
            unitid: { $ifNull: ["$unitInfo._id", ""] },
            unitCode: { $ifNull: ["$unitInfo.unitCode", ""] },
            group: { $ifNull: ["$groupInfo.group", ""] },
            groupid: { $ifNull: ["$groupInfo._id", ""] },
            groupCode: { $ifNull: ["$groupInfo.groupCode", ""] },
            brand: { $ifNull: ["$brandInfo.brand", ""] },
            brandid: { $ifNull: ["$brandInfo._id", ""] },
            brandCode: { $ifNull: ["$brandInfo.brandCode", ""] },
            LP: { $ifNull: ["$LP", 0] },
            HP: { $ifNull: ["$HP", ""] },
            KW: { $ifNull: ["$KW", ""] },
            productStage: { $ifNull: ["$productStage", ""] },
            modelNo: { $ifNull: ["$modelNo", ""] },
            suc_del: { $ifNull: ["$suc_del", ""] },
            discount: { $ifNull: ["$discount", ""] },
            finalPrice: { $ifNull: ["$finalPrice", ""] },
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
};

