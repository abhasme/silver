import { Controller, Get, Put, Post, Body, Patch, Param, Delete, HttpCode, UsePipes, ValidationPipe , Req, UseInterceptors} from '@nestjs/common';
import { ApiBadRequestResponse, ApiForbiddenResponse, ApiInternalServerErrorResponse, ApiOperation, ApiResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { TransformInterceptor } from 'src/common/dispatchers/transform.interceptor';
import { RoMasterService } from '../../services/Silver/ro-master.service';
import { SuccessResponse } from '../../common/interfaces/response';
import { CreateRoMasterDto,ImportRoMasterDto, UpdateRoMasterDto, UpdateStatusRoMasterDto} from './dto/request-roMaster.dto';
import { GetRoMasterInfoDto } from './dto/response-roMaster.dto';
import { Request, Response, NextFunction } from 'express';
import { FilterPaginationRoMasterDto } from 'src/dto/roMaster.dto';

@Controller('ro-master')
@ApiInternalServerErrorResponse({ description: 'Internal server error' })
@UseInterceptors(TransformInterceptor)
export class RoMasterController {
  constructor(private readonly roMasterService: RoMasterService) {}
  @ApiOperation({ summary: 'Get all Ro master' })
  @ApiResponse({ status: 200})
  @Post("all")
  protected async getAllRoMaster(@Req() req: Request, @Body() paginationDto : FilterPaginationRoMasterDto): Promise<SuccessResponse<any>> {
    const data = await this.roMasterService.getAllRoMaster(paginationDto);
    return { data };
  }

  @ApiOperation({ summary: 'Add Ro master' })
  @ApiResponse({ status: 200, description: 'Success', type: GetRoMasterInfoDto })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @Post()
  @HttpCode(200)
  @UsePipes(ValidationPipe)
  protected async createRo(@Req() req: Request, @Body() createRoMasterDto: CreateRoMasterDto): Promise<any> {
    return this.roMasterService.createRo(createRoMasterDto,req);
  }

  @ApiOperation({ summary: 'Get paticular Ro master details' })
  @ApiUnauthorizedResponse({ description: 'Login required' })
  @ApiBadRequestResponse({ description: 'Invalid Ro master id' })
  @ApiResponse({ status: 200, description: 'Success', type: GetRoMasterInfoDto })
  @Get('/:id')
  protected async getRoMasterInfo(@Param('id') id: string) : Promise<SuccessResponse<any>> {
    const data = await this.roMasterService.getRoMasterInfo(id);
    return { data };
  };


  @ApiOperation({ summary: 'Update Ro master' })
  @ApiResponse({ status: 200, description: 'Success', type: UpdateRoMasterDto })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @Put('/:id')
  @HttpCode(200)
  protected async UpdateRoMaster(@Param('id') id: string, @Body() RoMasterIdDto: UpdateRoMasterDto) : Promise<SuccessResponse<any>> {
    const data = await this.roMasterService.UpdateRoMaster(id,RoMasterIdDto);
    return { data };
  }

  @Delete('/:id')
  protected async deleteRoMaster(@Param('id') id: string) {
    return await this.roMasterService.deleteRoMaster(id);
  }

  @ApiOperation({ summary: 'Add Multiple CP' })
  @ApiResponse({ status: 200, description: 'Success', type: ImportRoMasterDto })
  @ApiBadRequestResponse({ description: 'Invalid id or password' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @Post('import')
  @HttpCode(200)
  protected async importRoMaster(@Req() req: Request, @Body() importRoMasterDto: ImportRoMasterDto[]): Promise<any> {
    const data = await this.roMasterService.importRoMaster(importRoMasterDto);
    return { data };
  }

  @ApiOperation({ summary: 'Get cp  drop down' })
  @ApiResponse({ status: 200, description: 'Success', type: GetRoMasterInfoDto })
  @Post("/dropdown")
  protected async getRoMasterDropDown(@Req() req: Request): Promise<SuccessResponse<any>> {
    const data = await this.roMasterService.getRoMasterDropDown();
    return { data };
  };

  @ApiOperation({ summary: 'Get cp  drop down' })
  @ApiResponse({ status: 200, description: 'Success', type: GetRoMasterInfoDto })
  @Post("/dropdown/compantName")
  protected async getCompanyNameDropDown(): Promise<SuccessResponse<any>> {
    const data = await this.roMasterService.getCompanyNameDropDown();
    return { data };
  };

  @ApiOperation({ summary: 'Update status' })
  @ApiUnauthorizedResponse({ description: 'Login required' })
  @ApiBadRequestResponse({ description: 'Invalid Ro master id' })
  @ApiResponse({ status: 200, description: 'Success', type: GetRoMasterInfoDto })
  @Patch('/status/:id')
  protected async updateRoMasterStatus(@Param('id') id: string, @Body() updateStatusRoMasterDto: UpdateStatusRoMasterDto) : Promise<SuccessResponse<any>> {
    const data = await this.roMasterService.updateRoMasterStatus(id,updateStatusRoMasterDto);
    return { data };
  };

  
}


