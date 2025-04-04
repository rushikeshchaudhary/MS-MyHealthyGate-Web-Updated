import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RadiologyReferralModalComponent } from './radiology-referral-modal.component';

describe('RadiologyReferralModalComponent', () => {
  let component: RadiologyReferralModalComponent;
  let fixture: ComponentFixture<RadiologyReferralModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RadiologyReferralModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RadiologyReferralModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
