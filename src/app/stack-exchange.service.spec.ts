import { TestBed, inject } from '@angular/core/testing';

import { StackExchangeService } from './stack-exchange.service';

describe('StackExchangeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StackExchangeService]
    });
  });

  it('should be created', inject([StackExchangeService], (service: StackExchangeService) => {
    expect(service).toBeTruthy();
  }));
});
