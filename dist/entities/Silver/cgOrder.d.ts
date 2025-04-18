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
export type CgOrderDocument = CgOrder & Document;
export declare class CgOrder {
    productId: Types.ObjectId;
    inventoryId: Types.ObjectId;
    qty: number;
    uniqueOrderKey: string;
    plant: string;
    status: Permissionstatus;
    tog: number;
    onHandStock: number;
    openOrder: number;
    qualifiedDemand: number;
    netFlow: number;
    uniqueNumber: number;
    partialUniqueNumber: number;
    recommendation: {
        status: boolean;
        stage: string;
        createdAt: Date;
        qty: number;
    };
    cg: {
        status: boolean;
        stage: string;
        createdAt: Date;
        qty: number;
    };
    wip: {
        status: boolean;
        stage: string;
        createdAt: Date;
        qty: number;
        isChangeQty: boolean;
        isPartialDispatch: boolean;
        partialDispatchQty: number;
    };
    in_trasit: {
        status: boolean;
        stage: string;
        createdAt: Date;
        qty: number;
        isPartialDispatch: boolean;
    };
    grn: {
        status: boolean;
        stage: string;
        createdAt: Date;
        qty: number;
    };
    createdAt: Date;
    createdBy: Types.ObjectId;
    active: boolean;
    isInTransit: boolean;
    isWip: boolean;
}
export declare const CgOrderSchema: import("mongoose").Schema<CgOrder, import("mongoose").Model<CgOrder, any, any, any, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, CgOrder>;
