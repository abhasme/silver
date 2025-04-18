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
export type SilverProductDocument = SilverProduct & Document;
export declare class SilverProduct {
    itemCode: string;
    itemDescription: string;
    productName: string;
    categoryid: Types.ObjectId;
    subcategoryid: Types.ObjectId;
    unitid: Types.ObjectId;
    brandid: Types.ObjectId;
    groupid: Types.ObjectId;
    LP: string;
    HP: string;
    KW: string;
    productStage: string;
    modelNo: String;
    suc_del: number;
    discount: String;
    finalPrice: String;
    createdAt: Date;
    createdBy: Types.ObjectId;
    active: Boolean;
}
export declare const SilverProductSchema: import("mongoose").Schema<SilverProduct, import("mongoose").Model<SilverProduct, any, any, any, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, SilverProduct>;
