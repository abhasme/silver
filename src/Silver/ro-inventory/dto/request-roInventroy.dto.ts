import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsNotEmpty, IsNumber ,IsBoolean,IsArray} from 'class-validator';
import { Transform } from 'class-transformer';
import { PaginationRequestDto } from 'src/dto/pagination-dto';
import { Types, ObjectId } from "mongoose";
export class CreateRoInventoryDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  roId:ObjectId;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  productId:ObjectId;

  @ApiProperty()
  @IsString()
  @IsOptional()
  consumptionId:ObjectId;

  @ApiProperty()
  @IsString()
  @IsOptional()
  orderId:ObjectId;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  onHandStock: number

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  qualifiedDemand: number

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  leadTime: number

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  stockUpWeeks: number

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  growthFactor: number

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  tog: number

  @ApiProperty()
  @IsString()
  @IsOptional()
  moq: string;

};

export class UpdateRoInventoryDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  roId:ObjectId;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  productId:ObjectId;

  @ApiProperty()
  @IsString()
  @IsOptional()
  consumptionId:ObjectId;

  @ApiProperty()
  @IsString()
  @IsOptional()
  orderId:ObjectId;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  onHandStock: number

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  qualifiedDemand: number

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  leadTime: number

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  growthFactor: number

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  tog: number

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  stockUpWeeks: number

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  moq: number

};

export class UpdateTogToggleDto {
  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  isUpdateTog:Boolean;
};

export class FilterPaginationRoInventoryDto extends PaginationRequestDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.toString())
  roId: string;

  @ApiProperty()
 @IsArray()
  @IsOptional() 
  onHandStock: [number]

  @ApiProperty()
  @IsArray()
  @IsOptional()
  qualifiedDemand: [number]

  @ApiProperty()
  @IsArray()
  @IsOptional()
  leadTime: [number]

  @ApiProperty()
  @IsArray()
  @IsOptional()
  factorOfSafety: [number]


  @ApiProperty()
  @IsOptional()
  avgWeeklyConsumption: [number]

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  active:Boolean;

  @ApiProperty()
  @IsArray()
  @IsOptional()
  flag: [string];

  @ApiProperty()
  @IsArray()
  @IsOptional()
  itemDescription: [string];

  @ApiProperty()
  @IsArray()
  @IsOptional()
  contactPersonName: [string];

  @ApiProperty()
  @IsArray()
  @IsOptional()
  itemCode: [string];

  @ApiProperty()
  @IsArray()
  @IsOptional()
  tog: [number];

  @ApiProperty()
  @IsArray()
  @IsOptional()
  netFlow: [number];

  @ApiProperty()
  @IsArray()
  @IsOptional()
  avg: [number];

  @ApiProperty()
  @IsArray()
  @IsOptional()
  unit: [number];

  @ApiProperty()
  @IsArray()
  @IsOptional()
  orderRecommendation: [number];

  @ApiProperty()
  @IsArray()
  @IsOptional()
  moq: [string];

  @ApiProperty()
  @IsArray()
  @IsOptional()
  city: [string];

  @ApiProperty()
  @IsArray()
  @IsOptional()
  state: [string];

  @ApiProperty()
  @IsArray()
  @IsOptional()
  roName:string[];

  @ApiProperty()
  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.toString())
  status: string;

  @ApiProperty()
  @IsOptional()
  createdAt: [string]

  @ApiProperty()
  @IsOptional()
  productName: [string]

  @ApiProperty()
  @IsOptional()
  group: [string]

  @ApiProperty()
  @IsOptional()
  branch: [string]

  @ApiProperty()
  @IsOptional()
  LYM: [string]

  @ApiProperty()
  @IsOptional()
  CYM: [string]

  @ApiProperty()
  @IsOptional()
  L13: [string]

  @ApiProperty()
  @IsOptional()
  LBS: [string]

  @ApiProperty()
  @IsOptional()
  SWB: [string]


  @ApiProperty()
  @IsOptional()
  togRecommendation: [string]


  @ApiProperty()
  @IsOptional()
  growthFactor: [string]

  @ApiProperty()
  @IsOptional()
  onHandStatus: [string]

  @ApiProperty()
  @IsOptional()
  stockUpWeeks: [string]

  @ApiProperty()
  @IsArray()
  @IsOptional()
  orderRecommendationStatus: [string]

  @ApiProperty()
  @IsArray()
  @IsOptional()
  openOrder: [number];


  @ApiProperty({ required: false })
  @IsOptional()
  @IsArray()
  sortBy?: {
    orderKey?: string;
    orderValue?: number;
  }[];

  
}


export class UpdateStatusRoInventoryDto {
  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  active:Boolean;
};

export class GetDashBoardRoInventoryInfo {
  @ApiProperty()
  @IsString()
  @IsOptional()
  roId:ObjectId;

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  active:Boolean;

};

export class ImportRoInventoryDto {
 
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  productName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  roName: string;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  tog: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  onHandStock: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  qualifiedDemand: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  leadTime: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  stockUpWeeks: number

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  active: boolean

}
  
export class ViewotherRoInventoryDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  roId:ObjectId;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  productId:ObjectId;
};

export class AddRoIdInfo {
  @ApiProperty()
  @IsString()
  @IsOptional()
  roId:ObjectId;
};

export class ChangeTogDto {
  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  isConvertFinalToTog:Boolean;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  isGrowthFactor:Boolean;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  isNoTogChange:Boolean;

  @ApiProperty()
  @IsString()
  @IsOptional()
  growthFactor:string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  tog:string;

};

export class ImportRoInventoryAndUpdateStockDto {
  
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  productName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  roName: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  onHandStock: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  consumption: string

}