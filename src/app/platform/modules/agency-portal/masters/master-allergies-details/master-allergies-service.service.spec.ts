import { TestBed } from '@angular/core/testing';

import { MasterAllergiesServiceService } from './master-allergies-service.service';

describe('MasterAllergiesServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MasterAllergiesServiceService = TestBed.get(MasterAllergiesServiceService);
    expect(service).toBeTruthy();
  });
});
