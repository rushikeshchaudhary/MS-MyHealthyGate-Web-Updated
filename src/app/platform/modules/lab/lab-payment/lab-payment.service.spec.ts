import { TestBed } from '@angular/core/testing';

import { LabPaymentService } from './lab-payment.service';

describe('LabPaymentService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LabPaymentService = TestBed.get(LabPaymentService);
    expect(service).toBeTruthy();
  });
});
