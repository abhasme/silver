
import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, UsePipes, ValidationPipe, Req, UseInterceptors, UploadedFiles, BadRequestException } from '@nestjs/common';
import { ApiBadRequestResponse, ApiForbiddenResponse, ApiInternalServerErrorResponse, ApiOperation, ApiResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { SilverCategoryService } from '../../services/Silver/category.service';
import { CreateCategoryDto, ImportCategoryDto, StatusCategoryDto, UpdateCategoryDto,FilterPaginationUserDto } from '../silver-category/dto/request-category.dto';
import { GetCategoryInfoDto } from '../silver-category/dto/response-category.dto';
import { SuccessResponse } from '../../common/interfaces/response';
import { Request } from 'express';
import { TransformInterceptor } from 'src/common/dispatchers/transform.interceptor';
import { Types } from 'mongoose';
import { SearchDto } from 'src/dto/pagination-dto';

@Controller('silver-category')
@ApiInternalServerErrorResponse({ description: 'Internal server error' })
@UseInterceptors(TransformInterceptor)
export class SilverCategoryController {

    constructor(private readonly silverCategoryService: SilverCategoryService) { }

    @ApiOperation({ summary: 'Add Category' })
    @ApiResponse({ status: 200, description: 'Success', type: GetCategoryInfoDto })
    @ApiInternalServerErrorResponse({ description: 'Internal server error' })
    @Post()
    @HttpCode(200)
    protected async createCategory(@Req() req: Request, @Body() createCategoryDto: CreateCategoryDto,
    ): Promise<any> {
      return this.silverCategoryService.createCategory(createCategoryDto, req);
    }
  
  
    @ApiOperation({ summary: 'Get all category' })
    @ApiResponse({ status: 200, description: 'Mobile number is available', type: GetCategoryInfoDto })
    @ApiBadRequestResponse({ description: 'Invalid category id' })
    @Post('/all')
    protected async getAllCategories(@Req() req: Request, @Body() paginationDto : FilterPaginationUserDto): Promise<SuccessResponse<any>> {
      console.log(paginationDto,"paginationDto")
      const data = await this.silverCategoryService.getAllCategories(paginationDto);
      return { data };
    }
  
    @ApiOperation({ summary: 'Get paticular category details' })
    @ApiUnauthorizedResponse({ description: 'Login required' })
    @ApiBadRequestResponse({ description: 'Invalid category id' })
    @ApiResponse({ status: 200, description: 'Success', type: GetCategoryInfoDto })
    @Get('info/:id')
    protected async getCategoryInfo(@Param('id') id: string): Promise<SuccessResponse<GetCategoryInfoDto>> {
      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException('Invalid category ID');
      }
      const data = await this.silverCategoryService.getCategoryInfo(id);
      return { data };
    }
  
    @ApiOperation({ summary: 'Category Update' })
    @ApiResponse({ status: 200, description: 'Success', type: GetCategoryInfoDto })
    @ApiBadRequestResponse({ description: 'Invalid id or password' })
    @ApiForbiddenResponse({ description: 'Your email is not verified! Please verify your email address.' })
    @ApiInternalServerErrorResponse({ description: 'Internal server error' })
    @Patch(':id')
    @HttpCode(200)
    protected async updateCategoryInfo(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto, 
    ): Promise<any> {
      return this.silverCategoryService.updateCategoryInfo(id, updateCategoryDto);
    }
  
  
    @Delete(':id')
    protected async deleteCategory(@Param('id') id: string) {
      return await this.silverCategoryService.deleteCategory(id);
    }
  
    @ApiOperation({ summary: 'Update status' })
    @ApiUnauthorizedResponse({ description: 'Login required' })
    @ApiBadRequestResponse({ description: 'Invalid unit id' })
    @ApiResponse({ status: 200, description: 'Success', type: StatusCategoryDto })
    @Patch('/status/:id')
    protected async updateStatus(@Param('id') id: string, @Body() statusCategoryDto: StatusCategoryDto) : Promise<SuccessResponse<any>> {
      const data = await this.silverCategoryService.updateStatus(id,statusCategoryDto);
      return { data };
    };
  
    @Post('importCategory')
    protected async importSubCategory(@Req() req: Request, @Body() importCategoryDto: ImportCategoryDto[]): Promise<any> {
     const data = await this.silverCategoryService.importCategory(req,importCategoryDto);
      return { data };
    }
    @ApiOperation({ summary: 'Get Category DropDown' })
    @ApiResponse({ status: 200, description: 'Category is available', type: GetCategoryInfoDto })
    @ApiBadRequestResponse({ description: 'Invalid Category' })
    @Get('dropdown')
    protected async getCategoryDropDown(@Body()searchDto: SearchDto): Promise<SuccessResponse<any>> {
      const data = await this.silverCategoryService.getCategoryDropDown(searchDto);
      return { data };
    }

}





