import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsNotEmpty, IsNumber ,IsBoolean,IsArray} from 'class-validator';
import { Transform } from 'class-transformer';
import { PaginationRequestDto } from 'src/dto/pagination-dto';
import { Types, ObjectId } from "mongoose";
export class CreateCgInventoryDto {
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
  @IsString()
  @IsOptional()
  growthFactor: string

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  tog: number
  
  @ApiProperty()
  @IsNumber()
  @IsOptional()
  plantLeadTime: number

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  moq: number
};

export class UpdateCgInventoryDto {

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
  plantLeadTime: number

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  stockUpWeeks: number

  @ApiProperty()
  @IsString()
  @IsOptional()
  growthFactor: string

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  tog: number

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

export class FilterPaginationCgInventoryDto extends PaginationRequestDto {

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  active:Boolean;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.toString())
  status: string;


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
  growthFactor: [number]

  @ApiProperty()
  @IsOptional()
  avgWeeklyConsumption: [number]

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
  productName: [string];

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
  companyName:string[];


  @ApiProperty()
  @IsOptional()
  createdAt: [string]

  @ApiProperty()
  @IsArray()
  @IsOptional()
  orderRecommendationStatus: [string]

  @ApiProperty()
  @IsArray()
  @IsOptional()
  openOrder: [number];

  @ApiProperty()
  @IsArray()
  @IsOptional()
  plantLeadTime: [number];

  @ApiProperty()
  @IsArray()
  @IsOptional()
  togRecommendation: [string];

  @ApiProperty()
  @IsArray()
  @IsOptional()
  group: [string];

  @ApiProperty()
  @IsArray()
  @IsOptional()
  roSigma: [number];

  @ApiProperty()
  @IsArray()
  @IsOptional()
  onHandStatus: [string];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsArray()
  sortBy?: {
    orderKey?: string;
    orderValue?: number;
  }[];

};

export class UpdateStatusCgInventoryDto {
  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  active:Boolean;
};

export class GetDashBoardCgInventoryInfo {
  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  active:Boolean;

};

export class ImportCgInventoryDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  productName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  moq: string;


  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  tog: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  onHandStock: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  qualifiedDemand: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  leadTime: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  stockUpWeeks: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  growthFactor: string;

}
  
export class ViewOtherCgInventoryDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  productId:ObjectId;
};

export class ChangeTogDto {
  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  isConvertFinalToTog:Boolean;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  isUpdateTog:Boolean;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  isNoTogChange:Boolean;

  @ApiProperty()
  @IsString()
  @IsOptional()
  tog:string;
};