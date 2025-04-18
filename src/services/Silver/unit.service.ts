import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Request } from 'express';
const ObjectId = require('mongoose').Types.ObjectId;
import { SilverUnit, SilverUnitDocument } from '../../entities/Silver/silverUnit.entity';
import { User, UserDocument } from '../../entities/users.entity';
import { SilverProduct, SilverProductDocument } from '../../entities/Silver/silverProductMaster';
import { getAuthUserInfo } from 'src/common/utils/jwt.helper';
import { SearchDto } from 'src/dto/pagination-dto';
import { GetUnitInfoDto } from '../../Silver/unit/dto/response-unit.dto';
import { CreateUnitDto, FilterPaginationUnitDto, UpdateStatusUnitDto, UpdateUnitDto } from '../../Silver/unit/dto/request-unit.dto';
import * as fs from 'fs';
import * as v8 from 'v8';
@Injectable()
export class UnitService {
  constructor(
    @InjectModel(SilverUnit.name) private unitModel: Model<SilverUnitDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(SilverProduct.name) private productModel: Model<SilverProductDocument>
    ) {};

  public async createUnit(createUnitDto: CreateUnitDto, req: Request) {
    try {
    const authInfo = await getAuthUserInfo(req.headers)
    
    const findUnit = await this.unitModel.findOne({ unit: createUnitDto.unit });
    const findUnitCode = await this.unitModel.findOne({ unitCode: createUnitDto.unitCode });

    if (findUnit) {
      return new BadRequestException("SilverUnit already exist")
    }
    if (findUnitCode) {
      return new BadRequestException("SilverUnit code already exist")
    }
    const SilverUnit = new this.unitModel({ ...createUnitDto, createdBy: authInfo._id });
    if (SilverUnit.save()) {
      return new GetUnitInfoDto(SilverUnit)
    }
    throw new BadRequestException('Error in Create SilverUnit');
  } catch (e) {
    throw new InternalServerErrorException(e);
  }
  };

  async getAllUnits(paginationDto: FilterPaginationUnitDto,req:Request): Promise<any> {
    try {
    const authInfo = await getAuthUserInfo(req.headers);
    const currentPage = paginationDto.currentPage || 1;
    const recordPerPage = paginationDto.recordPerPage || 10;
    const orderByFields = paginationDto.orderBy || ["createdAt"];
    let searchQuery = {}
    let activeCondition = { active: true};
    if(paginationDto.active == false){
        activeCondition = {active: false}
    }

    if (paginationDto.search != '') {
      searchQuery = {$or:[{unitCode: Number(paginationDto.search)},{ unit: { $regex: paginationDto.search, '$options': 'i' } }]  }
    }
    const units = await this.unitModel.aggregate([
   
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

  async getUnitInfo(id: string): Promise<any> {
    try {
    const SilverUnit = await this.unitModel.aggregate([
      { $match: { _id: ObjectId(id) } }
    ]).exec();

    if (!SilverUnit || !SilverUnit[0]) {
      throw new BadRequestException('Data Not Found');
    }
    return SilverUnit;
  } catch (e) {
    throw new InternalServerErrorException(e);
  }
  };

  async deleteUnit(id: string): Promise<SilverUnit> {
    try {
      return await this.unitModel.findByIdAndDelete(id)
    }
    catch (e) {
      throw new InternalServerErrorException(e);
    }
  };

  async UpdateUnit(id: string, updateUnitDto: UpdateUnitDto): Promise<SilverUnit> {
    try {
      const findUnit = await this.unitModel.find({ unit: updateUnitDto.unit, _id: { $ne: id } });
      if (findUnit.length > 0) {
        throw new BadRequestException("SilverUnit already exist");
      }
      return await this.unitModel.findByIdAndUpdate(id, updateUnitDto, { new: true, useFindAndModify: false });
    }
    catch (e) {
      throw new InternalServerErrorException(e);
    }
  };

  async getUnitDropDown(searchDto: SearchDto,req:Request): Promise<any> {
    try {
      let searchQuery = {}
      if (searchDto.search != '') {
        searchQuery = { SilverUnit: Number(searchDto.search) }

      } else {
        searchQuery = {}
      }
      const data = await this.unitModel.aggregate([
        {$match:{active:true}},
        {
          $project: {
            _id: 1,
            unit: { $ifNull: ["$unit", ""] },
            unitCode: { $ifNull: ["$unitCode", 0] },
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

  async updateUnitStatus(id: string,updateStatusUnitDto:UpdateStatusUnitDto): Promise<SilverUnit> {
    try {
     let findUnit =  await this.unitModel.findOne({ _id:ObjectId(id)});
     if(!findUnit){
      throw new BadRequestException("SilverUnit not exit")
     }
     if(updateStatusUnitDto.active == false){
      await this.productModel.updateMany({unitid:ObjectId(id)},{active:updateStatusUnitDto.active}, { new: true, useFindAndModify: false });
     }
     return await this.unitModel.findByIdAndUpdate({_id:ObjectId(id)},{active:updateStatusUnitDto.active}, { new: true, useFindAndModify: false });
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  };


  async test(): Promise<any> {
    try {
   
      const snapshot: NodeJS.ReadableStream = v8.getHeapSnapshot();
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
     } catch (e) {
      console.log(e,32343)
      throw new InternalServerErrorException(e);
    }
  };
};
