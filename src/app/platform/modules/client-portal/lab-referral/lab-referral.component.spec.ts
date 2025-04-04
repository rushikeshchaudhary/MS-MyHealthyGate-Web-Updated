import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LabReferralComponent } from './lab-referral.component';

describe('LabReferralComponent', () => {
  let component: LabReferralComponent;
  let fixture: ComponentFixture<LabReferralComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LabReferralComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LabReferralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
