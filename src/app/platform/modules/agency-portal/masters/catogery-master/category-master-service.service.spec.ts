import { TestBed } from '@angular/core/testing';

import { CategoryMasterServiceService } from './category-master-service.service';

describe('CategoryMasterServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CategoryMasterServiceService = TestBed.get(CategoryMasterServiceService);
    expect(service).toBeTruthy();
  });
});
