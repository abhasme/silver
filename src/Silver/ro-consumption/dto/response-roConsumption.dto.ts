import { PartialType, ApiProperty } from '@nestjs/swagger';
export class GetRoConsumptionInfoDto {
    @ApiProperty()
    protected readonly data: object;
    constructor(data) {
      return data;
    }
  }
  