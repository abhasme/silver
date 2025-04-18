import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { Model } from 'mongoose';
import { Request } from 'express';
import { InjectModel } from '@nestjs/mongoose';
const ObjectId = require('mongoose').Types.ObjectId;
import { SilverCategory, SilverCategoryDocument } from '../../entities/Silver/silverCategory.entity';
import { SilverProduct,SilverProductDocument } from '../../entities/Silver/silverProductMaster';
import { SilverSubcategory, SilverSubcategoryDocument } from '../../entities/Silver/silverSubCategory';
import { CreateCategoryDto,FilterPaginationUserDto, ImportCategoryDto, StatusCategoryDto, UpdateCategoryDto } from '../../Silver/silver-category/dto/request-category.dto';
import { GetCategoryInfoDto } from '../../Silver/silver-category/dto/response-category.dto';
import { getAuthUserInfo } from 'src/common/utils/jwt.helper';
import { SearchDto } from 'src/dto/pagination-dto';
@Injectable()
export class SilverCategoryService {
  constructor(
   @InjectModel(SilverCategory.name) private categoryModel: Model<SilverCategoryDocument>,
   @InjectModel(SilverProduct.name) private productModel: Model<SilverProductDocument>,
   @InjectModel(SilverSubcategory.name) private subcategoryModel: Model<SilverSubcategoryDocument>,
  ) { };

  public async createCategory(createCategoryDto: CreateCategoryDto, req: Request) {
    try {
    const authInfo = await getAuthUserInfo(req.headers)

    const findCatrgory= await this.categoryModel.find({ categoryName: createCategoryDto.categoryName })
    if (findCatrgory.length > 0) {

      throw new BadRequestException(" category already exist")
    }
    const category = new this.categoryModel({ ...createCategoryDto, createdBy: authInfo._id });
    if (category.save()) {
      return new GetCategoryInfoDto(category)
    }
    throw new BadRequestException('Error in Create Category');
          
  } catch (e) {
    throw new InternalServerErrorException(e)
  }
  };

  async getAllCategories(paginationDto: FilterPaginationUserDto): Promise<any> {
    try {
    const currentPage = paginationDto.currentPage || 1;
    const recordPerPage = paginationDto.recordPerPage || 10;
    const searchQuery = paginationDto.search || "";
    const orderByFields = paginationDto.orderBy || ["createdAt"]; // Default ordering by createdAt
    let activeCondition = {active:true}
    if(paginationDto.active == false){
      activeCondition = {active:false}
    }
    const categories = await this.categoryModel.aggregate([
      {$match:activeCondition},
      {
        $facet: {
          paginate: [
            { $match: { $or:[{categoryName: { $regex: searchQuery, $options: "i" } },{categoryCode: { $regex: searchQuery, $options: "i" } }]} },
            { $count: "totalDocs" },
            { $addFields: { recordPerPage: recordPerPage, currentPage: currentPage } }
          ],
          docs: [
            { $match: { $or:[{categoryName: { $regex: searchQuery, $options: "i" } },{categoryCode: { $regex: searchQuery, $options: "i" } }]} },
            { $sort: { [orderByFields[0]]: -1 } },
            { $skip: (currentPage - 1) * recordPerPage },
            { $limit: recordPerPage }
          ]
        }
      }
    ]).exec();
  
    if (!categories || !categories[0]) {
      throw new BadRequestException('Data Not Found');
    }
  
    return categories;
          
  } catch (e) {
    throw new InternalServerErrorException(e)
  }
  };

  async getCategoryInfo(id: string): Promise<GetCategoryInfoDto> {
    try {
      const data = await this.categoryModel.aggregate([
        { $match: { "_id": ObjectId(id) } },
        {
          $project: {
            _id: 1,
            categoryName: { $ifNull: ["$categoryName", ""] },
            categoryCode: { $ifNull: ["$categoryCode", ""] },
            active: { $ifNull: ["$active", false] },
          },
        },
        { $limit: 1 },
      ]).exec()
      if (!data) {
        throw new BadRequestException('Data Not Found');
      }
      return new GetCategoryInfoDto(data[0]);
    } catch (e) {
      throw new InternalServerErrorException(e)
    }
  };

  async updateCategoryInfo(id: string, updateCategoryDto: UpdateCategoryDto): Promise<SilverCategory> {
    try {
      const findCatrgory= await this.categoryModel.find({ categoryName: updateCategoryDto.categoryName,_id:{$ne:ObjectId(id)} })
      if (findCatrgory.length > 0) {
  
        throw new BadRequestException("  category already exist")
      }
      return await this.categoryModel.findByIdAndUpdate(id, updateCategoryDto, { new: true, useFindAndModify: false })
    }
    catch (e) {
      throw new InternalServerErrorException(e)
    }
  };

  async deleteCategory(id: string): Promise<SilverCategory> {
    try {
      return await this.categoryModel.findByIdAndDelete(id)
    }
    catch (e) {
      throw new InternalServerErrorException(e)
    }
  };

  async updateStatus(id:string,statusCategoryDto: StatusCategoryDto): Promise<SilverCategory> {
    try {
      if(statusCategoryDto.active === false){
        
        await this.productModel.updateMany({categoryid:statusCategoryDto.categoryid}, { active: statusCategoryDto.active }, { new: true, useFindAndModify: false })
        await this.subcategoryModel.updateMany({categoryid:statusCategoryDto.categoryid}, { active: statusCategoryDto.active }, { new: true, useFindAndModify: false })
      }
      return await this.categoryModel.findByIdAndUpdate(statusCategoryDto.categoryid, { active: statusCategoryDto.active }, { new: true, useFindAndModify: false })
    }
    catch (e) {
      throw new InternalServerErrorException(e)
    }
  };

  async importCategory(req: Request, importCategoryDto: ImportCategoryDto[]): Promise<any> {
    try {
      let errorArrray = [];
      const dataArray = Array.isArray(importCategoryDto) ? importCategoryDto : Object.values(importCategoryDto);
      const mappedArray = await Promise.all(dataArray.map(async (category: any) => {

        const existCategory = await this.categoryModel.findOne({ categoryName: category.categoryName }).select('_id').exec()
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
        
        await checkBlank(category.categoryName, "categoryName is blank");
        await checkBlank(category.categoryName, "categoryCode is blank");
        if (!errString) {

          if (!existCategory) {
            await this.categoryModel.create({
              ...category,
            });
          } else {
          errString += `category exist`;
          }
        }

        if (errString !== "") {
          category["error"] = errString;
          errorArrray.push(category);
        }

      })
      );
      return new GetCategoryInfoDto({ mappedArray: mappedArray, errorArrray: errorArrray });
    }
    catch (e) {
      throw new InternalServerErrorException(e)
    }
  };
  
  async getCategoryDropDown(searchDto: SearchDto): Promise<any> {
    try {
      const data = await this.categoryModel.aggregate([
        {$match:{active:true}},
        {
          $project: {
            _id: 0,
            label: { $ifNull: ["$categoryName", ""] },
            value: { $ifNull: ["$_id", ""] },
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