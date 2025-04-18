import { Controller, Get, Put, Post, Body,UsePipes, ValidationPipe , Patch, Param, Delete, HttpCode, Req, UseInterceptors, BadRequestException } from '@nestjs/common';
import { ApiBadRequestResponse, ApiForbiddenResponse, ApiInternalServerErrorResponse, ApiOperation, ApiResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { RoInventoryService } from '../../services/Silver/ro-inventory.service';
import { AddRoIdInfo, ChangeTogDto,CreateRoInventoryDto, FilterPaginationRoInventoryDto, GetDashBoardRoInventoryInfo, ImportRoInventoryAndUpdateStockDto, ImportRoInventoryDto, UpdateRoInventoryDto, UpdateStatusRoInventoryDto, UpdateTogToggleDto, ViewotherRoInventoryDto } from './dto/request-roInventroy.dto';
import { GetAllRoInventoryDto, GetRoInventoryInfoDto } from './dto/response-roInventory.dto';
import { SuccessResponse } from '../../common/interfaces/response';
import { Request } from 'express';
import { TransformInterceptor } from 'src/common/dispatchers/transform.interceptor';
import { Types } from 'mongoose';
import { SearchDto } from 'src/dto/pagination-dto';
@Controller('ro-inventory')
@ApiInternalServerErrorResponse({ description: 'Internal server error' })
@UseInterceptors(TransformInterceptor)
export class RoInventoryController {
  constructor(private readonly roInventoryService: RoInventoryService) { }

  @ApiOperation({ summary: 'Add inventory' })
  @ApiResponse({ status: 200, description: 'Success', type: GetAllRoInventoryDto })
  @ApiForbiddenResponse({ description: 'Inventory already exist' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @Post()
  @HttpCode(200)
  protected async createInventory(@Req() req: Request, @Body() createInventoryDto: CreateRoInventoryDto,
  ): Promise<any> {
    return this.roInventoryService.createInventory(createInventoryDto, req);
  };


  @ApiOperation({ summary: 'Get all inventory' })
  @ApiResponse({ status: 200, type: GetRoInventoryInfoDto })
  @Post('/all')
  @UsePipes(new ValidationPipe())
  protected async getAllInventory(@Req() req: Request, @Body() paginationDto: FilterPaginationRoInventoryDto): Promise<SuccessResponse<any>> {
    const data = await this.roInventoryService.getAllInventory(paginationDto,req);
    return { data };
  }

  @ApiOperation({ summary: 'Get paticular inventory details' })
  @ApiUnauthorizedResponse({ description: 'Login required' })
  @ApiBadRequestResponse({ description: 'Invalid inventory id' })
  @ApiResponse({ status: 200, description: 'Success', type: GetRoInventoryInfoDto })
  @Get('/:id')
  protected async getInventoryInfo(@Param('id') id: string): Promise<SuccessResponse<GetRoInventoryInfoDto>> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid industry ID');
    }
    const data = await this.roInventoryService.getInventoryInfo(id);
    return { data };
  };

  @ApiOperation({ summary: 'Update status' })
  @ApiUnauthorizedResponse({ description: 'Login required' })
  @ApiBadRequestResponse({ description: 'Invalid inventory id' })
  @ApiResponse({ status: 200, description: 'Success', type: GetRoInventoryInfoDto })
  @Patch('/status/:id')
  protected async updateInventoryStatus(@Param('id') id: string, @Body() updateStatusInventoryDto: UpdateStatusRoInventoryDto): Promise<SuccessResponse<any>> {
    const data = await this.roInventoryService.updateInventoryStatus(id, updateStatusInventoryDto);
    return { data };
  };

  @ApiOperation({ summary: 'Update status' })
  @ApiUnauthorizedResponse({ description: 'Login required' })
  @ApiBadRequestResponse({ description: 'Invalid inventory id' })
  @ApiResponse({ status: 200, description: 'Success', type: GetRoInventoryInfoDto })
  @Patch('/change-tog/:id')
  protected async changeTog(@Param('id') id: string, @Body() changeTogDto: ChangeTogDto): Promise<SuccessResponse<any>> {
    const data = await this.roInventoryService.changeTog(id, changeTogDto);
    return { data };
  };


  @ApiOperation({ summary: 'Update inventory' })
  @ApiResponse({ status: 200, description: 'Success', type: UpdateRoInventoryDto })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @Put('/:id')
  @HttpCode(200)
  protected async UpdateInventory(@Param('id') id: string, @Body() updateInventoryDto: UpdateRoInventoryDto, @Req() req: Request): Promise<SuccessResponse<any>> {
    const data = await this.roInventoryService.UpdateInventory(id, updateInventoryDto, req);
    return { data };
  };

@ApiOperation({ summary: 'Get dahboard inventory details' })
@ApiUnauthorizedResponse({ description: 'Login required' })
@ApiBadRequestResponse({ description: 'Invalid inventory id' })
@ApiResponse({ status: 200, description: 'Success', type: GetRoInventoryInfoDto })
@Post("dashboard")
protected async getDashBoardInventoryInfo(@Body() getDashBoardInventoryInfo:GetDashBoardRoInventoryInfo,@Req() req: Request): Promise<any> {
  const data = await this.roInventoryService.getDashBoardInventoryInfo(getDashBoardInventoryInfo,req);
  return { data };
};


@ApiOperation({ summary: 'Get products drop down' })
@ApiResponse({ status: 200, description: 'Success', type: GetRoInventoryInfoDto })
@Post("/dropdown")
protected async getInventoryDropDown(@Req() req: Request,@Body() addRoIdInfo:AddRoIdInfo): Promise<SuccessResponse<any>> {
  const data = await this.roInventoryService.getInventoryDropDown(req,addRoIdInfo);
  return { data };
};

@ApiOperation({ summary: 'Add Multiple inventory' })
@ApiResponse({ status: 200, description: 'Success', type: GetRoInventoryInfoDto })
@ApiBadRequestResponse({ description: 'Invalid id or password' })
@ApiForbiddenResponse({ description: 'Your email is not verified! Please verify your email address.' })
@ApiInternalServerErrorResponse({ description: 'Internal server error' })
@Post('import')
@HttpCode(200)
protected async importInventory( @Body() createInventoryDto: ImportRoInventoryDto[],@Req() req: Request,): Promise<any> {
  const data = await this.roInventoryService.importInventory(createInventoryDto,req);
  return { data };
};

@ApiOperation({ summary: 'Update stock of inventory' })
@ApiResponse({ status: 200, description: 'Success', type: GetRoInventoryInfoDto })
@ApiBadRequestResponse({ description: 'Invalid id or password' })
@ApiForbiddenResponse({ description: 'Your email is not verified! Please verify your email address.' })
@ApiInternalServerErrorResponse({ description: 'Internal server error' })
@Post('update-stock')
@HttpCode(200)
protected async importInventoryAndUpdateStock( @Body() createInventoryDto: ImportRoInventoryAndUpdateStockDto[],@Req() req: Request,): Promise<any> {
  const data = await this.roInventoryService.importInventoryAndUpdateStock(createInventoryDto,req);
  return { data };
};


@ApiOperation({ summary: 'Add Multiple inventory' })
@ApiResponse({ status: 200, description: 'Success', type: GetRoInventoryInfoDto })
@ApiBadRequestResponse({ description: 'Invalid id or password' })
@ApiForbiddenResponse({ description: 'Your email is not verified! Please verify your email address.' })
@ApiInternalServerErrorResponse({ description: 'Internal server error' })
@Post('view')
@HttpCode(200)
protected async getInventoryMoreInfo( @Body() viewotherInventoryDto: ViewotherRoInventoryDto): Promise<any> {
  const data = await this.roInventoryService.getInventoryMoreInfo(viewotherInventoryDto);
  return { data };
};

@ApiOperation({ summary: 'Get products drop down' })
@ApiResponse({ status: 200, description: 'Success', type: GetRoInventoryInfoDto })
@Post("/product/dropdown")
protected async getProductDropDown(@Req() req: Request,@Body()searchDto: SearchDto): Promise<SuccessResponse<any>> {
  const data = await this.roInventoryService.getProductDropDown(searchDto,req);
  return { data };
};

@ApiOperation({ summary: 'Update Tog toggle' })
@ApiResponse({ status: 200, description: 'Success', type: UpdateTogToggleDto })
@ApiInternalServerErrorResponse({ description: 'Internal server error' })
@Put('/:id/tog-toggle')
@HttpCode(200)
protected async UpdateTogToggle(@Param('id') id: string, @Body() updateTogToggleDto: UpdateTogToggleDto, @Req() req: Request): Promise<SuccessResponse<any>> {
  const data = await this.roInventoryService.UpdateTogToggle(id, updateTogToggleDto, req);
  return { data };
};

@ApiOperation({ summary: 'Update Tog Recommendation ' })
@ApiResponse({ status: 200, description: 'Success', type: UpdateTogToggleDto })
@ApiInternalServerErrorResponse({ description: 'Internal server error' })
@Put('/tog-recommendation')
@HttpCode(200)
protected async UpdateTogRecommendation(): Promise<SuccessResponse<any>> {
  const data = await this.roInventoryService.UpdateTogRecommendation();
  return { data };
};
}



