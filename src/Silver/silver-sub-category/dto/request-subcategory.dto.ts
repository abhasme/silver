import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsNotEmpty, IsNumber, IsMongoId,IsBoolean } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { Types, ObjectId } from "mongoose";
import { PaginationRequestDto } from 'src/dto/pagination-dto';
export class CreateSubcategoryDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @Transform(({ value }) => value?.trim())
    subcategoryName: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    @Transform(({ value }) => value.toString())
    categoryid: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    @Transform(({ value }) => value?.trim())
    categoryName: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    subCategoryCode: string;
    
    
}

export class UpdateSubcategoryDto extends CreateSubcategoryDto {

}

export class StatusSubcategoryDto {
    @ApiProperty()
    @IsString()
    subcategoryid: string;

    @ApiProperty()
    @IsBoolean()
    @IsNotEmpty()
    active:Boolean;
}

export class FilterPaginationUserDto extends PaginationRequestDto {
    @ApiProperty()
    @IsString()
    @IsOptional()
    @Transform(({ value }) => value.toString())
    categoryId: string;

    @ApiProperty()
    @IsBoolean()
    @IsOptional()
    active:Boolean;
}