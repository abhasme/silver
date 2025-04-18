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
export type CgInventoryDocument = CgInventory & Document;
export declare class CgInventory {
    productId: Types.ObjectId;
    roInventoryId: Types.ObjectId;
    consumptionId: Types.ObjectId;
    orderId: Types.ObjectId;
    tog: number;
    avgWeeklyConsumption: number;
    roSigma: number;
    plantLeadTime: number;
    togRecommendation: number;
    oldTogRecommendation: number;
    growthFactor: string;
    isGrowthFactor: Boolean;
    isConvertFinalToTog: Boolean;
    onHandStock: number;
    openOrder: number;
    qualifiedDemand: number;
    netFlow: number;
    orderRecommendation: number;
    moq: number;
    orderRecommendationStatus: string;
    onHandStatus: string;
    flag: Permissionstatus;
    consumption: number;
    createdAt: Date;
    createdBy: Types.ObjectId;
    active: Boolean;
    isUpdateInventory: Boolean;
    isUpdateTog: Boolean;
}
export declare const CgInventorySchema: import("mongoose").Schema<CgInventory, import("mongoose").Model<CgInventory, any, any, any, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, CgInventory>;
