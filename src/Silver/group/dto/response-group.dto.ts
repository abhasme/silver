import { PartialType, ApiProperty } from '@nestjs/swagger';

export class GetAllGroupDto {

}

export class GetGroupInfoDto {
    @ApiProperty()
    protected readonly data: object;
    constructor(data) {
      return data;
    }
  }
  