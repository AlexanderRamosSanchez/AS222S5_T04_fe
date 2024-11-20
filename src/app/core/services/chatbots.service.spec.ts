import { TestBed } from '@angular/core/testing';

import { ChatbotsService } from './chatbots.service';

describe('ChatbotsService', () => {
  let service: ChatbotsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChatbotsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
