import { TestBed } from '@angular/core/testing';

import { MsChatService } from './ms-chat.service';

describe('MsChatService', () => {
  let service: MsChatService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MsChatService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
