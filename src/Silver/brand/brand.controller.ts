import { Controller, Get, Put, Post, Body, Patch, Param, Delete, HttpCode, UsePipes, ValidationPipe, Req, UseInterceptors, UploadedFiles, BadRequestException } from '@nestjs/common';
import { ApiBadRequestResponse, ApiForbiddenResponse, ApiInternalServerErrorResponse, ApiOperation, ApiResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { BrandService } from '../../services/Silver/brand.service';
import { CreateBrandDto, UpdateStatusBrandDto, FilterPaginationBrandDto, UpdateBrandDto } from './dto/request-brand.dto';
import { GetBrandInfoDto } from './dto/response-brand.dto';
import { SuccessResponse } from '../../common/interfaces/response';
import { Request } from 'express';
import { TransformInterceptor } from 'src/common/dispatchers/transform.interceptor';
import { Types } from 'mongoose';
import { SearchDto } from 'src/dto/pagination-dto';
@Controller('silver-brand')
@ApiInternalServerErrorResponse({ description: 'Internal server error' })
@UseInterceptors(TransformInterceptor)
export class BrandController {
  constructor(private readonly brandService: BrandService) { }

/** Add Brand */
  @ApiOperation({ summary: 'Add brand' })
  @ApiResponse({ status: 200, description: 'Success', type: GetBrandInfoDto })
  @ApiForbiddenResponse({ description: 'Brand already exist' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @Post()
  @HttpCode(200)
  protected async createBrand(@Req() req: Request, @Body() createBrandDto: CreateBrandDto,): Promise<any> {
    return this.brandService.createBrand(createBrandDto, req);
  };

/** List Brand */
  @ApiOperation({ summary: 'Get all brand' })
  @ApiResponse({ status: 200, type: GetBrandInfoDto })
  @Post('/all')
  protected async getAllBrand(@Req() req: Request, @Body() paginationDto: FilterPaginationBrandDto): Promise<SuccessResponse<any>> {
    const data = await this.brandService.getAllBrand(paginationDto,req);
    return { data };
  };

/** view Brand */
  @ApiOperation({ summary: 'Get paticular brand details' })
  @ApiUnauthorizedResponse({ description: 'Login required' })
  @ApiBadRequestResponse({ description: 'Invalid brand id' })
  @ApiResponse({ status: 200, description: 'Success', type: GetBrandInfoDto })
  @Get('/:id')
  protected async getBrandInfo(@Param('id') id: string): Promise<SuccessResponse<GetBrandInfoDto>> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid unit ID');
    }
    const data = await this.brandService.getBrandInfo(id);
    return { data };
  };

/** delete Brand */
  @Delete('/:id')
  protected async deleteBrand(@Param('id') id: string) {
    return await this.brandService.deleteBrand(id);
  };

/** update Brand */
  @ApiOperation({ summary: 'Update brand' })
  @ApiResponse({ status: 200, description: 'Success', type: UpdateBrandDto })
  @ApiForbiddenResponse({ description: 'Brand already exist' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @Put('/:id')
  @HttpCode(200)
  protected async UpdateBrand(@Param('id') id: string, @Body() updateBrandIdDto: UpdateBrandDto): Promise<SuccessResponse<any>> {
    const data = await this.brandService.UpdateBrand(id, updateBrandIdDto);
    return { data };
  };

/** Drop-down Brand */
  @ApiOperation({ summary: 'Get unit DropDown' })
  @ApiResponse({ status: 200, description: 'unit is available', type: GetBrandInfoDto })
  @Get('/dropdown/list')
  protected async getBrandDropDown(@Req() req: Request,@Body() searchDto: SearchDto,): Promise<SuccessResponse<any>> {
    const data = await this.brandService.getBrandDropDown(searchDto,req);
    return { data };
  };

/** Update Brand status*/
  @ApiOperation({ summary: 'Update status' })
  @ApiUnauthorizedResponse({ description: 'Login required' })
  @ApiBadRequestResponse({ description: 'Invalid unit id' })
  @ApiResponse({ status: 200, description: 'Success', type: GetBrandInfoDto })
  @Patch('/status/:id')
  protected async updateBrandStatus(@Param('id') id: string, @Body() updateBrandStatusDto: UpdateStatusBrandDto) : Promise<SuccessResponse<any>> {
    const data = await this.brandService.updateBrandStatus(id,updateBrandStatusDto);
    return { data };
  };

}
