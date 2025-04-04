import { RadiologyPortalModule } from './radiology-portal.module';

describe('RadiologyPortalModule', () => {
  let radiologyPortalModule: RadiologyPortalModule;

  beforeEach(() => {
    radiologyPortalModule = new RadiologyPortalModule();
  });

  it('should create an instance', () => {
    expect(radiologyPortalModule).toBeTruthy();
  });
});
