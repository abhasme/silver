import { PaginationRequestDto } from 'src/dto/pagination-dto';
import { ApiProperty} from '@nestjs/swagger';
import { IsOptional, IsString,IsEmail,ValidateNested, IsNotEmpty , IsMongoId, IsBoolean } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ObjectId } from "mongoose";

export class passwordRequestDto {
    @ApiProperty()
    @IsString()
    password: string;
}
export class LoginRequestDto extends passwordRequestDto {
    @ApiProperty()
    @IsString()
    username: string;

  @ApiProperty()
    @IsString()
    @IsOptional()
    @Transform(({ value }) => value.toString())
    appVersion : string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    @Transform(({ value }) => value.toString())
    deviceToken : string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    @Transform(({ value }) => value.toString())
    deviceType : string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    @Transform(({ value }) => value.toString())
    deviceName : string;
}

export class EmailRequestDto {
    @ApiProperty()
    @IsString()
    email: string;
}

export class MobileRequestDto {
    @ApiProperty()
    @IsString()
    mobile: string;
}

export class changePasswordRequestDto extends passwordRequestDto{
    @ApiProperty()
    @IsString()
    currentPassword: string;
}

export class FilterPaginationUserDto extends PaginationRequestDto {
    @ApiProperty()
    @IsBoolean()
    @IsOptional()
    active:Boolean;

    @ApiProperty()
    @IsOptional()
    userType: [string]

    @ApiProperty()
    @IsOptional()
    firstName: [string]

    @ApiProperty()
    @IsOptional()
    email: [string]

    @ApiProperty()
    @IsOptional()
    firmName: [string]

}




export class CreateUserDto {

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @Transform(({ value }) => value?.trim())
    firstName: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    @Transform(({ value }) => value?.trim())
    lastName: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    @Transform(({ value }) => value?.trim())
    firmName: string;
  
    @ApiProperty()
    @IsString()
    @IsOptional()
    @IsEmail()
    @Transform(({ value }) => value?.trim())
    email: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    @Transform(({ value }) => value?.trim())
    password: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    @Transform(({ value }) => value?.trim())
    userType: string;

    @ApiProperty()
    @IsMongoId()
    @IsOptional()
    @Transform(({ value }) => value.toString())
    createdBy: ObjectId;

    @ApiProperty()
    @IsMongoId()
    @IsOptional()
    @Transform(({ value }) => value.toString())
    channelPartnerId: ObjectId;

    @ApiProperty()
    @IsMongoId()
    @IsOptional()
    @Transform(({ value }) => value.toString())
    supplierPartnerId: ObjectId;

    @ApiProperty()
    @IsMongoId()
    @IsOptional()
    @Transform(({ value }) => value.toString())
    roId: ObjectId;


    @ApiProperty()
    @IsOptional()
    units: [string]

    @ApiProperty()
    @IsOptional()
    @IsBoolean()
    isAcceptanceAtWIP: boolean;

    @ApiProperty()
    @IsOptional()
    @IsBoolean()
    isAcceptanceAtRotex: boolean;

    @ApiProperty()
    @IsOptional()
    @IsBoolean()
    isEditingLeadDays: boolean;

    @ApiProperty()
    @IsOptional()
    @IsBoolean()
    isApproval: boolean;

    @ApiProperty()
    @IsOptional()
    @IsBoolean()
    IsRotexViewSupplierModule: boolean;

    @ApiProperty()
    @IsOptional()
    @IsBoolean()
    IsRotexViewCpModule: boolean;

    @ApiProperty()
    @IsOptional()
    @IsBoolean()
    isAcceptingProduction: boolean;

    @ApiProperty()
    @IsOptional()
    @IsBoolean()
    isReplenishmentRecommendations: boolean;

    @ApiProperty()
    @IsOptional()
    @IsBoolean()
    isHandlingWip: boolean;

    @ApiProperty()
    @IsOptional()
    @IsBoolean()
    isDispatching: boolean;

    @ApiProperty()
    @IsOptional()
    @IsBoolean()
    isHoViewCgOrder: boolean;

    @ApiProperty()
    @IsOptional()
    @IsBoolean()
    isHoViewCgInventory: boolean;

    @ApiProperty()
    @IsOptional()
    @IsBoolean()
    isHoViewCgConsumption: boolean;


    @ApiProperty()
    @IsOptional()
    @IsBoolean()
    isHoViewROOrder: boolean;

    @ApiProperty()
    @IsOptional()
    @IsBoolean()
    isHoViewRoInventory: boolean;

    @ApiProperty()
    @IsOptional()
    @IsBoolean()
    isHoViewRoConsumption: boolean;

    @ApiProperty()
    @IsOptional()
    @IsBoolean()
    isHoViewSilverProduct: boolean;

    @ApiProperty()
    @IsOptional()
    @IsBoolean()
    isHoViewRoMaster: boolean;

    @ApiProperty()
    @IsOptional()
    @IsBoolean()
    isUpdateAccessRo: boolean;

    
}

export class UpdateUserDto extends CreateUserDto {
  
}

export class StatusUserDto {
    @ApiProperty()
    @IsString()
    userid: string;
  
    @ApiProperty()
    @IsOptional()
    @IsBoolean()
    active: boolean;

  }


  
  export class BulkUsersDto {
    @ValidateNested({ each: true })
    @Type(() => CreateUserDto)
    @IsOptional()
    users?: CreateUserDto[];
  }

  export class ImportUserDto {
    @ValidateNested({ each: true })
    @Type(() => CreateUserDto)
    @IsOptional()
    users?: CreateUserDto[];
  }