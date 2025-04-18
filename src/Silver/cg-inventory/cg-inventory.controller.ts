import { Controller, Get, Put, Post, Body,UsePipes, ValidationPipe , Patch, Param, Delete, HttpCode, Req, UseInterceptors, BadRequestException } from '@nestjs/common';
import { ApiBadRequestResponse, ApiForbiddenResponse, ApiInternalServerErrorResponse, ApiOperation, ApiResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { CgInventoryService} from '../../services/Silver/cg-inventory.service';
import { ChangeTogDto,CreateCgInventoryDto, FilterPaginationCgInventoryDto, GetDashBoardCgInventoryInfo, ImportCgInventoryDto, UpdateCgInventoryDto, UpdateStatusCgInventoryDto, UpdateTogToggleDto, ViewOtherCgInventoryDto } from './dto/request-cgInventroy.dto';
import { GetAllCgInventoryDto, GetCgInventoryInfoDto } from './dto/response-cgInventory.dto';
import { SuccessResponse } from '../../common/interfaces/response';
import { Request } from 'express';
import { TransformInterceptor } from 'src/common/dispatchers/transform.interceptor';
import { Types } from 'mongoose';
import { SearchDto } from 'src/dto/pagination-dto';
@Controller('cg-inventory')
@ApiInternalServerErrorResponse({ description: 'Internal server error' })
@UseInterceptors(TransformInterceptor)
export class CgInventoryController {
  constructor(private readonly cgInventoryService: CgInventoryService) { }

  @ApiOperation({ summary: 'Add inventory' })
  @ApiResponse({ status: 200, description: 'Success', type: GetAllCgInventoryDto })
  @ApiForbiddenResponse({ description: 'Inventory already exist' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @Post()
  @HttpCode(200)
  protected async createInventory(@Req() req: Request, @Body() createInventoryDto: CreateCgInventoryDto,
  ): Promise<any> {
    return this.cgInventoryService.createInventory(createInventoryDto,req);
  };


  @ApiOperation({ summary: 'Get all inventory' })
  @ApiResponse({ status: 200, type: GetCgInventoryInfoDto })
  @Post('/all')
  @UsePipes(new ValidationPipe())
  // @UsePipes(ValidationPipe)
  protected async getAllInventory(@Req() req: Request, @Body() paginationDto: FilterPaginationCgInventoryDto): Promise<SuccessResponse<any>> {
    const data = await this.cgInventoryService.getAllInventory(paginationDto,req);
    return { data };
  }

  @ApiOperation({ summary: 'Get paticular inventory details' })
  @ApiUnauthorizedResponse({ description: 'Login required' })
  @ApiBadRequestResponse({ description: 'Invalid inventory id' })
  @ApiResponse({ status: 200, description: 'Success', type: GetCgInventoryInfoDto })
  @Get('/:id')
  protected async getInventoryInfo(@Param('id') id: string): Promise<SuccessResponse<GetCgInventoryInfoDto>> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid industry ID');
    }
    const data = await this.cgInventoryService.getInventoryInfo(id);
    return { data };
  };

  @ApiOperation({ summary: 'Update status' })
  @ApiUnauthorizedResponse({ description: 'Login required' })
  @ApiBadRequestResponse({ description: 'Invalid inventory id' })
  @ApiResponse({ status: 200, description: 'Success', type: GetCgInventoryInfoDto })
  @Patch('/status/:id')
  protected async updateInventoryStatus(@Param('id') id: string, @Body() updateStatusInventoryDto: UpdateStatusCgInventoryDto): Promise<SuccessResponse<any>> {
    const data = await this.cgInventoryService.updateInventoryStatus(id, updateStatusInventoryDto);
    return { data };
  };

  @ApiOperation({ summary: 'Update inventory' })
  @ApiResponse({ status: 200, description: 'Success', type: UpdateCgInventoryDto })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @Put('/:id')
  @HttpCode(200)
  protected async UpdateInventory(@Param('id') id: string, @Body() updateCgInventoryDto: UpdateCgInventoryDto, @Req() req: Request): Promise<SuccessResponse<any>> {
    const data = await this.cgInventoryService.UpdateInventory(id, updateCgInventoryDto,req);
    return { data };
  };

@ApiOperation({ summary: 'Get dahboard inventory details' })
@ApiUnauthorizedResponse({ description: 'Login required' })
@ApiBadRequestResponse({ description: 'Invalid inventory id' })
@ApiResponse({ status: 200, description: 'Success', type: GetCgInventoryInfoDto })
@Post("dashboard")
protected async getDashBoardInventoryInfo(@Body() getDashBoardCgInventoryInfo:GetDashBoardCgInventoryInfo,@Req() req: Request): Promise<any> {
  const data = await this.cgInventoryService.getDashBoardInventoryInfo(getDashBoardCgInventoryInfo,req);
  return { data };
};


@ApiOperation({ summary: 'Get products drop down' })
@ApiResponse({ status: 200, description: 'Success', type: GetCgInventoryInfoDto })
@Post("/dropdown")
protected async getInventoryDropDown(@Req() req: Request,): Promise<SuccessResponse<any>> {
  const data = await this.cgInventoryService.getInventoryDropDown(req);
  return { data };
};

@ApiOperation({ summary: 'Add Multiple inventory' })
@ApiResponse({ status: 200, description: 'Success', type: GetCgInventoryInfoDto })
@ApiBadRequestResponse({ description: 'Invalid id or password' })
@ApiForbiddenResponse({ description: 'Your email is not verified! Please verify your email address.' })
@ApiInternalServerErrorResponse({ description: 'Internal server error' })
@Post('import')
@HttpCode(200)
protected async importInventory(@Body() createInventoryDto: ImportCgInventoryDto[],@Req() req: Request,): Promise<any> {
  const data = await this.cgInventoryService.importInventory(createInventoryDto,req);
  return { data };
};


@ApiOperation({ summary: 'Add Multiple inventory' })
@ApiResponse({ status: 200, description: 'Success', type: GetCgInventoryInfoDto })
@ApiBadRequestResponse({ description: 'Invalid id or password' })
@ApiForbiddenResponse({ description: 'Your email is not verified! Please verify your email address.' })
@ApiInternalServerErrorResponse({ description: 'Internal server error' })
@Post('view')
@HttpCode(200)
protected async getInventoryMoreInfo(@Body() viewotherCgInventoryDto: ViewOtherCgInventoryDto): Promise<any> {
  const data = await this.cgInventoryService.getInventoryMoreInfo(viewotherCgInventoryDto);
  return { data };
};

@ApiOperation({ summary: 'Get products drop down' })
@ApiResponse({ status: 200, description: 'Success', type: GetCgInventoryInfoDto })
@Get("/product/dropdown")
protected async getProductDropDown(@Req() req: Request,@Body()searchDto: SearchDto): Promise<SuccessResponse<any>> {
  const data = await this.cgInventoryService.getProductDropDown(searchDto,req);
  return { data };
};

@ApiOperation({ summary: 'Update Tog toggle' })
@ApiResponse({ status: 200, description: 'Success', type: UpdateTogToggleDto })
@ApiInternalServerErrorResponse({ description: 'Internal server error' })
@Put('/:id/tog-toggle')
@HttpCode(200)
protected async UpdateTogToggle(@Param('id') id: string, @Body() updateTogToggleDto: UpdateTogToggleDto, @Req() req: Request): Promise<SuccessResponse<any>> {
  const data = await this.cgInventoryService.UpdateTogToggle(id, updateTogToggleDto,req);
  return { data };
};

@ApiOperation({ summary: 'Update status' })
@ApiUnauthorizedResponse({ description: 'Login required' })
@ApiBadRequestResponse({ description: 'Invalid inventory id' })
@ApiResponse({ status: 200, description: 'Success', type: GetCgInventoryInfoDto })
@Patch('/change-tog/:id')
protected async changeTog(@Param('id') id: string, @Body() changeTogDto: ChangeTogDto): Promise<SuccessResponse<any>> {
  const data = await this.cgInventoryService.changeTog(id, changeTogDto)
  return { data };
};
}



