import { TestBed } from '@angular/core/testing';

import { CompanyInsuranceService } from './company-insurance.service';

describe('CompanyInsuranceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CompanyInsuranceService = TestBed.get(CompanyInsuranceService);
    expect(service).toBeTruthy();
  });
});
