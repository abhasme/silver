import { PaginationRequestDto } from 'src/dto/pagination-dto';
import { ObjectId } from "mongoose";
export declare class passwordRequestDto {
    password: string;
}
export declare class LoginRequestDto extends passwordRequestDto {
    username: string;
    appVersion: string;
    deviceToken: string;
    deviceType: string;
    deviceName: string;
}
export declare class EmailRequestDto {
    email: string;
}
export declare class MobileRequestDto {
    mobile: string;
}
export declare class changePasswordRequestDto extends passwordRequestDto {
    currentPassword: string;
}
export declare class FilterPaginationUserDto extends PaginationRequestDto {
    active: Boolean;
    userType: [string];
    firstName: [string];
    email: [string];
    firmName: [string];
}
export declare class CreateUserDto {
    firstName: string;
    lastName: string;
    firmName: string;
    email: string;
    password: string;
    userType: string;
    createdBy: ObjectId;
    channelPartnerId: ObjectId;
    supplierPartnerId: ObjectId;
    roId: ObjectId;
    units: [string];
    isAcceptanceAtWIP: boolean;
    isAcceptanceAtRotex: boolean;
    isEditingLeadDays: boolean;
    isApproval: boolean;
    IsRotexViewSupplierModule: boolean;
    IsRotexViewCpModule: boolean;
    isAcceptingProduction: boolean;
    isReplenishmentRecommendations: boolean;
    isHandlingWip: boolean;
    isDispatching: boolean;
    isHoViewCgOrder: boolean;
    isHoViewCgInventory: boolean;
    isHoViewCgConsumption: boolean;
    isHoViewROOrder: boolean;
    isHoViewRoInventory: boolean;
    isHoViewRoConsumption: boolean;
    isHoViewSilverProduct: boolean;
    isHoViewRoMaster: boolean;
    isUpdateAccessRo: boolean;
}
export declare class UpdateUserDto extends CreateUserDto {
}
export declare class StatusUserDto {
    userid: string;
    active: boolean;
}
export declare class BulkUsersDto {
    users?: CreateUserDto[];
}
export declare class ImportUserDto {
    users?: CreateUserDto[];
}
