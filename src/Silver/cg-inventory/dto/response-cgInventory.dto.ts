import { PartialType, ApiProperty } from '@nestjs/swagger';
export class GetAllCgInventoryDto {

}

export class GetCgInventoryInfoDto {
    @ApiProperty()
    protected readonly data: object;
    constructor(data) {
      return data;
    }
  }