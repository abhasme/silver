import { CgOrderService } from '../../services/Silver/cg-order.service';
import { DashboardCgOrderDto, FilterPaginationCgOrderDto, UpdateCgOrderDto } from './dto/request-cgOrder.dto';
import { GetCgOrderInfoDto } from './dto/response-cgOrder.dto';
import { SuccessResponse } from '../../common/interfaces/response';
import { Request } from 'express';
export declare class CgOrderController {
    private readonly cgOrderService;
    constructor(cgOrderService: CgOrderService);
    protected getAllOrder(paginationDto: FilterPaginationCgOrderDto, req: Request): Promise<SuccessResponse<any>>;
    protected getOrderInfo(id: string): Promise<SuccessResponse<GetCgOrderInfoDto>>;
    protected updateOrder(id: string, updateOrderIdDto: UpdateCgOrderDto, req: Request): Promise<SuccessResponse<any>>;
    protected dashBoardOrder(dashboardOrderDto: DashboardCgOrderDto, req: Request): Promise<SuccessResponse<any>>;
    protected getOrderDropDown(req: Request): Promise<SuccessResponse<any>>;
}
