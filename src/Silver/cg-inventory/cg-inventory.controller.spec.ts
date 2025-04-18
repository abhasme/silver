import { Test, TestingModule } from '@nestjs/testing';
import { CgInventoryController } from './cg-inventory.controller';

describe('CgInventoryController', () => {
  let controller: CgInventoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CgInventoryController],
    }).compile();

    controller = module.get<CgInventoryController>(CgInventoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
