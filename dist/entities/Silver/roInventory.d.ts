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
import { Types, Document } from 'mongoose';
import { Permissionstatus } from '../../common/enums/role.enum';
export type RoInventoryDocument = RoInventory & Document;
export declare class RoInventory {
    roId: Types.ObjectId;
    productId: Types.ObjectId;
    consumptionId: Types.ObjectId;
    orderId: Types.ObjectId;
    tog: number;
    rWC: number;
    leadTime: number;
    stockUpWeeks: number;
    growthFactor: string;
    isGrowthFactor: Boolean;
    onHandStock: number;
    openOrder: number;
    qualifiedDemand: number;
    netFlow: number;
    orderRecommendation: number;
    orderRecommendationStatus: string;
    onHandStatus: string;
    moq: number;
    flag: Permissionstatus;
    consumption: number;
    createdAt: Date;
    createdBy: Types.ObjectId;
    active: Boolean;
    isUpdateInventory: Boolean;
    isUpdateTog: Boolean;
    LYM: number;
    CYM: number;
    L13: number;
    LBS: number;
    SWB: number;
    togRecommendation: number;
    finalTog: number;
    oldTog: number;
    isConvertFinalToTog: Boolean;
}
export declare const RoInventorySchema: import("mongoose").Schema<RoInventory, import("mongoose").Model<RoInventory, any, any, any, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, RoInventory>;
