import { Controller, Get,Put, Post, Body, Patch, Param, Delete, HttpCode, UsePipes, ValidationPipe , Req, UseInterceptors} from '@nestjs/common';
import { SilverProductsService } from '../../services/Silver/product.service';
import { ApiBadRequestResponse, ApiForbiddenResponse, ApiInternalServerErrorResponse, ApiOperation, ApiResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';
import {CreateProductDto, StatusProductDto, ImportProductDto, UpdateProductDto } from './dto/request-product.dto';
import { GetProductInfoDto } from './dto/response-product.dto';
import { SuccessResponse } from 'src/common/interfaces/response';
import { Request } from 'express';
import { TransformInterceptor } from 'src/common/dispatchers/transform.interceptor';
import { FilterPaginationProductDto } from 'src/dto/product-dto';
import { SearchDto } from 'src/dto/pagination-dto';


@Controller('silver-product')
@ApiInternalServerErrorResponse({ description: 'Internal server error' })
@UseInterceptors(TransformInterceptor)

export class SilverProductController {
  constructor(private readonly silverProductsService: SilverProductsService) {}

  @ApiOperation({ summary: 'Login into the system' })
  @ApiResponse({ status: 200, description: 'Success', type: GetProductInfoDto })
  @ApiBadRequestResponse({ description: 'item code already exist' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @Post()
  @HttpCode(200)
  protected async createProduct(@Req() req: Request, @Body() createProductDto: CreateProductDto): Promise<any> {
    return this.silverProductsService.createProduct(createProductDto,req );
  }


  @ApiOperation({ summary: 'Get all products' })
  @Post("all")
  protected async getAllProduct(@Req() req: Request,@Body() paginationDto : FilterPaginationProductDto): Promise<SuccessResponse<any>> {
    const data = await this.silverProductsService.getAllProduct(paginationDto,req);
    return { data };
  }

  @ApiOperation({ summary: 'Get paticular product details' })
  @ApiUnauthorizedResponse({ description: 'Login required' })
  @ApiBadRequestResponse({ description: 'Invalid product id' })
  @ApiResponse({ status: 200, description: 'Success', type: GetProductInfoDto })
  @Get('/:id')
  protected async getProductInfo(@Param('id') id: string) : Promise<SuccessResponse<any>> {
    const data = await this.silverProductsService.getProductInfo(id);
    return { data };
  }

  @ApiOperation({ summary: 'Update Product' })
  @ApiResponse({ status: 200, description: 'Success', type: CreateProductDto })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @Put('/:id')
  @HttpCode(200)
  protected async UpdateProducts(@Param('id') id: string, @Body() productIdDto: UpdateProductDto) : Promise<SuccessResponse<any>> {
    const data = await this.silverProductsService.UpdateProducts(id,productIdDto);
    return { data };
  }
  
  @Delete(':id')
  protected async deleteCategory(@Param('id') id: string) {
    return await this.silverProductsService.deleteProduct(id);
  }

  @ApiOperation({ summary: 'Add Multiple Product' })
  @ApiResponse({ status: 200, description: 'Success', type: GetProductInfoDto })
  @ApiBadRequestResponse({ description: 'Invalid id or password' })
  @ApiForbiddenResponse({ description: 'Your email is not verified! Please verify your email address.' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @Post('importProducts')
  @HttpCode(200)
  protected async importProducts(@Req() req: Request, @Body() createProductDto: ImportProductDto[]): Promise<any> {
    const data = await this.silverProductsService.importProducts(createProductDto);
    return { data };
  }

  @ApiOperation({ summary: 'Get products drop down' })
  @ApiResponse({ status: 200, description: 'Success', type: GetProductInfoDto })
  @Post("/dropdown")
  protected async getProductDropDown(@Req() req: Request,@Body()searchDto: SearchDto): Promise<SuccessResponse<any>> {
    const data = await this.silverProductsService.getProductDropDown(searchDto,req);
    return { data };
  };

  @ApiOperation({ summary: 'Update status' })
  @ApiUnauthorizedResponse({ description: 'Login required' })
  @ApiBadRequestResponse({ description: 'Invalid product id' })
  @ApiResponse({ status: 200, description: 'Success', type: GetProductInfoDto })
  @Patch('/status/:id')
  protected async updateStatus(@Param('id') id: string, @Body() statusProductDto: StatusProductDto): Promise<SuccessResponse<any>> {
    const data = await this.silverProductsService.updateStatus(id, statusProductDto);
    return { data };
  };

}

