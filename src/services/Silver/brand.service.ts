import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Request } from 'express';
const ObjectId = require('mongoose').Types.ObjectId;
import { SilverBrand, SilverBrandDocument } from '../../entities/Silver/silverBrand.entity';
import { User, UserDocument } from '../../entities/users.entity';
import { SilverProduct, SilverProductDocument } from '../../entities/Silver/silverProductMaster';
import { getAuthUserInfo } from 'src/common/utils/jwt.helper';
import { SearchDto } from 'src/dto/pagination-dto';
import { GetBrandInfoDto} from '../../Silver/brand/dto/response-brand.dto';
import { CreateBrandDto, FilterPaginationBrandDto, UpdateStatusBrandDto, UpdateBrandDto } from '../../Silver/brand/dto/request-brand.dto';

@Injectable()
export class BrandService {
  constructor(
    @InjectModel(SilverProduct.name) private silverProductModel: Model<SilverProductDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(SilverBrand.name) private brandModel: Model<SilverBrandDocument>
    ) {};

  public async createBrand(createBrandDto: CreateBrandDto, req: Request) {
    try {
    const authInfo = await getAuthUserInfo(req.headers)
    
    const findUnit = await this.brandModel.findOne({ brand: createBrandDto.brand });

    if (findUnit) {
      return new BadRequestException("SilverBrand already exist")
    }
    const SilverBrand = new this.brandModel({ ...createBrandDto, createdBy: authInfo._id });
    if (SilverBrand.save()) {
      return new GetBrandInfoDto(SilverBrand)
    }
    throw new BadRequestException('Error in Create SilverBrand');
          
  } catch (e) {
    throw new InternalServerErrorException(e);
  }
  };

  async getAllBrand(paginationDto: FilterPaginationBrandDto,req:Request): Promise<any> {
    try {
    const currentPage = paginationDto.currentPage || 1;
    const recordPerPage = paginationDto.recordPerPage || 10;
    const orderByFields = paginationDto.orderBy || ["createdAt"];
    let searchQuery = {}
    let activeCondition = { active: true};
    if(paginationDto.active == false){
        activeCondition = {active: false}
    }

    if (paginationDto.search != '') {
      searchQuery = {$or:[{brandCode: Number(paginationDto.search)},{ brand: { $regex: paginationDto.search, '$options': 'i' } }]  }
    }
    const units = await this.brandModel.aggregate([
  
      {
        $match:activeCondition
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
            { $sort: { [orderByFields[0]]:-1 } },
            { $skip: (currentPage - 1) * recordPerPage },
            { $limit: recordPerPage }
          ]
        }
      }
    ]).exec();

    if (!units || !units[0]) {
      throw new BadRequestException('Data Not Found');
    }
    return units;
  } catch (e) {
    throw new InternalServerErrorException(e);
  }
  };

  async getBrandInfo(id: string): Promise<any> {
    try {
    const SilverBrand = await this.brandModel.aggregate([{ $match: { _id: ObjectId(id) } }]).exec();

    if (!SilverBrand || !SilverBrand[0]) {
      throw new BadRequestException('Data Not Found');
    }
    return SilverBrand;
  } catch (e) {
    throw new InternalServerErrorException(e);
  }
  };

  async deleteBrand(id: string): Promise<SilverBrand> {
    try {
      return await this.brandModel.findByIdAndDelete(id)
    }
    catch (e) {
      throw new InternalServerErrorException(e);
    }
  };

  async UpdateBrand(id: string, updateBrandDto: UpdateBrandDto): Promise<SilverBrand> {
    try {
      const findUnit = await this.brandModel.find({ brand: updateBrandDto.brand, _id: { $ne: id } });
      if (findUnit.length > 0) {
        throw new BadRequestException("SilverBrand not exist")
      }
      return await this.brandModel.findByIdAndUpdate(id, updateBrandDto, { new: true, useFindAndModify: false })
    }
    catch (e) {
      throw new InternalServerErrorException(e);
    }
  };

  async getBrandDropDown(searchDto: SearchDto,req:Request): Promise<any> {
    try {
      const authInfo = await getAuthUserInfo(req.headers);
      const user = await this.userModel.findOne({_id:ObjectId(authInfo._id),userType:"ROTEX"});
      let productObj = {}
      if(user){
        const units = user?.units ?? [];
        productObj = {_id:{$in:units}}
      }
      let searchQuery = {}
      if (searchDto.search != '') {
        searchQuery = { SilverBrand: Number(searchDto.search) }

      } else {
        searchQuery = {}
      }
      const data = await this.brandModel.aggregate([
        {$match:{active:true}},
        {
          $match:productObj
        },
        {
          $project: {
            _id: 1,
            brand: { $ifNull: ["$brand", ""] },
            brandCode: { $ifNull: ["$brandCode", 0] },
            createdAt: { $dateToString: { format: "%Y-%m-%d %H:%M", date: "$createdAt" } },
          },
        },
      ]).exec()
      if (!data) {
        throw new BadRequestException('Data Not Found');
      }
      return data;
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  };

  async updateBrandStatus(id: string,updateStatusBrandDto:UpdateStatusBrandDto): Promise<SilverBrand> {
    try {
     let findUnit =  await this.brandModel.findOne({_id:ObjectId(id)})
     if(!findUnit){
      throw new BadRequestException("SilverBrand not exit")
     }
     if(updateStatusBrandDto.active == false){
      await this.silverProductModel.updateMany({unitid:ObjectId(id)},{active:updateStatusBrandDto.active}, { new: true, useFindAndModify: false });
     }
     return await this.brandModel.findByIdAndUpdate({_id:ObjectId(id)},{active:updateStatusBrandDto.active}, { new: true, useFindAndModify: false });
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  };

};
