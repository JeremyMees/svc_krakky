import { Test, TestingModule } from '@nestjs/testing';
import { CardGateway } from './card.gateway';

describe('CardGateway', () => {
  let gateway: CardGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CardGateway],
    }).compile();

    gateway = module.get<CardGateway>(CardGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
