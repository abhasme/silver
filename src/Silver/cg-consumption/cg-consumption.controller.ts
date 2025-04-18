import { Controller, Get, Put, Post, Body, Patch, Param, Delete, HttpCode, UsePipes, ValidationPipe, Req, UseInterceptors, InternalServerErrorException } from '@nestjs/common';
import { ApiBadRequestResponse, ApiForbiddenResponse, ApiInternalServerErrorResponse, ApiOperation, ApiResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { TransformInterceptor } from 'src/common/dispatchers/transform.interceptor';
import { CgConsumptionService } from '../../services/Silver/cg-consumption.service';
import { SuccessResponse } from '../../common/interfaces/response';
import { CreateCgConsumptionDto, ImportCgConsumptionDto, UpdateCgConsumptionDto, updateStatusCgConsumptionDto } from './dto/request-cgConsumption.dto';
import { GetCgConsumptionInfoDto } from './dto/response-cgConsumption.dto';
import { Request, Response, NextFunction } from 'express';
import { FilterPaginationCgConsumptionDto } from 'src/dto/cg-consumption.dto';

@Controller('cg-consumption')
@ApiInternalServerErrorResponse({ description: 'Internal server error' })
@UseInterceptors(TransformInterceptor)
export class CgConsumptionController {
    constructor(private readonly cgConsumptionService: CgConsumptionService) { }

/** Update Consumption*/
    @ApiOperation({ summary: 'Add consumption' })
    @ApiBadRequestResponse({ description: 'consumption quantity more then hand on stock' })
    @ApiResponse({ status: 200, description: 'Success', type: CreateCgConsumptionDto })
    @ApiInternalServerErrorResponse({ description: 'Internal server error' })
    @Post()
    @HttpCode(200)
    @UsePipes(ValidationPipe)
    protected async createChannelPartner(@Req() req: Request, @Body() createConsumptionDto: CreateCgConsumptionDto): Promise<any> {
        return this.cgConsumptionService.createConsumption(createConsumptionDto, req);
    };

/** list all Consumption*/
    @ApiOperation({ summary: 'Get all consumption' })
    @ApiResponse({ status: 200 })
    @Post("all")
    protected async getAllConsumption(@Req() req: Request, @Body() paginationDto: FilterPaginationCgConsumptionDto): Promise<SuccessResponse<any>> {
        const data = await this.cgConsumptionService.getAllConsumption(paginationDto,req);
        return { data };
    };
/** list all Consumption*/
  @ApiOperation({ summary: 'Get paticular consumption details' })
  @ApiUnauthorizedResponse({ description: 'Login required' })
  @ApiBadRequestResponse({ description: 'Invalid consumption id' })
  @ApiResponse({ status: 200, description: 'Success', type: GetCgConsumptionInfoDto })
  @Get('/:id')
  protected async getConsumptionInfo(@Param('id') id: string) : Promise<SuccessResponse<any>> {
    const data = await this.cgConsumptionService.getConsumptionInfo(id);
    return { data };
  };

  @ApiOperation({ summary: 'Update consumption' })
  @ApiResponse({ status: 200, description: 'Success', type: UpdateCgConsumptionDto})
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @Put('update')
  @HttpCode(200)
  protected async UpdateConsumption(@Req() req: Request, @Body() updateCgConsumptionDto: UpdateCgConsumptionDto) : Promise<SuccessResponse<any>> {
    const data = await this.cgConsumptionService.UpdateConsumption(updateCgConsumptionDto,req);
    return { data };
  };

  @ApiOperation({ summary: 'Import Cunsumptions' })
  @ApiUnauthorizedResponse({ description: 'Login required' })
  @ApiBadRequestResponse({ description: '' })
  @ApiResponse({ status: 200, description: 'Success', type: GetCgConsumptionInfoDto })
  @Post('import')
  async importConsumption(@Req() req: Request, @Body() importCgConsumptionDto: ImportCgConsumptionDto[]): Promise<SuccessResponse<any>> {
    try {
      const data = await this.cgConsumptionService.importConsumption(req,importCgConsumptionDto);
      return { data };
    } catch (err) {
      console.log(err)
      throw new InternalServerErrorException(err)
    }
  };

  @ApiOperation({ summary: 'Update status' })
  @ApiUnauthorizedResponse({ description: 'Login required' })
  @ApiBadRequestResponse({ description: 'Invalid consumption id' })
  @ApiResponse({ status: 200, description: 'Success', type: GetCgConsumptionInfoDto })
  @Patch('/status/:id')
  protected async updateConsumptionStatus(@Param('id') id: string, @Body() updateConsumptionStatusDto: updateStatusCgConsumptionDto) : Promise<SuccessResponse<any>> {
    const data = await this.cgConsumptionService.updateConsumptionStatus(id,updateConsumptionStatusDto);
    return { data };
  };


  @ApiOperation({ summary: 'Get cg  drop down' })
  @ApiResponse({ status: 200, description: 'Success', type: GetCgConsumptionInfoDto })
  @Post("/dropdown")
  protected async getConsumptionDropDown(@Req() req: Request): Promise<SuccessResponse<any>> {
    const data = await this.cgConsumptionService.getConsumptionDropDown(req);
    return { data };
  };


  @ApiOperation({ summary: 'Get cg  drop down' })
  @ApiResponse({ status: 200, description: 'Success', type: GetCgConsumptionInfoDto })
  @Post("/inventory-dropdown")
  protected async getCgInventoryList(@Req() req: Request): Promise<SuccessResponse<any>> {
    const data = await this.cgConsumptionService.getCgInventoryList(req);
    return { data };
  };

}
