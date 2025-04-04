import { TestBed } from '@angular/core/testing';

import { ManageLocationService } from './manage-location.service';

describe('ManageLocationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ManageLocationService = TestBed.get(ManageLocationService);
    expect(service).toBeTruthy();
  });
});
