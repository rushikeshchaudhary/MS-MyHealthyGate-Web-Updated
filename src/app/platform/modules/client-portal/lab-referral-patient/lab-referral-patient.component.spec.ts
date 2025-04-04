import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LabReferralPatientComponent } from './lab-referral-patient.component';

describe('LabReferralPatientComponent', () => {
  let component: LabReferralPatientComponent;
  let fixture: ComponentFixture<LabReferralPatientComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LabReferralPatientComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LabReferralPatientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
