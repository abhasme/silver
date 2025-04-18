import { Test, TestingModule } from '@nestjs/testing';
import { RoInventoryController } from './ro-inventory.controller';

describe('RoInventoryController', () => {
  let controller: RoInventoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RoInventoryController],
    }).compile();

    controller = module.get<RoInventoryController>(RoInventoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
