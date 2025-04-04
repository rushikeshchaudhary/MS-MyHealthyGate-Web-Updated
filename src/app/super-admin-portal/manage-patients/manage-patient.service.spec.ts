import { TestBed } from '@angular/core/testing';

import { ManagePatientService } from './manage-patient.service';

describe('ManagePatientService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ManagePatientService = TestBed.get(ManagePatientService);
    expect(service).toBeTruthy();
  });
});
