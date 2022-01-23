import { Test, TestingModule } from '@nestjs/testing';
import { TetrisController } from './tetris.controller';

describe('TetrisController', () => {
  let controller: TetrisController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TetrisController],
    }).compile();

    controller = module.get<TetrisController>(TetrisController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
