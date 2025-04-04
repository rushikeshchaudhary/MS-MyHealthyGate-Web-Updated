import { TestBed } from '@angular/core/testing';

import { ManageProvidersService } from './manage-providers.service';

describe('ManageProvidersService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ManageProvidersService = TestBed.get(ManageProvidersService);
    expect(service).toBeTruthy();
  });
});
