import { Test, TestingModule } from '@nestjs/testing';
import { RoMasterController } from './ro-master.controller';

describe('RoMasterController', () => {
  let controller: RoMasterController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RoMasterController],
    }).compile();

    controller = module.get<RoMasterController>(RoMasterController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
