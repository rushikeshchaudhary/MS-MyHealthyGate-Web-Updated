import { PharmacyPortalModule } from './pharmacy-portal.module';

describe('PharmacyPortalModule', () => {
  let pharmacyPortalModule: PharmacyPortalModule;

  beforeEach(() => {
    pharmacyPortalModule = new PharmacyPortalModule();
  });

  it('should create an instance', () => {
    expect(pharmacyPortalModule).toBeTruthy();
  });
});
