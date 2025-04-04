import { TestBed } from '@angular/core/testing';

import { ManageStaticPageService } from './manage-static-page.service';

describe('ManageStaticPageService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ManageStaticPageService = TestBed.get(ManageStaticPageService);
    expect(service).toBeTruthy();
  });
});
