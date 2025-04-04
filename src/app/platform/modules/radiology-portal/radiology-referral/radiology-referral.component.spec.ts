import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RadiologyReferralComponent } from './radiology-referral.component';

describe('RadiologyReferralComponent', () => {
  let component: RadiologyReferralComponent;
  let fixture: ComponentFixture<RadiologyReferralComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RadiologyReferralComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RadiologyReferralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
