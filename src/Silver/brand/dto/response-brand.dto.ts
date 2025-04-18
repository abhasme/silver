import { PartialType, ApiProperty } from '@nestjs/swagger';

export class GetAllBrandDto {

}

export class GetBrandInfoDto {
    @ApiProperty()
    protected readonly data: object;
    constructor(data) {
      return data;
    }
  }
  