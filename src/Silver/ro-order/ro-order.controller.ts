import { Controller, Get, Put, Post, Body, Patch, UsePipes,ValidationPipe,Param, Delete, HttpCode, Req, UseInterceptors, BadRequestException, UploadedFiles } from '@nestjs/common';
import { ApiBadRequestResponse, ApiForbiddenResponse, ApiInternalServerErrorResponse, ApiOperation, ApiResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { RoOrderService } from '../../services/Silver/ro-order.service';
import { AddRoIdInfo, DashboardRoOrderDto, FilterPaginationRoOrderDto, UpdateRoOrderDto } from './dto/request-roOrder.dto';
import { GetAllRoOrderDto,GetRoOrderInfoDto } from './dto/response-roOrder.dto';
import { SuccessResponse } from '../../common/interfaces/response';
import { Request } from 'express';
import { TransformInterceptor } from 'src/common/dispatchers/transform.interceptor';
import { Types } from 'mongoose';

@Controller('ro-order')
@ApiInternalServerErrorResponse({ description: 'Internal server error' })
@UseInterceptors(TransformInterceptor)
export class RoOrderController {
    constructor(private readonly roOrderService:RoOrderService) {}
    @ApiOperation({ summary: 'Get all inventory' })
    @ApiResponse({ status: 200, type: GetAllRoOrderDto })
    @Post('/all')
    protected async getAllOrder(@Body() paginationDto : FilterPaginationRoOrderDto,@Req() req: Request): Promise<SuccessResponse<any>>{
      const data = await this.roOrderService.getAllOrder(paginationDto,req);
      return { data };
    };

    @ApiOperation({ summary: 'Get paticular order details' })
    @ApiUnauthorizedResponse({ description: 'Login required' })
    @ApiBadRequestResponse({ description: 'Invalid order id' })
    @ApiResponse({ status: 200, description: 'Success', type: GetRoOrderInfoDto })
    @Get('/:id')
    protected async getOrderInfo(@Param('id') id: string): Promise<SuccessResponse<GetRoOrderInfoDto>>{
      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException('Invalid order ID');
      }
      const data = await this.roOrderService.getOrderInfo(id);
      return { data };
    };

    @ApiOperation({ summary: 'Update order' })
    @ApiResponse({ status: 200, description: 'Success', type: GetRoOrderInfoDto })
    @ApiForbiddenResponse({ description: 'order already exist' })
    @ApiInternalServerErrorResponse({ description: 'Internal server error' })
    @Put('/:id')
    @HttpCode(200)
    protected async updateOrder(@Param('id') id: string, @Body() updateOrderIdDto: UpdateRoOrderDto,@Req() req: Request) : Promise<SuccessResponse<any>> {
      const data = await this.roOrderService.updateOrder(id,updateOrderIdDto,req);
      return { data };
    };

    @ApiOperation({ summary: 'Dashboard order' })
    @ApiResponse({ status: 200, description: 'Success', type: GetRoOrderInfoDto })
    @ApiInternalServerErrorResponse({ description: 'Internal server error' })
    @Post('/dashboard/count')
    @HttpCode(200)
    protected async dashBoardOrder(@Body() dashboardOrderDto: DashboardRoOrderDto,@Req() req: Request) : Promise<SuccessResponse<any>> {
      const data = await this.roOrderService.dashBoardOrder(dashboardOrderDto,req);
      return { data };
    };

    @ApiOperation({ summary: 'Get cp  drop down' })
    @ApiResponse({ status: 200, description: 'Success', type: GetRoOrderInfoDto })
    @Post("/dropdown")
    protected async getOrderDropDown(@Req() req: Request,@Body() addRoIdInfo:AddRoIdInfo): Promise<SuccessResponse<any>> {
      const data = await this.roOrderService.getOrderDropDown(req,addRoIdInfo);
      return { data };
    };

}
