import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RadiologyReferralFileUploadComponent } from './radiology-referral-file-upload.component';

describe('RadiologyReferralFileUploadComponent', () => {
  let component: RadiologyReferralFileUploadComponent;
  let fixture: ComponentFixture<RadiologyReferralFileUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RadiologyReferralFileUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RadiologyReferralFileUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
