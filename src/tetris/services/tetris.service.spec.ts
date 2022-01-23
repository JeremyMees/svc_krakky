import { Test, TestingModule } from '@nestjs/testing';
import { TetrisService } from './tetris.service';

describe('TetrisService', () => {
  let service: TetrisService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TetrisService],
    }).compile();

    service = module.get<TetrisService>(TetrisService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
