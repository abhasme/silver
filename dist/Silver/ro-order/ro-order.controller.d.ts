import { RoOrderService } from '../../services/Silver/ro-order.service';
import { AddRoIdInfo, DashboardRoOrderDto, FilterPaginationRoOrderDto, UpdateRoOrderDto } from './dto/request-roOrder.dto';
import { GetRoOrderInfoDto } from './dto/response-roOrder.dto';
import { SuccessResponse } from '../../common/interfaces/response';
import { Request } from 'express';
export declare class RoOrderController {
    private readonly roOrderService;
    constructor(roOrderService: RoOrderService);
    protected getAllOrder(paginationDto: FilterPaginationRoOrderDto, req: Request): Promise<SuccessResponse<any>>;
    protected getOrderInfo(id: string): Promise<SuccessResponse<GetRoOrderInfoDto>>;
    protected updateOrder(id: string, updateOrderIdDto: UpdateRoOrderDto, req: Request): Promise<SuccessResponse<any>>;
    protected dashBoardOrder(dashboardOrderDto: DashboardRoOrderDto, req: Request): Promise<SuccessResponse<any>>;
    protected getOrderDropDown(req: Request, addRoIdInfo: AddRoIdInfo): Promise<SuccessResponse<any>>;
}
