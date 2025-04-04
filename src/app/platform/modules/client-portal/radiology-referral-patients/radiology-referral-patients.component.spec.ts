import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RadiologyReferralPatientsComponent } from './radiology-referral-patients.component';

describe('RadiologyReferralPatientsComponent', () => {
  let component: RadiologyReferralPatientsComponent;
  let fixture: ComponentFixture<RadiologyReferralPatientsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RadiologyReferralPatientsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RadiologyReferralPatientsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
