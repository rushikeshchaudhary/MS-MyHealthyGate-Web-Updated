import { LabPaymentModule } from './lab-payment.module';

describe('LabPaymentModule', () => {
  let labPaymentModule: LabPaymentModule;

  beforeEach(() => {
    labPaymentModule = new LabPaymentModule();
  });

  it('should create an instance', () => {
    expect(labPaymentModule).toBeTruthy();
  });
});
