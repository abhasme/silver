import { GroupService } from '../../services/Silver/group.service';
import { CreateGroupDto, UpdateStatusGroupDto, FilterPaginationGroupDto, UpdateGroupDto } from './dto/request-group.dto';
import { GetGroupInfoDto } from './dto/response-group.dto';
import { SuccessResponse } from '../../common/interfaces/response';
import { Request } from 'express';
import { SearchDto } from 'src/dto/pagination-dto';
export declare class GroupController {
    private readonly groupService;
    constructor(groupService: GroupService);
    protected createGroup(req: Request, createGroupDto: CreateGroupDto): Promise<any>;
    protected getAllGroups(req: Request, paginationDto: FilterPaginationGroupDto): Promise<SuccessResponse<any>>;
    protected getGroupInfo(id: string): Promise<SuccessResponse<GetGroupInfoDto>>;
    protected deleteGroup(id: string): Promise<import("../../entities/Silver/silverGroup.entity").SilverGroup>;
    protected UpdateGroup(id: string, updateGroupIdDto: UpdateGroupDto): Promise<SuccessResponse<any>>;
    protected getGroupDropDown(req: Request, searchDto: SearchDto): Promise<SuccessResponse<any>>;
    protected updateGroupStatus(id: string, updateGroupStatusDto: UpdateStatusGroupDto): Promise<SuccessResponse<any>>;
}
