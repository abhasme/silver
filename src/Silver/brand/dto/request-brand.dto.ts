import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsNotEmpty, IsNumber,IsBoolean} from 'class-validator';
import { Transform } from 'class-transformer';
import { PaginationRequestDto } from 'src/dto/pagination-dto';
export class CreateBrandDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  brand: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  brandCode: number;
};

export class UpdateBrandDto extends CreateBrandDto {

};

export class FilterPaginationBrandDto extends PaginationRequestDto {
  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  active:Boolean;
};

export class UpdateStatusBrandDto {
  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  active:Boolean;
}