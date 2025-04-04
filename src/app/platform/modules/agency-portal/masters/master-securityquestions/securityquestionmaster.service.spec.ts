import { TestBed } from '@angular/core/testing';

import { SecurityquestionmasterService } from './securityquestionmaster.service';

describe('SecurityquestionmasterService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SecurityquestionmasterService = TestBed.get(SecurityquestionmasterService);
    expect(service).toBeTruthy();
  });
});
