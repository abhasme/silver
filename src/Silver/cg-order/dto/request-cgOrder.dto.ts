import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsNotEmpty, IsNumber, IsBoolean,IsArray } from 'class-validator';
import { Transform } from 'class-transformer';
import { PaginationRequestDto } from 'src/dto/pagination-dto';

export class FilterPaginationCgOrderDto extends PaginationRequestDto {

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  active: Boolean;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.toString())
  flag: string;

  @ApiProperty()
  @IsOptional()
  flags: [string]

  @ApiProperty()
  @IsOptional()
  newField: [string]

  @ApiProperty()
  @IsOptional()
  contactPersonName: [string]

  @ApiProperty()
  @IsOptional()
  itemCode: [string];

  @ApiProperty()
  @IsOptional()
  itemDescription: [string];

  @ApiProperty()
  @IsOptional()
  productName: [string];

  @ApiProperty()
  @IsOptional()
  industry: [string];

  @ApiProperty()
  @IsOptional()
  unit: [string];

  @ApiProperty()
  @IsOptional()
  subcategoryName: [string];

  @ApiProperty()
  @IsOptional()
  categoryName: [string];

  @ApiProperty()
  @IsOptional()
  tog: [number]

  @ApiProperty()
  @IsOptional()
  netFlow: [number]

  @ApiProperty()
  @IsOptional()
  uniqueNumber: [number]

  @ApiProperty()
  @IsOptional()
  qty: [number]

  @ApiProperty()
  @IsOptional()
  qualifiedDemand: [number]

  @ApiProperty()
  @IsOptional()
  onHandStock: [number]

  @ApiProperty()
  @IsOptional()
  createdAt: [string]

  @ApiProperty()
  @IsOptional()
  city: [string]

  @ApiProperty()
  @IsOptional()
  state: [string]

  @ApiProperty()
  @IsOptional()
  openOrder: [number]

  @ApiProperty()
  @IsOptional()
  sapNumber: [string];

  @ApiProperty()
  @IsOptional()
  opNumber: [string];

  @ApiProperty()
  @IsOptional()
  plant: [string];


  @ApiProperty({ required: false })
  @IsOptional()
  dateRange?: {
    from?: string;
    to?: string;
  }[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsArray()
  sortBy?: {
    orderKey?: string;
    orderValue?: number;
  }[];
};

export class UpdateCgOrderDto {
  @ApiProperty()
  @IsOptional()
  qty: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.toString())
  stage: string;


  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  partcialDispatch: Boolean;


  @ApiProperty()
  @IsOptional()
  changeQty: number;


  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  isChangeQty: Boolean;

  

};

export class DashboardCgOrderDto {
  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  active:Boolean;
};

export class AddFindValueDto{
  @ApiProperty()
  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.toString())
  productId: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.toString())
  supplierPartnerId: string;

  @ApiProperty()
  @IsOptional()
  qty: number;

};