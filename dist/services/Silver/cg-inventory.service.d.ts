/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/callback" />
/// <reference types="mongoose/types/collection" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/expressions" />
/// <reference types="mongoose/types/helpers" />
/// <reference types="mongoose/types/middlewares" />
/// <reference types="mongoose/types/indexes" />
/// <reference types="mongoose/types/models" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/populate" />
/// <reference types="mongoose/types/query" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/session" />
/// <reference types="mongoose/types/types" />
/// <reference types="mongoose/types/utility" />
/// <reference types="mongoose/types/validation" />
/// <reference types="mongoose/types/virtuals" />
/// <reference types="mongoose/types/inferschematype" />
import { Request } from 'express';
import { Model } from 'mongoose';
import { UserDocument } from '../../entities/users.entity';
import { CgOrderDocument } from '../../entities/Silver/cgOrder';
import { RoMasterDocument } from '../../entities/Silver/roMaster';
import { RoInventoryDocument } from '../../entities/Silver/roInventory';
import { CgInventory, CgInventoryDocument } from '../../entities/Silver/cgInventory';
import { CgConsumptionDocument } from '../../entities/Silver/cgConsumption';
import { CgGrowthFactorDocument } from '../../entities/Silver/cggrowthFactorInfo';
import { SilverProductDocument } from '../../entities/Silver/silverProductMaster';
import { SearchDto } from 'src/dto/pagination-dto';
import { GetCgInventoryInfoDto } from '../../Silver/cg-inventory/dto/response-cgInventory.dto';
import { ChangeTogDto, CreateCgInventoryDto, FilterPaginationCgInventoryDto, GetDashBoardCgInventoryInfo, ImportCgInventoryDto, UpdateCgInventoryDto, UpdateStatusCgInventoryDto, UpdateTogToggleDto, ViewOtherCgInventoryDto } from '../../Silver/cg-inventory/dto/request-cgInventroy.dto';
export declare class CgInventoryService {
    private roInventoryModel;
    private userModel;
    private cgInventoryModel;
    private cgConsumptionModel;
    private silverProductModel;
    private cgOrderModel;
    private cgGrowthModel;
    private roMasterModel;
    constructor(roInventoryModel: Model<RoInventoryDocument>, userModel: Model<UserDocument>, cgInventoryModel: Model<CgInventoryDocument>, cgConsumptionModel: Model<CgConsumptionDocument>, silverProductModel: Model<SilverProductDocument>, cgOrderModel: Model<CgOrderDocument>, cgGrowthModel: Model<CgGrowthFactorDocument>, roMasterModel: Model<RoMasterDocument>);
    UpdateCgInventory(togData: any, productId: any): Promise<void>;
    getAvgWeeklyConsumption(productId: any): Promise<number>;
    getAvgWeeklyConsumptionByInventory(inventoryId: any): Promise<number>;
    generateUniqueNumber(): Promise<any>;
    changeUniqueNumber(): Promise<void>;
    cgInventoryInfo(productId: any): Promise<any>;
    getOpenOrder(productId: any): Promise<number>;
    createInventory(createInventoryDto: CreateCgInventoryDto, req: Request): Promise<GetCgInventoryInfoDto>;
    getAllInventory(paginationDto: FilterPaginationCgInventoryDto, req: Request): Promise<any>;
    getInventoryInfo(id: string): Promise<any>;
    updateInventoryStatus(id: string, updateStatusInventoryDto: UpdateStatusCgInventoryDto): Promise<UpdateStatusCgInventoryDto>;
    UpdateInventory(id: string, updateInventoryDto: UpdateCgInventoryDto, req: Request): Promise<void>;
    getDashBoardInventoryInfo(GetDashBoardCgInventoryInfo: GetDashBoardCgInventoryInfo, req: Request): Promise<any>;
    getInventoryDropDown(req: Request): Promise<any>;
    importInventory(createInventoryDto: ImportCgInventoryDto[], req: Request): Promise<any>;
    getInventoryMoreInfo(viewOtherInventoryDto: ViewOtherCgInventoryDto): Promise<any>;
    getProductDropDown(searchDto: SearchDto, req: Request): Promise<any>;
    UpdateTogToggle(id: string, updateTogToggleDto: UpdateTogToggleDto, req: Request): Promise<void>;
    changeTog(id: string, changeTogDto: ChangeTogDto): Promise<CgInventory & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    }>;
}
