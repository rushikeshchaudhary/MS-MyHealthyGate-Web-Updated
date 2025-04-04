import { TestBed } from '@angular/core/testing';

import { SuperAdminnotificationService } from './super-adminnotification.service';

describe('SuperAdminnotificationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SuperAdminnotificationService = TestBed.get(SuperAdminnotificationService);
    expect(service).toBeTruthy();
  });
});
