import { Controller, Get, Put, Post, Body, Patch, Param, Delete, HttpCode, Req, UseInterceptors, BadRequestException } from '@nestjs/common';
import { ApiBadRequestResponse, ApiForbiddenResponse, ApiInternalServerErrorResponse, ApiOperation, ApiResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { UnitService } from '../../services/Silver/unit.service';
import { CreateUnitDto, UpdateUnitDto, FilterPaginationUnitDto, UpdateStatusUnitDto } from './dto/request-unit.dto';
import { GetUnitInfoDto } from './dto/response-unit.dto';
import { SuccessResponse } from '../../common/interfaces/response';
import { Request } from 'express';
import { TransformInterceptor } from 'src/common/dispatchers/transform.interceptor';
import { Types } from 'mongoose';
import { SearchDto } from 'src/dto/pagination-dto';
@Controller('silver-unit')
@ApiInternalServerErrorResponse({ description: 'Internal server error' })
@UseInterceptors(TransformInterceptor)
export class UnitController {
  constructor(private readonly unitService: UnitService) { }

  @ApiOperation({ summary: 'Add unit' })
  @ApiResponse({ status: 200, description: 'Success', type: GetUnitInfoDto })
  @ApiForbiddenResponse({ description: 'Unit already exist' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @Post()
  @HttpCode(200)
  protected async createUnit(@Req() req: Request, @Body() createUnitDto: CreateUnitDto,
  ): Promise<any> {
    return this.unitService.createUnit(createUnitDto, req);
  };

  @ApiOperation({ summary: 'Get all unit' })
  @ApiResponse({ status: 200, type: GetUnitInfoDto })
  @Post('/all')
  protected async getAllUnits(@Req() req: Request, @Body() paginationDto: FilterPaginationUnitDto): Promise<SuccessResponse<any>> {
    const data = await this.unitService.getAllUnits(paginationDto,req);
    return { data };
  };

  @ApiOperation({ summary: 'Get paticular unit details' })
  @ApiUnauthorizedResponse({ description: 'Login required' })
  @ApiBadRequestResponse({ description: 'Invalid unit id' })
  @ApiResponse({ status: 200, description: 'Success', type: GetUnitInfoDto })
  @Get('/:id')
  protected async getUnitInfo(@Param('id') id: string): Promise<SuccessResponse<GetUnitInfoDto>> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid unit ID');
    }
    const data = await this.unitService.getUnitInfo(id);
    return { data };
  };

  @Delete('/:id')
  protected async deleteUnit(@Param('id') id: string) {
    return await this.unitService.deleteUnit(id);
  };

  @ApiOperation({ summary: 'Update unit' })
  @ApiResponse({ status: 200, description: 'Success', type: UpdateUnitDto })
  @ApiForbiddenResponse({ description: 'Unit already exist' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @Put('/:id')
  @HttpCode(200)
  protected async UpdateUnit(@Param('id') id: string, @Body() updateUnitIdDto: UpdateUnitDto): Promise<SuccessResponse<any>> {
    const data = await this.unitService.UpdateUnit(id, updateUnitIdDto);
    return { data };
  };

  @ApiOperation({ summary: 'Get unit DropDown' })
  @ApiResponse({ status: 200, description: 'unit is available', type: GetUnitInfoDto })
  @Get('/dropdown/list')
  protected async getUnitDropDown(@Req() req: Request,@Body() searchDto: SearchDto,): Promise<SuccessResponse<any>> {
    const data = await this.unitService.getUnitDropDown(searchDto,req);
    return { data };
  };

  @ApiOperation({ summary: 'Update status' })
  @ApiUnauthorizedResponse({ description: 'Login required' })
  @ApiBadRequestResponse({ description: 'Invalid unit id' })
  @ApiResponse({ status: 200, description: 'Success', type: GetUnitInfoDto })
  @Patch('/status/:id')
  protected async updateUnitStatus(@Param('id') id: string, @Body() updateUnitStatusDto: UpdateStatusUnitDto) : Promise<SuccessResponse<any>> {
    const data = await this.unitService.updateUnitStatus(id,updateUnitStatusDto);
    return { data };
  };


  @ApiOperation({ summary: 'Get unit DropDown' })
  @ApiResponse({ status: 200, description: 'unit is available', type: GetUnitInfoDto })
  @Post('/test-data')
  protected async test(): Promise<SuccessResponse<any>> {
    const data = await this.unitService.test();
    return { data };
  };
}
