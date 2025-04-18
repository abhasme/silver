import { RoMaster, RoMasterDocument } from '../../entities/Silver/roMaster';
import { RoOrderDocument } from '../../entities/Silver/roOrder';
import { RoInventoryDocument } from '../../entities/Silver/roInventory';
import { RoConsumptionDocument } from '../../entities/Silver/roConsumption';
import { Model } from 'mongoose';
import { CreateRoMasterDto, ImportRoMasterDto, UpdateRoMasterDto, UpdateStatusRoMasterDto } from '../../Silver/ro-master/dto/request-roMaster.dto';
import { GetRoMasterInfoDto } from '../../Silver/ro-master/dto/response-roMaster.dto';
import { Request } from 'express';
import { FilterPaginationRoMasterDto } from 'src/dto/roMaster.dto';
export declare class RoMasterService {
    private roOrderModel;
    private roMasterModel;
    private roInventoryModel;
    private roConsumptionModel;
    constructor(roOrderModel: Model<RoOrderDocument>, roMasterModel: Model<RoMasterDocument>, roInventoryModel: Model<RoInventoryDocument>, roConsumptionModel: Model<RoConsumptionDocument>);
    getAllRoMaster(paginationDto: FilterPaginationRoMasterDto): Promise<any>;
    createRo(createRoMasterDto: CreateRoMasterDto, req: Request): Promise<GetRoMasterInfoDto>;
    getRoMasterInfo(id: string): Promise<GetRoMasterInfoDto>;
    UpdateRoMaster(id: string, roMasterDto: UpdateRoMasterDto): Promise<RoMaster>;
    deleteRoMaster(id: string): Promise<RoMaster>;
    importRoMaster(importRoMasterDto: ImportRoMasterDto[]): Promise<any>;
    getRoMasterDropDown(): Promise<any>;
    getCompanyNameDropDown(): Promise<any>;
    updateRoMasterStatus(id: string, updateRoMasterDto: UpdateStatusRoMasterDto): Promise<UpdateStatusRoMasterDto>;
}
