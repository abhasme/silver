import { PartialType, ApiProperty } from '@nestjs/swagger';

export class GetAllUnitto {

}

export class GetUnitInfoDto {
    @ApiProperty()
    protected readonly data: object;
    constructor(data) {
      return data;
    }
  }
  