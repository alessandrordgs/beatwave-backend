import { Test, TestingModule } from '@nestjs/testing';
import { LastfmController } from './lastfm.controller';
import { LastfmService } from './lastfm.service';

describe('LastfmController', () => {
  let controller: LastfmController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LastfmController],
      providers: [LastfmService],
    }).compile();

    controller = module.get<LastfmController>(LastfmController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
