import { TestBed } from '@angular/core/testing';

import { ImmunizationserviceService } from './immunizationservice.service';

describe('ImmunizationserviceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ImmunizationserviceService = TestBed.get(ImmunizationserviceService);
    expect(service).toBeTruthy();
  });
});
