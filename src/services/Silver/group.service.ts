import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Request } from 'express';
const ObjectId = require('mongoose').Types.ObjectId;
import { User, UserDocument } from '../../entities/users.entity';
import { SilverGroup, SilverGroupDocument } from '../../entities/Silver/silverGroup.entity';
import { SilverProduct, SilverProductDocument } from '../../entities/Silver/silverProductMaster';
import { getAuthUserInfo } from 'src/common/utils/jwt.helper';
import { SearchDto } from 'src/dto/pagination-dto';
import { GetGroupInfoDto } from '../../Silver/group/dto/response-group.dto';
import { CreateGroupDto, FilterPaginationGroupDto, UpdateGroupDto, UpdateStatusGroupDto } from '../../Silver/group/dto/request-group.dto';

@Injectable()
export class GroupService {
  constructor(
    @InjectModel(SilverGroup.name) private GroupModel: Model<SilverGroupDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(SilverProduct.name) private productModel: Model<SilverProductDocument>
    ) {};

  public async createGroup(createGroupDto: CreateGroupDto, req: Request) {
    try {
    const authInfo = await getAuthUserInfo(req.headers)
    
    const findGroup = await this.GroupModel.findOne({ group: createGroupDto.group });

    if (findGroup) {
      return new BadRequestException("SilverGroup already exist")
    }
    const SilverGroup = new this.GroupModel({ ...createGroupDto, createdBy: authInfo._id });
    if (SilverGroup.save()) {
      return new GetGroupInfoDto(SilverGroup)
    }
    throw new BadRequestException('Error in Create SilverGroup');
          
  } catch (e) {
    throw new InternalServerErrorException(e);
  }
  };

  async getAllGroups(paginationDto: FilterPaginationGroupDto,req:Request): Promise<any> {
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
      searchQuery = {$or:[{groupCode: Number(paginationDto.search)},{ group: { $regex: paginationDto.search, '$options': 'i' } }]  }

    }
    const Groups = await this.GroupModel.aggregate([

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

    if (!Groups || !Groups[0]) {
      throw new BadRequestException('Data Not Found');
    }

    return Groups;
          
  } catch (e) {
    throw new InternalServerErrorException(e);
  }
  };

  async getGroupInfo(id: string): Promise<any> {
    try {
    const SilverGroup = await this.GroupModel.aggregate([
      { $match: { _id: ObjectId(id) } }
    ]).exec();

    if (!SilverGroup || !SilverGroup[0]) {
      throw new BadRequestException('Data Not Found');
    }
    return SilverGroup;
  } catch (e) {
    throw new InternalServerErrorException(e);
  }
  };

  async deleteGroup(id: string): Promise<SilverGroup> {
    try {
      return await this.GroupModel.findByIdAndDelete(id)
    }
    catch (e) {
      throw new InternalServerErrorException(e);
    }
  };

  async UpdateGroup(id: string, updateGroupDto: UpdateGroupDto): Promise<SilverGroup> {
    try {
      const findGroup = await this.GroupModel.find({ group: updateGroupDto.group, _id: { $ne: id } });
      if (findGroup.length > 0) {
        throw new BadRequestException("SilverGroup not exist")
      }
      return await this.GroupModel.findByIdAndUpdate(id, updateGroupDto, { new: true, useFindAndModify: false })
    }
    catch (e) {
      throw new InternalServerErrorException(e);
    }
  };

  async getGroupDropDown(searchDto: SearchDto,req:Request): Promise<any> {
    try {
      let searchQuery = {}
      if (searchDto.search != '') {
        searchQuery = { SilverGroup: Number(searchDto.search) }

      } else {
        searchQuery = {}
      }
      const data = await this.GroupModel.aggregate([
        {$match:{active:true}},

        {
          $project: {
            _id: 1,
            group: { $ifNull: ["$group", ""] },
            groupCode: { $ifNull: ["$groupCode", ""] },
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

  async updateGroupStatus(id: string,updateStatusGroupDto:UpdateStatusGroupDto): Promise<SilverGroup> {
    try {
     let findGroup =  await this.GroupModel.findOne({_id:ObjectId(id)})
     if(!findGroup){
      throw new BadRequestException("SilverGroup not exit")
     }
     if(updateStatusGroupDto.active == false){
      await this.productModel.updateMany({groupid:ObjectId(id)},{active:updateStatusGroupDto.active}, { new: true, useFindAndModify: false })

     }
     return await this.GroupModel.findByIdAndUpdate({_id:ObjectId(id)},{active:updateStatusGroupDto.active}, { new: true, useFindAndModify: false })

  
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  };

};
