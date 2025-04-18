import { ObjectId } from "mongoose";
export declare class CreateCgConsumptionDto {
    productId: ObjectId;
    inventoryId: ObjectId;
    date: Date | string;
    qty: number;
}
export declare class UpdateCgConsumptionDto {
    qty: number;
    productId: ObjectId;
    consumptionId: ObjectId;
    date: Date | string;
}
export declare class ImportCgConsumptionDto {
    productName: string;
    date: Date | string;
    qty: number;
}
export declare class paginationDto {
}
export declare class updateStatusCgConsumptionDto {
    active: Boolean;
}
