import { TestBed } from '@angular/core/testing';

import { SupeAdminDataService } from './supe-admin-data.service';

describe('SupeAdminDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SupeAdminDataService = TestBed.get(SupeAdminDataService);
    expect(service).toBeTruthy();
  });
});
