import { ObjectId } from "mongoose";
export declare class CreateRoConsumptionDto {
    roId: ObjectId;
    productId: ObjectId;
    itemId: ObjectId;
    inventoryid: ObjectId;
    date: Date | string;
    qty: number;
}
export declare class UpdateRoConsumptionDto {
    qty: number;
    roId: ObjectId;
    productId: ObjectId;
    consumptionId: ObjectId;
    date: Date | string;
}
export declare class ImportRoConsumptionDto {
    roName: string;
    productName: string;
    date: Date;
    qty: number;
    updatedInventory: string;
}
export declare class paginationDto {
}
export declare class updateStatusRoConsumptionDto {
    active: Boolean;
}
export declare class AddRoConsumptionDto {
    roId: string;
}
