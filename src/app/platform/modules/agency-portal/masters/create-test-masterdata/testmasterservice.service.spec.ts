import { TestBed } from '@angular/core/testing';

import { TestmasterserviceService } from './testmasterservice.service';

describe('TestmasterserviceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TestmasterserviceService = TestBed.get(TestmasterserviceService);
    expect(service).toBeTruthy();
  });
});
