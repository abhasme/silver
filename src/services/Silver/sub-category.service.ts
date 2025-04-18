import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Request } from 'express';
const ObjectId = require('mongoose').Types.ObjectId;
import { SilverProduct, SilverProductDocument } from '../../entities/Silver/silverProductMaster';
import { SilverSubcategory, SilverSubcategoryDocument } from '../../entities/Silver/silverSubCategory';
import { SilverCategory, SilverCategoryDocument } from '../../entities/Silver/silverCategory.entity';
import { getAuthUserInfo } from 'src/common/utils/jwt.helper';
import { GetSubcategoryInfoDto } from '../../Silver/silver-sub-category/dto/response-subcategory.dto';
import { FilterPaginationUserDto,CreateSubcategoryDto, StatusSubcategoryDto, UpdateSubcategoryDto } from '../../Silver/silver-sub-category/dto/request-subcategory.dto';
@Injectable()
export class SilverSubcategoryService {
  constructor(
    @InjectModel(SilverSubcategory.name) private subcategoryModel: Model<SilverSubcategoryDocument>,
    @InjectModel(SilverProduct.name) private productModel: Model<SilverProductDocument>,
    @InjectModel(SilverCategory.name) private categoryModel: Model<SilverCategoryDocument>
  ) {};

  public async createSubcategory(createSubcategoryDto: CreateSubcategoryDto, req: Request) {
    try {

    const authInfo = await getAuthUserInfo(req.headers)
    if(!createSubcategoryDto.categoryid){
      throw new BadRequestException("Category id not found")
    }
    const findSubcatrgory= await this.subcategoryModel.find({ subcategoryName: createSubcategoryDto.subcategoryName });

    if (findSubcatrgory.length > 0) {throw new BadRequestException("subCategory already exist")}

    const findSubcatrgoryCode= await this.subcategoryModel.find({ subCategoryCode: createSubcategoryDto.subCategoryCode });

    if (findSubcatrgoryCode.length > 0) {throw new BadRequestException("subCategory code already exist")}
    
    const subcategory = new this.subcategoryModel({ ...createSubcategoryDto, createdBy: authInfo._id });
    if (subcategory.save()) {return new GetSubcategoryInfoDto(subcategory)}
    throw new BadRequestException('Error in Create Subcategory');
          
  } catch (e) {
    throw new InternalServerErrorException(e)
  }
  };

  async getAllSubcategory(paginationDto: FilterPaginationUserDto): Promise<any> {
    try {

    const currentPage = paginationDto.currentPage || 1;
    const recordPerPage = paginationDto.recordPerPage || 10;
    const searchQuery = paginationDto.search || "";
    const orderByFields = paginationDto.orderBy || ["createdAt"];

    let activeCondition = {active:true}
    if(paginationDto.active == false){
      activeCondition = {active:false}
    }
    const categories = await this.subcategoryModel.aggregate([
      {
        $match:activeCondition
      },
      {
        $facet: {
          paginate: [
            { $match: { $or:[{subcategoryName: { $regex: searchQuery, $options: "i" }},{subcategoryCode: { $regex: searchQuery, $options: "i" }}] } },
            { $count: "totalDocs" },
            { $addFields: { recordPerPage: recordPerPage, currentPage: currentPage } }
          ],
          docs: [
            { $match: { $or:[{subcategoryName: { $regex: searchQuery, $options: "i" }},{subcategoryCode: { $regex: searchQuery, $options: "i" }}] } },
            { $sort: { [orderByFields[0]]:-1 } },
            { $skip: (currentPage - 1) * recordPerPage },
            { $limit: recordPerPage }
          ]
        }
      }
    ]).exec();
    if (!categories || !categories[0]) {throw new BadRequestException('Data Not Found')}
    return categories;
          
  } catch (e) {
    throw new InternalServerErrorException(e)
  }
  };

  async getSubcategoriesByCategoryId(paginationDto: FilterPaginationUserDto): Promise<any> {
    try {
    const subcategories = await this.subcategoryModel.aggregate([{ $match: { categoryid: ObjectId(paginationDto.categoryId),active:true } }]).exec();
    if (!subcategories || !subcategories[0]) {throw new BadRequestException('Data Not Found')}
    return subcategories;
          
  } catch (e) {
    throw new InternalServerErrorException(e)
    }
  };

  async getSubcategoryInfo(id: string): Promise<GetSubcategoryInfoDto> {
    try {
      
      const data = await this.subcategoryModel.aggregate([
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
          $project: {
            _id: 1,
            subcategoryName: { $ifNull: ["$subcategoryName", ""] },
            subCategoryCode: { $ifNull: ["$subCategoryCode", ""] },
            categoryid: { $ifNull: ["$categoryid", ""] },
            categoryName: { $ifNull: [{ $first: "$categoryInfo.categoryName" }, ""] },
            active: { $ifNull: ["$active", false] },
          },
        },
        { $limit: 1 },
      ]).exec()
      if (!data) {throw new BadRequestException('Data Not Found')}
      return new GetSubcategoryInfoDto(data[0]);
    } catch (e) {
      throw new InternalServerErrorException(e)
    }
  };

  async updateSubcategoryInfo(id: string, updateSubcategoryDto: UpdateSubcategoryDto): Promise<SilverSubcategory> {
    try {
      const findSubcatrgory= await this.subcategoryModel.find({ subcategoryName: updateSubcategoryDto.subcategoryName,_id:{$ne:ObjectId(id)} })
      if (findSubcatrgory.length > 0) {throw new BadRequestException("subCategory already exist")}
      return await this.subcategoryModel.findByIdAndUpdate(id, updateSubcategoryDto, { new: true, useFindAndModify: false })
    } catch (e) {
      throw new InternalServerErrorException(e)
    }
  };

  async deleteSubcategory(id: string): Promise<SilverSubcategory> {
    try {return await this.subcategoryModel.findByIdAndDelete(id)}
    catch (e) {  
      throw new InternalServerErrorException(e)
    }
  };

  async updateStatus(id:string,statusSubcategoryDto: StatusSubcategoryDto): Promise<SilverSubcategory> {
    try {
      if(statusSubcategoryDto.active === false){
         await this.productModel.updateMany({subcategoryid:ObjectId(statusSubcategoryDto.subcategoryid)}, { active: statusSubcategoryDto.active }, { new: true, useFindAndModify: false })
      }
      return await this.subcategoryModel.findByIdAndUpdate(statusSubcategoryDto.subcategoryid, { active: statusSubcategoryDto.active }, { new: true, useFindAndModify: false })
    }
    catch (e) {
      throw new InternalServerErrorException(e)
    }
  };

  async importSubCategory(createSubcategoryDto: CreateSubcategoryDto[]): Promise<any> {
    try {
      let errorArrray = [];
      const dataArray = Array.isArray(createSubcategoryDto) ? createSubcategoryDto : Object.values(createSubcategoryDto);
      const mappedArray = await Promise.all(dataArray.map(async (category: any) => {
        const existCategory = await this.categoryModel.findOne({ categoryName: category.categoryName }).select('_id').exec()
        const existSubCategory = await this.subcategoryModel.findOne({ subcategoryName: category.subcategoryName }).select('_id').exec()
        let errString = "";
        const checkBlank = (property, errorMessage) => {
          if (property === "" || property === null || property === "null") {
            errString += `${errorMessage} ,`;
          }
        };
        
        await checkBlank(category.categoryName, "categoryName is blank");
        await checkBlank(category.categoryName, "subcategoryCode is blank");
        await checkBlank(category.subcategoryName, "subcategoryName is blank");
        if (!errString) {

          if (!existSubCategory && existCategory) {

            await this.subcategoryModel.create({...category,categoryid:existCategory._id,});
          } else if(existSubCategory && existCategory) {
            errString += `Sub category exist`;
          }
        }
        if (errString !== "") {
          category["error"] = errString;
          errorArrray.push(category);
        }

      })
      );
      return new GetSubcategoryInfoDto({ mappedArray: mappedArray, errorArrray: errorArrray });
    }
    catch (e) {
      throw new InternalServerErrorException(e)
    }
  };

};
