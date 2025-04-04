import { TestBed } from '@angular/core/testing';

import { SuperadminRaiseticketService } from './superadmin-raiseticket.service';

describe('SuperadminRaiseticketService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SuperadminRaiseticketService = TestBed.get(SuperadminRaiseticketService);
    expect(service).toBeTruthy();
  });
});
