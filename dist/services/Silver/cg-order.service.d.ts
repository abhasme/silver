import { Model } from "mongoose";
import { Request } from 'express';
import { UserDocument } from "../../entities/users.entity";
import { CgOrderDocument } from "../../entities/Silver/cgOrder";
import { CgInventoryDocument } from "../../entities/Silver/cgInventory";
import { SilverProductDocument } from "../../entities/Silver/silverProductMaster";
import { CgConsumptionDocument } from "../../entities/Silver/cgConsumption";
import { RoMasterDocument } from "../../entities/Silver/roMaster";
import { DashboardCgOrderDto, FilterPaginationCgOrderDto, UpdateCgOrderDto } from "../../Silver/cg-order/dto/request-cgOrder.dto";
export declare class CgOrderService {
    private cgInventoryModel;
    private productModel;
    private roMasterModel;
    private userModel;
    private cgConsumptionModel;
    private cgOrderModel;
    private readonly sheet;
    private readonly spreadsheetId;
    constructor(cgInventoryModel: Model<CgInventoryDocument>, productModel: Model<SilverProductDocument>, roMasterModel: Model<RoMasterDocument>, userModel: Model<UserDocument>, cgConsumptionModel: Model<CgConsumptionDocument>, cgOrderModel: Model<CgOrderDocument>);
    getOpenOrder(productId: any): Promise<number>;
    getIndianDate(date: any): Promise<any>;
    addDataInxlsxFile(dataArray: any, range: any): Promise<any>;
    getAllOrder(paginationDto: FilterPaginationCgOrderDto, req: Request): Promise<any>;
    getPartialOrderInfo(uniqueNumber: any): Promise<any[]>;
    getOrderInfo(id: string): Promise<any>;
    updateOrder(id: string, updateOrderDto: UpdateCgOrderDto): Promise<void>;
    dashBoardOrder(dashboardOrderDto: DashboardCgOrderDto, req: Request): Promise<any>;
    getOrderDropDown(req: Request): Promise<any>;
}
