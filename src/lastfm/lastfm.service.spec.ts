import { Test, TestingModule } from '@nestjs/testing';
import { LastfmService } from './lastfm.service';

describe('LastfmService', () => {
  let service: LastfmService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LastfmService],
    }).compile();

    service = module.get<LastfmService>(LastfmService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
