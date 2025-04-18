import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { RoMaster, RoMasterDocument } from '../../entities/Silver/roMaster';
import { RoOrder, RoOrderDocument } from '../../entities/Silver/roOrder';
import { RoInventory, RoInventoryDocument } from '../../entities/Silver/roInventory';
import { RoConsumption, RoConsumptionDocument } from '../../entities/Silver/roConsumption';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateRoMasterDto, ImportRoMasterDto, UpdateRoMasterDto, UpdateStatusRoMasterDto } from '../../Silver/ro-master/dto/request-roMaster.dto';
import { GetRoMasterInfoDto } from '../../Silver/ro-master/dto/response-roMaster.dto';

import { Request} from 'express';
import { FilterPaginationRoMasterDto } from 'src/dto/roMaster.dto';
import { getAuthUserInfo, multiSelectorFunction } from "src/common/utils/jwt.helper";
const ObjectId = require('mongoose').Types.ObjectId;

@Injectable()
export class RoMasterService {
  constructor(
    @InjectModel(RoOrder.name) private roOrderModel: Model<RoOrderDocument>,
    @InjectModel(RoMaster.name) private roMasterModel: Model<RoMasterDocument>,
    @InjectModel(RoInventory.name) private roInventoryModel: Model<RoInventoryDocument>,
    @InjectModel(RoConsumption.name) private roConsumptionModel: Model<RoConsumptionDocument>,
    ) { };

  async getAllRoMaster(paginationDto: FilterPaginationRoMasterDto): Promise<any> {
    try {
      const currentPage = paginationDto.currentPage || 1
      const recordPerPage = paginationDto.recordPerPage || 10
      const sortFields = {};

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
        sortFields["createdAt"] =-1;
      }
      let activeCondition = {isActive :true}
      if(paginationDto.isActive == false){
        activeCondition = {isActive:false}
      }
      const filter = await multiSelectorFunction(paginationDto)
      const roMasters = await this.roMasterModel.aggregate([
        {
          $match:activeCondition
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
        throw new BadRequestException('Data Not Found');
      }
      return roMasters;
    } catch (error) {
      throw new Error(`Error while fetching ro master data: ${error.message}`);
    }
  };

  public async createRo(createRoMasterDto: CreateRoMasterDto, req: Request) {
    try {
    const authInfo = await getAuthUserInfo(req.headers);
   
    const findEmail = await this.roMasterModel.find({email: createRoMasterDto.email});
    if (findEmail.length > 0) {
      throw new BadRequestException("Email already exist");
    }
    const findRoName = await this.roMasterModel.find({roName: createRoMasterDto.roName});
    if (findRoName.length > 0) {
      throw new BadRequestException("Ro name already exist");
    }

    const customer = new this.roMasterModel({ ...createRoMasterDto, isActive: true, createdBy: authInfo._id });
    const save = await customer.save()
    if (save) {
      return new GetRoMasterInfoDto(customer);
    }
    throw new BadRequestException('Error in Create Ro master');
          
  } catch (e) {
    throw new InternalServerErrorException(e);
  }
  };

  async getRoMasterInfo(id: string): Promise<GetRoMasterInfoDto> {
    try {
      const data = await this.roMasterModel.aggregate([
        { $match: { "_id": ObjectId(id) } },
        { $limit: 1 },
      ]).exec()
      if (!data) {
        throw new BadRequestException('Data Not Found');
      }
      return new GetRoMasterInfoDto(data[0]);
    } catch (e) {
      throw new InternalServerErrorException(e)
    }
  };

  async UpdateRoMaster(id: string, roMasterDto: UpdateRoMasterDto): Promise<RoMaster> {
    try {
      const findEmail = await this.roMasterModel.find({ email: roMasterDto.email, _id: { $ne: id } });
      if (findEmail.length > 0) {
        throw new BadRequestException("Email already exist");
      }

      const findRoName = await this.roMasterModel.find({ roName: roMasterDto.roName, _id: { $ne: id } });
      if (findRoName.length > 0) {
        throw new BadRequestException("ro name already exist");
      }
      return await this.roMasterModel.findByIdAndUpdate(id, roMasterDto, { new: true, useFindAndModify: false })
    }
    catch (e) {
      throw new InternalServerErrorException(e);
    }
  };

  async deleteRoMaster(id: string): Promise<RoMaster> {
    try {
      return await this.roMasterModel.findByIdAndDelete(id)
    }
    catch (e) {
      throw new InternalServerErrorException(e)
    }
  };

  async importRoMaster(importRoMasterDto: ImportRoMasterDto[]): Promise<any> {
    try {
      let errorArrray = [];
      const dataArray = Array.isArray(importRoMasterDto) ? importRoMasterDto : Object.values(importRoMasterDto);
      const mappedArray = await Promise.all(dataArray.map(async (roMaster: any) => {
        const exitRo = await this.roMasterModel.findOne({ $or:[{phone: roMaster.phone},{roName: roMaster.roName},{ email: roMaster.email }] })
        let errString = "";

        const checkBlank = (property, errorMessage) => {
          if (property === "" || property === null || property === "null") {
            errString += `${errorMessage} ,`;
          }
        }

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
            await this.roMasterModel.create({
              ...roMaster,
            });
          } else if (exitRo !== null) {
            if (
              exitRo.roName === roMaster.roName &&
              exitRo.email === roMaster.email &&
              exitRo.phone === roMaster.phone
            ) {
              await this.roMasterModel.findOneAndUpdate(
                { email: roMaster.email },
                {
                  $set: roMaster,
                },
                { new: true, setDefaultsOnInsert: false }
              ).lean();
            }else{
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
      })
      );
      return new GetRoMasterInfoDto({mappedArray:mappedArray,errorArrray:errorArrray});
    }
    catch (e) {
      throw new InternalServerErrorException(e)
    }
  };

  async getRoMasterDropDown(): Promise<any> {
    try {
      const roMaster = await this.roMasterModel.aggregate([
        {
             $match:{isActive:true}
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
        throw new BadRequestException('Data Not Found');
      }
      return roMaster;
    } catch (e) {
      throw new InternalServerErrorException(e)
    }
  };

  async getCompanyNameDropDown(): Promise<any> {
    try {
    const roName = await this.roMasterModel.distinct("roName").exec();
      if (!roName) {
        throw new BadRequestException('Data Not Found');
      }
      return roName;
    } catch (e) {
      throw new InternalServerErrorException(e)
    }
  };

  async updateRoMasterStatus(id: string,updateRoMasterDto:UpdateStatusRoMasterDto):Promise<UpdateStatusRoMasterDto> {
    try {
     let findRoMaster =  await this.roMasterModel.findOne({
      _id:ObjectId(id)
     })
     if(!findRoMaster){
      throw new BadRequestException("Ro master not exit already exist")
     }
     if(updateRoMasterDto.active == false){
      await this.roConsumptionModel.updateMany({roId:ObjectId(id)},{active:updateRoMasterDto.active}, { new: true, useFindAndModify: false})
      await this.roOrderModel.updateMany({roId:ObjectId(id)},{active:updateRoMasterDto.active}, { new: true, useFindAndModify: false})
      await this.roInventoryModel.updateMany({roId:ObjectId(id)},{active:updateRoMasterDto.active}, { new: true, useFindAndModify: false})

     }
     return await this.roMasterModel.findByIdAndUpdate({_id:ObjectId(id)},{isActive:updateRoMasterDto.active}, { new: true, useFindAndModify: false})
    } catch (e) {
      throw new InternalServerErrorException(e)
    }
  };

};