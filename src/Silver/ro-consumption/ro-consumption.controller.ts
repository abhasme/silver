import { Controller, Get, Put, Post, Body, Patch, Param, Delete, HttpCode, UsePipes, ValidationPipe, Req, UseInterceptors, InternalServerErrorException } from '@nestjs/common';
import { ApiBadRequestResponse, ApiForbiddenResponse, ApiInternalServerErrorResponse, ApiOperation, ApiResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { TransformInterceptor } from 'src/common/dispatchers/transform.interceptor';
import { RoConsumptionService } from '../../services/Silver/ro-consumption.service';
import { SuccessResponse } from '../../common/interfaces/response';
import { AddRoConsumptionDto, CreateRoConsumptionDto, ImportRoConsumptionDto, UpdateRoConsumptionDto, updateStatusRoConsumptionDto } from './dto/request-roConsumption.dto';
import { GetRoConsumptionInfoDto } from './dto/response-roConsumption.dto';
import { Request, Response, NextFunction } from 'express';
import { FilterPaginationChannelPartnerDto } from 'src/dto/channelPartner-dto';
import { FilterPaginationRoConsumptionDto } from 'src/dto/ro-consumption.dto';

@Controller('ro-consumption')
@ApiInternalServerErrorResponse({ description: 'Internal server error' })
@UseInterceptors(TransformInterceptor)
export class RoConsumptionController {
    constructor(private readonly roConsumptionService: RoConsumptionService) { }

    @ApiOperation({ summary: 'Add ro consumption' })
    @ApiBadRequestResponse({ description: 'consumption quantity more then hand on stock' })
    @ApiResponse({ status: 200, description: 'Success', type: CreateRoConsumptionDto })
    @ApiInternalServerErrorResponse({ description: 'Internal server error' })
    @Post()
    @HttpCode(200)
    @UsePipes(ValidationPipe)
    protected async createChannelPartner(@Req() req: Request, @Body() createConsumptionDto: CreateRoConsumptionDto): Promise<any> {
        return this.roConsumptionService.createConsumption(createConsumptionDto, req);
    };


    @ApiOperation({ summary: 'Get all consumption' })
    @ApiResponse({ status: 200 })
    @Post("all")
    protected async getAllConsumption(@Req() req: Request, @Body() paginationDto: FilterPaginationRoConsumptionDto): Promise<SuccessResponse<any>> {
        const data = await this.roConsumptionService.getAllConsumption(paginationDto,req);
        return { data };
    };

  @ApiOperation({ summary: 'Get paticular consumption details' })
  @ApiUnauthorizedResponse({ description: 'Login required' })
  @ApiBadRequestResponse({ description: 'Invalid consumption id' })
  @ApiResponse({ status: 200, description: 'Success', type: GetRoConsumptionInfoDto })
  @Get('/:id')
  protected async getConsumptionInfo(@Param('id') id: string) : Promise<SuccessResponse<any>> {
    const data = await this.roConsumptionService.getConsumptionInfo(id);
    return { data };
  };

  @ApiOperation({ summary: 'Update consumption' })
  @ApiResponse({ status: 200, description: 'Success', type: UpdateRoConsumptionDto})
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @Put('update')
  @HttpCode(200)
  protected async UpdateConsumption(@Req() req: Request, @Body() updateConsumptionDto: UpdateRoConsumptionDto) : Promise<SuccessResponse<any>> {
    const data = await this.roConsumptionService.UpdateConsumption(updateConsumptionDto,req);
    return { data };
  };

  @ApiOperation({ summary: 'Import Cunsumptions' })
  @ApiUnauthorizedResponse({ description: 'Login required' })
  @ApiBadRequestResponse({ description: '' })
  @ApiResponse({ status: 200, description: 'Success', type: GetRoConsumptionInfoDto })
  @Post('import')
  async importConsumption(@Req() req: Request, @Body() createConsumptionDto: ImportRoConsumptionDto[]): Promise<SuccessResponse<any>> {
    try {
      const data = await this.roConsumptionService.importConsumption(req,createConsumptionDto);
      return { data };
    } catch (err) {
      console.log(err)
      throw new InternalServerErrorException(err)
    }
  };

  @ApiOperation({ summary: 'Update status' })
  @ApiUnauthorizedResponse({ description: 'Login required' })
  @ApiBadRequestResponse({ description: 'Invalid consumption id' })
  @ApiResponse({ status: 200, description: 'Success', type: GetRoConsumptionInfoDto })
  @Patch('/status/:id')
  protected async updateConsumptionStatus(@Param('id') id: string, @Body() updateConsumptionStatusDto: updateStatusRoConsumptionDto) : Promise<SuccessResponse<any>> {
    const data = await this.roConsumptionService.updateConsumptionStatus(id,updateConsumptionStatusDto);
    return { data };
  };


  @ApiOperation({ summary: 'Get cp  drop down' })
  @ApiResponse({ status: 200, description: 'Success', type: GetRoConsumptionInfoDto })
  @Post("/dropdown")
  protected async getConsumptionDropDown(@Req() req: Request): Promise<SuccessResponse<any>> {
    const data = await this.roConsumptionService.getConsumptionDropDown(req);
    return { data };
  };

  @ApiOperation({ summary: 'Get ro  drop down' })
  @ApiResponse({ status: 200, description: 'Success', type: GetRoConsumptionInfoDto })
  @Post("/inventory-dropdown")
  protected async getRoInventoryList(@Req() req: Request, @Body() addRoConsumptionDto: AddRoConsumptionDto): Promise<SuccessResponse<any>> {
    const data = await this.roConsumptionService.getRoInventoryList(req,addRoConsumptionDto);
    return { data };
  };


}
