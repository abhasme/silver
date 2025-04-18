import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, UsePipes, ValidationPipe , Req, UseInterceptors, UploadedFiles} from '@nestjs/common';
import { ApiBadRequestResponse, ApiForbiddenResponse, ApiInternalServerErrorResponse, ApiOperation, ApiResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { SilverSubcategoryService } from '../../services/Silver/sub-category.service';
import { CreateSubcategoryDto, StatusSubcategoryDto, UpdateSubcategoryDto } from './dto/request-subcategory.dto';
import { GetSubcategoryInfoDto } from './dto/response-subcategory.dto';
import { FilterPaginationUserDto } from './dto/request-subcategory.dto';
import { SuccessResponse } from '../../common/interfaces/response';
import { Request } from 'express';
import { TransformInterceptor } from 'src/common/dispatchers/transform.interceptor';

@Controller('silver-sub-category')
@ApiInternalServerErrorResponse({ description: 'Internal server error' })
@UseInterceptors(TransformInterceptor)

export class SilverSubCategoryController {
  constructor(private readonly silverSubcategoryService: SilverSubcategoryService) {}

  @ApiOperation({ summary: 'Login into the system' })
  @ApiResponse({ status: 200, description: 'Success', type: GetSubcategoryInfoDto })
  @ApiBadRequestResponse({ description: 'Invalid id or password' })
  @ApiForbiddenResponse({ description: 'Your email is not verified! Please verify your email address.' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @Post()
  @HttpCode(200)
  @UsePipes(ValidationPipe)
  protected async createSubcategory(@Req() req: Request, @Body() createSubcategoryDto: CreateSubcategoryDto, @UploadedFiles() files: { image?: Express.Multer.File[] }): Promise<any> {
    return this.silverSubcategoryService.createSubcategory(createSubcategoryDto, req);
  }
 

  @ApiOperation({ summary: 'Get all subcategory' })
  @ApiResponse({ status: 200, description: 'Mobile number is available', type: GetSubcategoryInfoDto })
  @ApiBadRequestResponse({ description: 'Invalid subcategory id' })
  @Post('/all')
  protected async getAllSubcategory(@Req() req: Request, @Body() paginationDto : FilterPaginationUserDto): Promise<SuccessResponse<any>> {
    console.log(paginationDto,"paginationDto")
    const data = await this.silverSubcategoryService.getAllSubcategory(paginationDto);
    return { data };
  }

  @ApiOperation({ summary: 'Get all subcategory by category id' })
  @ApiResponse({ status: 200, description: 'Mobile number is available', type: GetSubcategoryInfoDto })
  @ApiBadRequestResponse({ description: 'Invalid subcategory id' })
  @Post('category/:categoryId')
  protected async getSubcategoriesByCategoryId(@Req() req: Request, @Param() paginationDto : FilterPaginationUserDto): Promise<SuccessResponse<any>> {
    console.log(paginationDto,"paginationDto")
    const data = await this.silverSubcategoryService.getSubcategoriesByCategoryId(paginationDto);
    return { data };
  }

  @ApiOperation({ summary: 'Get paticular subcategory details' })
  @ApiUnauthorizedResponse({ description: 'Login required' })
  @ApiBadRequestResponse({ description: 'Invalid subcategory id' })
  @ApiResponse({ status: 200, description: 'Success', type: GetSubcategoryInfoDto })
  @Get('info/:id')
  protected async getSubcategoryInfo(@Param('id') id: string) : Promise<SuccessResponse<GetSubcategoryInfoDto>> {
    const data = await this.silverSubcategoryService.getSubcategoryInfo(id);
    return { data };
  }

  @ApiOperation({ summary: 'SubCategory Update' })
  @ApiResponse({ status: 200, description: 'Success', type: GetSubcategoryInfoDto })
  @ApiBadRequestResponse({ description: 'Invalid id or password' })
  @ApiForbiddenResponse({ description: 'Your email is not verified! Please verify your email address.' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @Patch(':id')
  @HttpCode(200)
  protected async updateSubcategoryInfo(@Param('id') id: string, @Body() updateSubcategoryDto: UpdateSubcategoryDto, @UploadedFiles() files: { image?: Express.Multer.File[] }): Promise<any> {
    return this.silverSubcategoryService.updateSubcategoryInfo(id, updateSubcategoryDto);
  }

  @Delete(':id')
  protected async deleteSubcategory(@Param('id') id: string) {
    return await this.silverSubcategoryService.deleteSubcategory(id);
  }


  @ApiOperation({ summary: 'Update status' })
  @ApiUnauthorizedResponse({ description: 'Login required' })
  @ApiBadRequestResponse({ description: 'Invalid unit id' })
  @ApiResponse({ status: 200, description: 'Success', type: StatusSubcategoryDto })
  @Patch('/status/:id')
  protected async updateStatus(@Param('id') id: string, @Body() statusSubcategoryDto: StatusSubcategoryDto) : Promise<SuccessResponse<any>> {
    const data = await this.silverSubcategoryService.updateStatus(id,statusSubcategoryDto);
    return { data };
  };
 

  @Post('importSubCategory')
  protected async importSubCategory(@Body() createSubcategoryDto: CreateSubcategoryDto[]): Promise<any> {
    const data = await this.silverSubcategoryService.importSubCategory(createSubcategoryDto);
    return { data };
  }
}
