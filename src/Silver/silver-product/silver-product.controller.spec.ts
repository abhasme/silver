import { Test, TestingModule } from '@nestjs/testing';
import { SilverProductController } from './silver-product.controller';

describe('SilverProductController', () => {
  let controller: SilverProductController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SilverProductController],
    }).compile();

    controller = module.get<SilverProductController>(SilverProductController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
