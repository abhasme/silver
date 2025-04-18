export interface JwtTokenInterface {
    readonly _id?: any;
    readonly firstName?: string;
    readonly lastName?: string;
    readonly phoneCode?: string;
    readonly mobile?: number;
    readonly email?: string;
    readonly userType?: string;
    readonly categories?: any;
    readonly roId?: any;
    readonly isAcceptingProduction?: Boolean;
    readonly isReplenishmentRecommendations?: Boolean;
    readonly isHandlingWip?: Boolean;
    readonly isDispatching?: Boolean;
    readonly isHoViewCgOrder?: Boolean;
    readonly isHoViewCgInventory?: Boolean;
    readonly isHoViewCgConsumption?: Boolean;
    readonly isHoViewROOrder?: Boolean;
    readonly isHoViewRoInventory?: Boolean;
    readonly isHoViewRoConsumption?: Boolean;
    readonly isHoViewSilverProduct?: Boolean;
    readonly isHoViewRoMaster?: Boolean;
    readonly isUpdateAccessRo?: Boolean;
    readonly?: Boolean;
}
export interface CustomerJwtTokenInterface {
    readonly _id?: any;
    readonly firmName?: string;
    readonly contactPerson?: string;
    readonly mobile?: number;
    readonly email?: string;
    readonly customerType?: string;
}
