import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsNotEmpty, IsNumber, IsMongoId, IsArray, ValidateNested, MinLength, MaxLength,IsBoolean } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { Types, ObjectId } from "mongoose";
import { PaginationRequestDto } from './pagination-dto';
export class CategoryIdArrayDto {
    @ApiProperty()
    @IsArray()
    @IsOptional()
    @Type(() => String)
    category: string[];

    @ApiProperty()
    @IsArray()
    @IsOptional()
    @Type(() => String)
    exceptids: string[];
}
export class FilterPaginationProductDto extends PaginationRequestDto {
    @ApiProperty()
    @IsString()
    @IsOptional()
    @Transform(({ value }) => value.toString())
    search: string;

    @ApiProperty()
    @IsOptional()
    categories: string[];

    @ApiProperty()
    @IsArray()
    @IsOptional()
    itemCode: [string];

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
    subcategoryName: [string];

    @ApiProperty()
    @IsArray()
    @IsOptional()
    categoryName: [string];

    @ApiProperty()
    @IsArray()
    @IsOptional()
    phone: [string];

    @ApiProperty()
    @IsBoolean()
    @IsOptional()
    active:Boolean;

    @ApiProperty()
    @IsArray()
    @IsOptional()
    unit: [number];


    @ApiProperty()
    @IsArray()
    @IsOptional()
    industry: [string];


    @ApiProperty()
    @IsArray()
    @IsOptional()
    moq: [string];


    @ApiProperty()
    @IsArray()
    @IsOptional()
    factorOfSafety: [string];
    
    @ApiProperty()
    @IsArray()
    @IsOptional()
    stockUpWeeks: [number];

    @ApiProperty()
    @IsArray()
    @IsOptional()
    leadTime: [number];
    @ApiProperty()
    @IsArray()
    @IsOptional()
    manufactureLeadTime: [number];


    @ApiProperty()
    @IsArray()
    @IsOptional()
    weight: [string];

    @ApiProperty()
    @IsArray()
    @IsOptional()
    productPrice: [string];

    @ApiProperty()
    @IsArray()
    @IsOptional()
    LP: [number];


    @ApiProperty()
    @IsArray()
    @IsOptional()
    HP: [string];

    @ApiProperty()
    @IsArray()
    @IsOptional()
    KW: [string];

    @ApiProperty()
    @IsArray()
    @IsOptional()
    productStage: [string];

    @ApiProperty()
    @IsArray()
    @IsOptional()
    modelNo: [string];

    @ApiProperty()
    @IsArray()
    @IsOptional()
    suc_del: [string];

    @ApiProperty()
    @IsArray()
    @IsOptional()
    discount: [string];

    @ApiProperty()
    @IsArray()
    @IsOptional()
    finalPrice: [string];


    @ApiProperty()
    @IsArray()
    @IsOptional()
    brand: [number];

    @ApiProperty()
    @IsArray()
    @IsOptional()
    group: [number];
    
    @ApiProperty({ required: false })
    @IsOptional()
    @IsArray()
    sortBy?: {
      orderKey?: string;
      orderValue?: number;
    }[];
}

export class CreateProductDto {
}