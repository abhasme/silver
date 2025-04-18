import { Controller, Get, Put, Post, Body, Patch, UsePipes,ValidationPipe,Param, Delete, HttpCode, Req, UseInterceptors, BadRequestException, UploadedFiles } from '@nestjs/common';
import { ApiBadRequestResponse, ApiForbiddenResponse, ApiInternalServerErrorResponse, ApiOperation, ApiResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { CgOrderService} from '../../services/Silver/cg-order.service';
import { DashboardCgOrderDto, FilterPaginationCgOrderDto, UpdateCgOrderDto} from './dto/request-cgOrder.dto';
import { GetAllCgOrderDto,GetCgOrderInfoDto } from './dto/response-cgOrder.dto';
import { SuccessResponse } from '../../common/interfaces/response';
import { Request } from 'express';
import { TransformInterceptor } from 'src/common/dispatchers/transform.interceptor';
import { Types } from 'mongoose';

@Controller('cg-order')
@ApiInternalServerErrorResponse({ description: 'Internal server error' })
@UseInterceptors(TransformInterceptor)
export class CgOrderController {
    constructor(private readonly cgOrderService: CgOrderService) { }
    @ApiOperation({ summary: 'Get all Cg order' })
    @ApiResponse({ status: 200, type: GetAllCgOrderDto })
    @Post('/all')
    protected async getAllOrder(@Body() paginationDto : FilterPaginationCgOrderDto,@Req() req: Request): Promise<SuccessResponse<any>> {
      const data = await this.cgOrderService.getAllOrder(paginationDto,req);
      return { data };
    };
    @ApiOperation({ summary: 'Get paticular order details' })
    @ApiUnauthorizedResponse({ description: 'Login required' })
    @ApiBadRequestResponse({ description: 'Invalid order id' })
    @ApiResponse({ status: 200, description: 'Success', type: GetCgOrderInfoDto })
    @Get('/:id')
    protected async getOrderInfo(@Param('id') id: string): Promise<SuccessResponse<GetCgOrderInfoDto>>{
      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException('Invalid order ID');
      }
      const data = await this.cgOrderService.getOrderInfo(id);
      return { data };
    };

    @ApiOperation({ summary: 'Update order' })
    @ApiResponse({ status: 200, description: 'Success', type: GetCgOrderInfoDto })
    @ApiForbiddenResponse({ description: 'order already exist' })
    @ApiInternalServerErrorResponse({ description: 'Internal server error' })
    @Put('/:id')
    @HttpCode(200)
    protected async updateOrder(@Param('id') id: string, @Body() updateOrderIdDto: UpdateCgOrderDto,@Req() req: Request) : Promise<SuccessResponse<any>> {
      const data = await this.cgOrderService.updateOrder(id,updateOrderIdDto);
      return { data };
    };

    @ApiOperation({ summary: 'Dashboard order' })
    @ApiResponse({ status: 200, description: 'Success', type: GetCgOrderInfoDto })
    @ApiInternalServerErrorResponse({ description: 'Internal server error' })
    @Post('/dashboard/count')
    @HttpCode(200)
    protected async dashBoardOrder(@Body() dashboardOrderDto: DashboardCgOrderDto,@Req() req: Request) : Promise<SuccessResponse<any>> {
      const data = await this.cgOrderService.dashBoardOrder(dashboardOrderDto,req);
      return { data };
    };

    @ApiOperation({ summary: 'Get Cg  drop down' })
    @ApiResponse({ status: 200, description: 'Success', type: GetCgOrderInfoDto })
    @Post("/dropdown")
    protected async getOrderDropDown(@Req() req: Request): Promise<SuccessResponse<any>> {
      const data = await this.cgOrderService.getOrderDropDown(req);
      return { data };
    };
}
