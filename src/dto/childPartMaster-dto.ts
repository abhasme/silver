import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsNotEmpty, IsNumber, IsMongoId, IsArray, ValidateNested, MinLength, MaxLength,IsBoolean} from 'class-validator';
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
};
export class FilterPaginationChildPartMasterDto extends PaginationRequestDto {
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
    
};

export class CreateChildPartMasterDto {
   
};