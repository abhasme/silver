import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsNotEmpty, IsNumber,IsBoolean } from 'class-validator';
import { Transform } from 'class-transformer';
import { PaginationRequestDto } from 'src/dto/pagination-dto';
export class CreateCategoryDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @Transform(({ value }) => value?.trim())
    categoryName: string;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    categoryCode: string;
}

export class UpdateCategoryDto extends CreateCategoryDto {

}

export class StatusCategoryDto {
    @ApiProperty()
    @IsString()
    categoryid: string;
  
    @ApiProperty()
    @IsBoolean()
    @IsNotEmpty()
    active:Boolean;
}

export class FilterPaginationUserDto extends PaginationRequestDto {

    @ApiProperty()
    @IsBoolean()
    @IsOptional()
    active:Boolean;

}

export class ImportCategoryDto {
 
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @Transform(({ value }) => value?.trim())
    categoryName: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    categoryCode: string;
  
}