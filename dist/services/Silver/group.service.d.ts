import { BadRequestException } from '@nestjs/common';
import { Model } from 'mongoose';
import { Request } from 'express';
import { UserDocument } from '../../entities/users.entity';
import { SilverGroup, SilverGroupDocument } from '../../entities/Silver/silverGroup.entity';
import { SilverProductDocument } from '../../entities/Silver/silverProductMaster';
import { SearchDto } from 'src/dto/pagination-dto';
import { GetGroupInfoDto } from '../../Silver/group/dto/response-group.dto';
import { CreateGroupDto, FilterPaginationGroupDto, UpdateGroupDto, UpdateStatusGroupDto } from '../../Silver/group/dto/request-group.dto';
export declare class GroupService {
    private GroupModel;
    private userModel;
    private productModel;
    constructor(GroupModel: Model<SilverGroupDocument>, userModel: Model<UserDocument>, productModel: Model<SilverProductDocument>);
    createGroup(createGroupDto: CreateGroupDto, req: Request): Promise<BadRequestException | GetGroupInfoDto>;
    getAllGroups(paginationDto: FilterPaginationGroupDto, req: Request): Promise<any>;
    getGroupInfo(id: string): Promise<any>;
    deleteGroup(id: string): Promise<SilverGroup>;
    UpdateGroup(id: string, updateGroupDto: UpdateGroupDto): Promise<SilverGroup>;
    getGroupDropDown(searchDto: SearchDto, req: Request): Promise<any>;
    updateGroupStatus(id: string, updateStatusGroupDto: UpdateStatusGroupDto): Promise<SilverGroup>;
}
