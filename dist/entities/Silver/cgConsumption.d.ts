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
export type CgConsumptionDocument = CgConsumption & Document;
export declare class CgConsumption {
    productId: Types.ObjectId;
    inventoryId: Types.ObjectId;
    roId: Types.ObjectId;
    qty: number;
    opNumber: string;
    date: Date;
    createdAt: Date;
    createdBy: Types.ObjectId;
    active: Boolean;
}
export declare const CgConsumptionSchema: import("mongoose").Schema<CgConsumption, import("mongoose").Model<CgConsumption, any, any, any, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, CgConsumption>;
