import { Controller, Get, Put, Post, Body, Patch, Param, Delete, HttpCode, UsePipes, ValidationPipe, Req, UseInterceptors, UploadedFiles, BadRequestException } from '@nestjs/common';
import { ApiBadRequestResponse, ApiForbiddenResponse, ApiInternalServerErrorResponse, ApiOperation, ApiResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { GroupService } from '../../services/Silver/group.service';
import { CreateGroupDto, UpdateStatusGroupDto, FilterPaginationGroupDto, UpdateGroupDto } from './dto/request-group.dto';
import { GetGroupInfoDto } from './dto/response-group.dto';
import { SuccessResponse } from '../../common/interfaces/response';
import { Request } from 'express';
import { TransformInterceptor } from 'src/common/dispatchers/transform.interceptor';
import { Types } from 'mongoose';
import { SearchDto } from 'src/dto/pagination-dto';
@Controller('silver-group')
@ApiInternalServerErrorResponse({ description: 'Internal server error' })
@UseInterceptors(TransformInterceptor)
export class GroupController {
  constructor(private readonly groupService: GroupService) { }

  @ApiOperation({ summary: 'Add group' })
  @ApiResponse({ status: 200, description: 'Success', type: GetGroupInfoDto })
  @ApiForbiddenResponse({ description: 'Group already exist' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @Post()
  @HttpCode(200)
  protected async createGroup(@Req() req: Request, @Body() createGroupDto: CreateGroupDto,
  ): Promise<any> {
    return this.groupService.createGroup(createGroupDto, req);
  };

  @ApiOperation({ summary: 'Get all group' })
  @ApiResponse({ status: 200, type: GetGroupInfoDto })
  @Post('/all')
  protected async getAllGroups(@Req() req: Request, @Body() paginationDto: FilterPaginationGroupDto): Promise<SuccessResponse<any>> {
    const data = await this.groupService.getAllGroups(paginationDto,req);
    return { data };
  };

  @ApiOperation({ summary: 'Get paticular group details' })
  @ApiUnauthorizedResponse({ description: 'Login required' })
  @ApiBadRequestResponse({ description: 'Invalid group id' })
  @ApiResponse({ status: 200, description: 'Success', type: GetGroupInfoDto })
  @Get('/:id')
  protected async getGroupInfo(@Param('id') id: string): Promise<SuccessResponse<GetGroupInfoDto>> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid group ID');
    }
    const data = await this.groupService.getGroupInfo(id);
    return { data };
  };

  @Delete('/:id')
  protected async deleteGroup(@Param('id') id: string) {
    return await this.groupService.deleteGroup(id);
  };

  @ApiOperation({ summary: 'Update channel partner' })
  @ApiResponse({ status: 200, description: 'Success', type: UpdateGroupDto })
  @ApiForbiddenResponse({ description: 'Group already exist' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @Put('/:id')
  @HttpCode(200)
  protected async UpdateGroup(@Param('id') id: string, @Body() updateGroupIdDto: UpdateGroupDto): Promise<SuccessResponse<any>> {
    const data = await this.groupService.UpdateGroup(id, updateGroupIdDto);
    return { data };
  };

  @ApiOperation({ summary: 'Get group DropDown' })
  @ApiResponse({ status: 200, description: 'group is available', type: GetGroupInfoDto })
  @Get('/dropdown/list')
  protected async getGroupDropDown(@Req() req: Request,@Body() searchDto: SearchDto,): Promise<SuccessResponse<any>> {
    const data = await this.groupService.getGroupDropDown(searchDto,req);
    return { data };
  };

  @ApiOperation({ summary: 'Update status' })
  @ApiUnauthorizedResponse({ description: 'Login required' })
  @ApiBadRequestResponse({ description: 'Invalid group id' })
  @ApiResponse({ status: 200, description: 'Success', type: GetGroupInfoDto })
  @Patch('/status/:id')
  protected async updateGroupStatus(@Param('id') id: string, @Body() updateGroupStatusDto: UpdateStatusGroupDto) : Promise<SuccessResponse<any>> {
    const data = await this.groupService.updateGroupStatus(id,updateGroupStatusDto);
    return { data };
  };

}
