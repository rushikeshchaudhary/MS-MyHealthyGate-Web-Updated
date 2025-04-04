import { TestBed } from '@angular/core/testing';

import { ManageLogsService } from './manage-logs.service';

describe('ManageLogsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ManageLogsService = TestBed.get(ManageLogsService);
    expect(service).toBeTruthy();
  });
});
