import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRadiologyReferralModalComponent } from './add-radiology-referral-modal.component';

describe('AddRadiologyReferralModalComponent', () => {
  let component: AddRadiologyReferralModalComponent;
  let fixture: ComponentFixture<AddRadiologyReferralModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddRadiologyReferralModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddRadiologyReferralModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
