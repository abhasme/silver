import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsNotEmpty, IsNumber,IsBoolean} from 'class-validator';
import { Transform } from 'class-transformer';
import { PaginationRequestDto } from 'src/dto/pagination-dto';
export class CreateGroupDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  group: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  groupCode: number;
};

export class UpdateGroupDto extends CreateGroupDto {

};

export class FilterPaginationGroupDto extends PaginationRequestDto {
  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  active:Boolean;
};

export class UpdateStatusGroupDto {
  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  active:Boolean;
}