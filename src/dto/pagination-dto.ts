import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional, IsPositive, IsString,IsArray } from 'class-validator';
/**
 * Pagination Request DTO
 */
export class PaginationRequestDto {
  @ApiProperty()
  @Type(() => Number)
  @IsPositive()
  @IsInt()
  @IsOptional()
  currentPage: number;

  @ApiProperty()
  @Type(() => Number)
  @IsPositive()
  @IsInt()
  @IsOptional()
  recordPerPage: number;

  @ApiProperty()
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  totalDocs: number;

  @ApiProperty()
  @Type(() => Number)
  @IsPositive()
  @IsInt()
  @IsOptional()
  totalPages: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.toString())
  search: string;

  @ApiProperty()
  @IsArray()
  @IsOptional()
  orderBy: [string];
};

export class SearchRequestDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.toString())
  search: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.toString())
  startDate: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.toString())
  endDate: string;

  @ApiProperty()
  @IsOptional()
  productid: string;

};

export class SearchDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.toString())
  search: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.toString())
  startDate: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.toString())
  endDate: string;

  @ApiProperty()
  @IsOptional()
  productid: string;

  @ApiProperty()
  @IsOptional()
  channelPartnerId: string;

  @ApiProperty()
  @IsOptional()
  supplierPartnerId: string;

};



