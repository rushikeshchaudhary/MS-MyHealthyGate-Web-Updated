import { TestBed } from '@angular/core/testing';

import { DrugPrescriptionServiceService } from './drug-prescription-service.service';

describe('DrugPrescriptionServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DrugPrescriptionServiceService = TestBed.get(DrugPrescriptionServiceService);
    expect(service).toBeTruthy();
  });
});
